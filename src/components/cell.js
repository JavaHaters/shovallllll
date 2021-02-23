import "../App.css";
import React from "react";
import styled from "styled-components";

export class Cell extends React.Component {
  render() {
    const { value, onClick, onLeftClick } = this.props;

    const StyledCell = styled.button`
      width: 2em;
      height: 2em;
    `;

    return (
      <StyledCell onClick={() => onClick()} onContextMenu={() => onLeftClick()}>
        {value.emoji}
      </StyledCell>
    );
  }
}

export default Cell;
