import React, { Component } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import { debounce } from 'throttle-debounce'

import * as api from './services/api'
import ShowMarkdown from './components/ShowMarkdown'
import TextEditor from './components/TextEditor'
import Menu from './components/Menu'

import {
  matchEmptyCheckbox,
  matchCheckedCheckbox
} from './regex'

class App extends Component {
  constructor (props) {
    super(props)

    this.saveMarkdown = debounce(1000, this.saveMarkdown)
  }

  state = {
    newNoteTitle: 'New Note',
    notes: [],
    id: "",
    title: "New Note",
    updatedAt: 0,
    markdown: "",
    highlights: "",
    loading: true,
    error: null,
    noteTitleEditing: null,
    fullscreen: false
  }

  async componentWillMount () {
    try {
      const snapshot = await api.getNotes()

      if (snapshot.val()) {
        this.setState({
          notes: Object.values(snapshot.val()),
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      }
    } catch (error) {
      this.setState({
        error: error,
        loading: false
      })
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown)
  }

  toggleFullscreen = () => {
    this.setState({
      fullscreen: !this.state.fullscreen
    })
  }

  handleKeyDown = (event) => {
    if (event.key === 'F2') {
      event.preventDefault()

      this.setState({
        newNoteTitle: this.state.title,
        noteTitleEditing: this.state.id
      })
    }
  }

  saveMarkdown = (markdown) => {
    if (this.state.id !== "") {
      api.updateNote(this.state.id, markdown)
    }
  }

  handleViewNote = (id) => async (event) => {
    this.setState({ id })

    try {
      const snapshot = await api.getNote(id)

      if (snapshot.val()) {
        this.setState({
          id: id,
          ...snapshot.val()
        })
      } else {
        this.setState({
          id: id,
          markdown: "",
          createdAt: Date.now()
        })
      }
    } catch (error) {
      this.setState({ error })
    }
  }

  handleNewNote = async () => {
    const newNote = {
      title: 'New Note',
      markdown: '',
      createdAt: Date.now()
    }

    const noteId = await api.createNote({ ...newNote })

    this.setState({
      notes: [ { ...newNote, id: noteId }, ...this.state.notes ],
      noteTitleEditing: noteId,
      id: noteId
    })
  }

  handleDeleteNote = (noteId) => () => {
    api.deleteNote(noteId)

    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    })
  }

  handleNewNoteTitleChange = (event) => {
    this.setState({ newNoteTitle: event.currentTarget.value })
  }

  handleNewNoteTitleSubmit = noteId => event => {
    event.preventDefault()

    api.updateNoteTitle(noteId, this.state.newNoteTitle)

    this.setState({
      newNoteTitle: 'New Note',
      noteTitleEditing: '',
      notes: this.state.notes.map(note => {
        if (note.id === noteId) {
          return {
            ...note,
            title: this.state.newNoteTitle,
          }
        } else {
          return note
        }
      })
    })
  }

  applyHighlights (text) {
    return Prism.highlight(text, Prism.languages.markdown, 'markdown')
      .replace(matchEmptyCheckbox, '<span class="checkbox">$&</span>')
      .replace(matchCheckedCheckbox, '<span class="checkbox checked">$&</span>')
  }

  onNoteChange = (cursorPosition, value) => {
    this.setState({
      markdown: value,
    })

    this.saveMarkdown(value)
    this.applyHighlights(value)
  }

  render() {
    if (!this.state.loading) {
      return (
        <div style={{ display: 'flex'}}>
          <Menu
            onViewNote={this.handleViewNote}
            onNewNote={this.handleNewNote}
            onNewNoteTitleChange={this.handleNewNoteTitleChange}
            onNewNoteTitleSubmit={this.handleNewNoteTitleSubmit}
            noteTitleEditing={this.state.noteTitleEditing}
            notes={this.state.notes}
            activeItem={this.state.id}
            deleteNote={this.handleDeleteNote}
          />

          <TextEditor
            onChange={this.onNoteChange}
            value={this.state.markdown}
            highlights={this.applyHighlights(this.state.markdown)}
            toggleFullscreen={this.toggleFullscreen}
            isFullscreen={this.state.fullscreen}
          />

          <ShowMarkdown markdown={this.state.markdown} />
        </div>
      );
    } else {
      return (
        <div>Loading...</div>
      )
    }
  }
}

export default App;
