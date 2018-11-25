import React from 'react'
import styled from 'styled-components'
import MenuDivider from './MenuDivider'

import garbage from '../assets/garbage.svg'

const StyledMenu = styled.nav`
  padding: 1em;
  width: 250px;
  height: 100vh;
  background: #191e24;
  color: #FFFFFF;
  box-sizing: border-box;
  font-family: 'IBM Plex Sans', sans-serif;

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
  display: flex;
  justify-content: space-between;

  &:hover {
    color: rgba(255, 255, 255, 0.8);

    img {
      opacity: 0.8;
    }
  }

  .title {
    flex: 1;
  }

  input {
    background: transparent;
    outline: none;
    border: none;
    border-bottom: 1px solid white;
    padding: 0;
    color: rgba(255,255,255,0.8);
    font-size: 1rem;
  }
`

const ImageIcon = styled.img`
  width: 12px;
  opacity: 0.3;

  &:hover {
    opacity: 1;
  }
`

const Menu = ({
  onViewNote,
  onNewNote,
  onNewNoteTitleChange,
  onNewNoteTitleSubmit,
  noteTitleEditing,
  notes,
  activeItem,
  deleteNote
}) => (
  <StyledMenu>
    <MenuDivider
      actionIcon="+"
      onActionClick={onNewNote}
    >
      My notes
    </MenuDivider>

    <ul>
      { notes.map(note => (
        <a
          href={`#/${note.id}`}
          key={note.id}
        >
          { note.id === noteTitleEditing && (
            <StyledMenuItem active={activeItem === note.id}>
              <form onSubmit={onNewNoteTitleSubmit(note.id)}>
                <input
                  autoFocus
                  defaultValue={note.title}
                  onChange={onNewNoteTitleChange}
                  onBlur={onNewNoteTitleSubmit(note.id)}
                />
              </form>
            </StyledMenuItem>
          )}

          { note.id !== noteTitleEditing && (
            <StyledMenuItem active={activeItem === note.id}>
              <div className="title" onClick={onViewNote(note.id)}>
                { note.title }
              </div>

              <div>
                <ImageIcon
                  onClick={deleteNote(note.id)}
                  src={garbage}
                />
              </div>
            </StyledMenuItem>
          )}
        </a>
      ))}
    </ul>
  </StyledMenu>
)

export default Menu
