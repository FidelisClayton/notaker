import React from 'react'
import styled from 'styled-components'

const StyledMenu = styled.nav`
  padding-top: 1em;
  padding-bottom: 1em;
  width: 250px;
  height: 100vh;
  background: #191e24;
  color: #FFFFFF;

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  a {
    text-decoration: none;
    color: #FFFFFF;
  }

`

const StyledMenuItem = styled.li`
  padding: 10px;
  color: ${props => props.active ? 'rgba(255, 255, 255, 0.8)' : 'rgba(255, 255, 255, 0.3)'};

  &:hover {
    color: rgba(255, 255, 255, 0.8);
  }
`

const Menu = ({ onViewNote }) => (
  <StyledMenu>
    <ul>
      <a
        href="#/nota1"
        onClick={onViewNote('nota1')}
      >
        <StyledMenuItem active>
          Nota 1
        </StyledMenuItem>
      </a>
      <a
        href="#/nota2"
        onClick={onViewNote('nota2')}
      >
        <StyledMenuItem>
          Nota 2
        </StyledMenuItem>
      </a>
    </ul>
  </StyledMenu>
)

export default Menu
