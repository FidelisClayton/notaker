import React, { Component } from 'react'
import styled from 'styled-components'
import ReactHtmlParser from 'react-html-parser'

const Container = styled.div`
  position: relative;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  flex: 1;
  height: 100vh;
  overflow-y: hidden;
  box-sizing: border-box;
  background-color: #272E36;
  padding-bottom: 1em;
`

const Highlights = styled.div`
  line-height: normal;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  resize: none;
  border: 0;
  margin: 0;
  padding: 0;
  color: #FFFFFF;
  background: transparent;
  padding: 1em;
  box-sizing: border-box;
  outline: none;

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  mark.title {
    background-color: transparent;
    color: #13afcc;
    font-weight: bold;
  }

  .checkbox:not(.checked) {
    color: #a72a2a;
  }

  .checkbox.checked {
    color: #4be411;
  }
`

const Backdrop = styled.div`
  overflow-y: auto;
  height: 100%;
`

const StyledTextEditor = styled.textarea`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  width: 100%;
  height: 100%;
  resize: none;
  border: 0;
  margin: 0;
  padding: 0;
  color: #FFFFFF;
  background: transparent;
  padding: 1em;
  box-sizing: border-box;
  outline: none;
  position: absolute;
  top: 0;
  z-index: 2;
  color: transparent;
  caret-color: red;
`

class TextEditor extends Component {
  constructor(props) {
    super(props)

    this.textAreaRef = React.createRef()
    this.backdropRef = React.createRef()

    this.handleTextAreaScroll = this.handleTextAreaScroll.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
  }

  handleTextAreaScroll (event) {
    this.backdropRef.current.scrollTop = this.textAreaRef.current.scrollTop
  }

  handleOnChange (event) {
    const cursorPosition = this.textAreaRef.current.selectionStart
    const value = event.currentTarget.value

    this.props.onChange(cursorPosition, value)
  }

  render () {
    return (
      <Container>
        <Backdrop ref={this.backdropRef}>
          <Highlights
            className="highlights language-markdown"
            dangerouslySetInnerHTML={{ __html: this.props.highlights }}
          />
        </Backdrop>

        <StyledTextEditor
          value={this.props.value}
          onChange={this.handleOnChange}
          onScroll={this.handleTextAreaScroll}
          ref={this.textAreaRef}
        />
      </Container>
    )
  }
}

export default TextEditor
