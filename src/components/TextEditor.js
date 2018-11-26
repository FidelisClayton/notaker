import React, { Component } from 'react'
import styled from 'styled-components'
import collapse from '../assets/collapse.svg'
import expand from '../assets/expand.svg'

const Container = styled.div`
  position: relative;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  flex: 1;
  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #272E36;
  padding-bottom: 1em;
  padding-left: 20px;
  display: flex;
  align-items: center;

  ${props => props.fullscreen && `
    position: absolute;
    z-index: 100;
    display: flex;
    width: 100%;
    box-sizing: border-box;
    justify-content: center;

    .text-editor,
    .backdrop {
      width: 50vw;
    }

    .highlights {
      width: calc(50vw - 15px);
    }

    .backdrop {
      overflow-y: hidden;
    }
  `}
`

const Highlights = styled.div`
  line-height: normal;
  white-space: pre-wrap;
  word-break: break-word;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  width: 100%;
  resize: none;
  border: 0;
  margin: 0;
  padding: 0;
  color: #FFFFFF;
  background: transparent;
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
  position: relative;
  overflow-y: auto;
  height: 90vh;
`

const StyledTextEditor = styled.textarea`
  font-family: 'IBM Plex Mono', monospace;
  font-size: 1rem;
  width: calc(100% - 20px);
  height: 90vh;
  resize: none;
  border: 0;
  margin: 0;
  padding: 0;
  background: transparent;
  box-sizing: border-box;
  outline: none;
  position: absolute;
  z-index: 2;
  color: transparent;
  caret-color: red;
`

const Collapse = styled.img`
  width: 20px;
  position: fixed;
  cursor: pointer;
  z-index: 101;
  opacity: 0.3;
  top: 20px;
  left: calc(50vw + 70px);

  &:hover {
    opacity: 0.8;
  }

  ${props => props.collapsed && `
    left: auto;
    right: 20px;
  `}
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
      <Container fullscreen={this.props.isFullscreen}>
        { this.props.isFullscreen && (
          <Collapse
            src={collapse}
            onClick={this.props.toggleFullscreen}
            collapsed
          />
        )}

        <Backdrop
          className="backdrop"
          ref={this.backdropRef}
        >
          { !this.props.isFullscreen && (
            <Collapse
              src={expand}
              onClick={this.props.toggleFullscreen}
            />
          )}

          <Highlights
            className="highlights language-markdown"
            dangerouslySetInnerHTML={{ __html: this.props.highlights }}
          />
        </Backdrop>

        <StyledTextEditor
          className="text-editor"
          value={this.props.value}
          onChange={this.handleOnChange}
          onScroll={this.handleTextAreaScroll}
          ref={this.textAreaRef}
          autoFocus
        />
      </Container>
    )
  }
}

export default TextEditor
