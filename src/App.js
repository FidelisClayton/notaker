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
    loading: true
  }

  componentWillMount () {
    db.ref('/notes-indexes').once('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          notes: Object.values(snapshot.val()),
          loading: false
        })
      }
    })
  }

  saveMarkdown = (markdown) => {
    db.ref(`/notes/${this.state.id}`).set({
      updatedAt: Date.now(),
      markdown: markdown
    })
  }

  handleViewNote = (id) => (event) => {
    this.setState({
      id
    })

    db.ref(`/notes/${id}`).once('value', (snapshot) => {
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
    })
  }

  handleNewNote = () => {
    const id = uuidv4()

    db.ref(`/notes/${id}`).set({
      markdown: '',
      createdAt: Date.now()
    })

    const newNote = {
      id: id,
      title: 'New Title',
      markdown: '',
      createdAt: Date.now()
    }

    this.setState({
      notes: [ newNote, ...this.state.notes ],
      noteTitleEditing: id
    })
  }

  handleNewNoteTitleChange = (event) => {
    this.setState({
      newNoteTitle: event.currentTarget.value
    })
  }

  handleNewNoteTitleSubmit = noteId => event => {
    event.preventDefault()

    db.ref(`/${noteId}/title`).set(this.state.newNoteTitle)

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
