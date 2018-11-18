import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import convert from 'htmr'

import md from '../markdown'

const StyledShowMarkdown = styled.div`
  flex: 1;
  background: #FFFFFF;
  color: #272E36;
  font-family: 'Montserrat', sans-serif;
  height: 100vh;
  overflow-y: scroll;
`

const H1 = styled.h1`
  color: green;
`

const transform = {
  h1: H1
}

const ShowMarkdown = ({ markdown }) => (
  <StyledShowMarkdown>
    { convert(md.render(markdown), { transform }) }
  </StyledShowMarkdown>
)

ShowMarkdown.propTypes = {
  markdown: PropTypes.string
}

export default ShowMarkdown
