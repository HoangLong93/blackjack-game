import React from 'react';
import styled from 'styled-components'

const CardContainer = styled.div`
  height: 150px;
  color: ${props => props.color === 'red' ? 'red' : null};
  width: 100px;
  background-color: #BFBFBF;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Card = ({ number, suit, showCard }) => {
  const combo = (number) ? `${number}${suit}` : null;
  const color = (suit === '♦' || suit === '♥') ? 'red' : 'black';

  return (
    <td>
      <CardContainer color={color}>
        {showCard ? combo : ''}
      </CardContainer>
    </td>
  );
};