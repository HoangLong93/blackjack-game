import React, {Fragment} from 'react';
import styled from 'styled-components'

import { Card } from '../Card'

const CardsContainer = styled.div`
  border: ${props => props.highlight ? 'solid 5px #50b651' : null};
  transition: border-width 0.6s linear;
  padding: 0 10px;
  margin: auto;
`
const CardTable = styled.table`
  margin: 0 auto;
`
const StrongParagraph = styled.p`
  font-weight: bold;
`
const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
`

export const Board = ({ player, inputChange, placeBet, showCard, highlight }) => {
  const { name, cards, count, isDealer, wallet, message, currentBet, inputValue } = player
  const showPlayerInfo = <Fragment>
    <StrongParagraph>{ message }</StrongParagraph>
    
    <p>Wallet: ${ wallet }</p>
    {
      !currentBet ? 
      <FlexContainer>            
        <form>
          <input type="text" name="bet" placeholder="" value={inputValue} onChange={(e) => inputChange(e, name)}/>
        </form>
        <button onClick={() => placeBet(name)}>Place Bet</button>
      </FlexContainer>
      : null
    }
  </Fragment>

  return (
    <CardsContainer highlight={highlight}>
      <p>{name}{showCard ? `'s Hand (${ count })` : ''}</p>
      <CardTable>
        <tbody>
          <tr>
            { cards.map((card, i) => {
              return <Card key={i} number={card.number} suit={card.suit} showCard={showCard}/>;
            }) }
          </tr>
        </tbody>
      </CardTable>
        
      {!isDealer 
      ? showPlayerInfo
      : null}
    </CardsContainer>
  );
};