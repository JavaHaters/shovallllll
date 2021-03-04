import "../App.css";
import React from "react";
import styled from "styled-components";

export function Cell(props) {
  const { value, onClick } = props;

  return (
    <StyledCell
      value={value}
      onClick={() => onClick()}
      onContextMenu={(e) => {
        e.preventDefault();
        props.onLeftClick();
      }}
    >
      {value.emoji}
    </StyledCell>
  );
}

const StyledCell = styled.button`
  font-weight: bold;
  color: white;
  font-size: 1.5em;
  -webkit-text-stroke: 1.5px black;
  width: 60px;
  height: 60px;
  margin: 0px;
  padding: 0px;
  vertical-align: top;

  ${({ value }) =>
    (!value.isRevealed && `background: rgb(80,80,80);`) ||
    (value.isRevealed &&
      `	border-top-color: #050505;
    border-top-width: 2.5px;
  border-bottom-color: #eeeeee;
  border-bottom-width: 1px;
       background: rgb(20,20,20);`)};
`;

export default Cell;
