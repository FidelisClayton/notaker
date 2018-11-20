import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import convert from 'htmr'

import md from '../markdown'

const StyledShowMarkdown = styled.div`
  box-sizing: border-box;
  padding: 1em;
  flex: 1;
  background: #FFFFFF;
  color: #272E36;
  font-family: 'IBM Plex Serif', serif;
  font-size: 22px;
  line-height: 1.5;
  height: 100vh;
  overflow-y: overlay;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: bold;
    margin-top: 1em;
  }

  p {
    margin-bottom: 1em;
  }

  h1 { font-size: 2.25rem; }
  h2 { font-size: 2rem; }
  h3 { font-size: 1.75rem; }
  h4 { font-size: 1.50rem; }
  h5 { font-size: 1.25rem; }
  h6 { font-size: 1rem; }

  img {
    max-width: 100%;
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }

  pre {
    line-height: 0.8;
    color: #f8f8f2;
    background-color: #272E36;
    width: 100%;
    overflow-x: overlay;
    margin-left: -1em;
    padding: 1em;
  }

  code {
    font-family: 'IBM Plex Mono', monospace;
    font-size: 0.8rem;
  }

  a {
    color: #de4d1f;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`

const ShowMarkdown = ({ markdown }) => (
  <StyledShowMarkdown>
    { convert(md.render(markdown)) }
  </StyledShowMarkdown>
)

ShowMarkdown.propTypes = {
  markdown: PropTypes.string
}

export default ShowMarkdown
