import React, { Component } from 'react'
import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import { debounce } from 'throttle-debounce'
import removeMd from 'remove-markdown'

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
    id: "teste",
    title: "New Note",
    updatedAt: 0,
    markdown: "",
    highlights: "",
    loading: true
  }

  componentWillMount () {
    db.ref(this.state.id).once('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({
          ...snapshot.val(),
          loading: false
        })
      }
    })
  }

  saveMarkdown = (markdown) => {
    db.ref(this.state.id).set({
      updatedAt: Date.now(),
      markdown: markdown
    })
  }

  handleViewNote = (id) => (event) => {
    db.ref(id).once('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({ ...snapshot.val() })
      } else {
        this.setState({
          id: id,
          markdown: "",
          createdAt: Date.now()
        })
      }
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
          <Menu onViewNote={this.handleViewNote} />
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
