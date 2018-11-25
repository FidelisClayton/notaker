import React, { Component } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import { debounce } from 'throttle-debounce'
import removeMd from 'remove-markdown'
import uuidv4 from 'uuid/v4'

import { db } from './firebase'
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
    noteTitleEditing: null
  }

  async componentWillMount () {
    try {
      const snapshot = await db.ref('/notes-indexes').once('value')

      if (snapshot.val()) {
        this.setState({
          notes: Object.values(snapshot.val()),
          loading: false
        })
      }
    } catch (error) {
      this.setState({
        error: error
      })
    }
  }

  componentDidMount () {
    document.addEventListener('keydown', this.handleKeyDown)
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.handleKeyDown)
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
    db.ref(`/notes/${this.state.id}`).set({
      updatedAt: Date.now(),
      markdown: markdown
    })
  }

  handleViewNote = (id) => async (event) => {
    this.setState({ id })

    try {
      const snapshot = db.ref(`/notes/${id}`).once('value')

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

  handleNewNote = () => {
    const id = uuidv4()

    db.ref(`/notes/${id}`).set({
      markdown: '',
      createdAt: Date.now()
    })

    const newNote = {
      id: id,
      title: 'New Note',
      markdown: '',
      createdAt: Date.now()
    }

    this.setState({
      notes: [ newNote, ...this.state.notes ],
      noteTitleEditing: id
    })
  }

  handleDeleteNote = (noteId) => () => {
    db.ref(`/notes/${noteId}`).remove()
    db.ref(`/notes-indexes/${noteId}`).remove()

    this.setState({
      notes: this.state.notes.filter(note => note.id !== noteId)
    })
  }

  handleNewNoteTitleChange = (event) => {
    this.setState({
      newNoteTitle: event.currentTarget.value
    })
  }

  handleNewNoteTitleSubmit = noteId => event => {
    event.preventDefault()

    db.ref(`/notes-indexes/${noteId}/title`).set(this.state.newNoteTitle)

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

    db.ref(`/notes-indexes/${noteId}`).set({
      id: noteId,
      title: this.state.newNoteTitle
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
