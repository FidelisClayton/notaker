import React, { Component } from 'react'
import { debounce } from 'throttle-debounce'
import removeMd from 'remove-markdown'

import { db } from './firebase'
import ShowMarkdown from './components/ShowMarkdown'
import TextEditor from './components/TextEditor'
import Menu from './components/Menu'

class App extends Component {
  constructor (props) {
    super(props)

    this.saveMarkdown = debounce(1000, this.saveMarkdown)
  }

  state = {
    id: "teste",
    title: "New Note",
    updatedAt: 0,
    markdown: ""
  }

  componentDidMount () {
    db.ref(this.state.id).once('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({ ...snapshot.val() })
      }
    })
  }

  saveMarkdown = () => {
    db.ref(this.state.id).set({
      updatedAt: Date.now(),
      markdown: this.state.markdown
    })
  }

  handleViewNote = (id) => (event) => {
    db.ref(id).once('value', (snapshot) => {
      if (snapshot.val()) {
        this.setState({ ...snapshot.val() })
      } else {
        this.setState({ id: id, markdown: "", createdAt: Date.now() })
      }
    })
  }

  onNoteChange = (event) => {
    const value = event.currentTarget.value
    const valueLines = value.split('\n')
    const title = valueLines.length > 0 ? removeMd(valueLines[0]) : 'New Note'

    this.setState({
      ...this.state,
      title,
      markdown: event.currentTarget.value
    })

    this.saveMarkdown()
  }

  render() {
    return (
      <div style={{ display: 'flex'}}>
        <Menu onViewNote={this.handleViewNote} />
        <TextEditor
          onChange={this.onNoteChange}
          value={this.state.markdown}
        />

        <ShowMarkdown markdown={this.state.markdown} />
      </div>
    );
  }
}

export default App;
