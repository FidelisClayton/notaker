import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'

const StyledDivider = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;

  button {
    padding: 0;
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding-left: 10px;
    outline: none;
  }
`

const MenuDivider = ({
  children,
  actionIcon,
  onActionClick,
  ...props
}) => (
  <StyledDivider {...props}>
    { children }
    { actionIcon && (
      <button onClick={onActionClick}>
        { actionIcon }
      </button>
    )}
  </StyledDivider>
)

MenuDivider.propTypes = {
  onActionClick: PropTypes.func,
  actionIcon: PropTypes.node
}

export default MenuDivider
