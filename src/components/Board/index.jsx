import React, {Fragment} from 'react';
import { Card } from '../Card'

export const Board = ({ player, wallet, message, currentBet, gameOver, inputValue, inputChange, placeBet, startNewGame }) => {
  const { name, cards, count, isDealer } = player

  return (
    <Fragment>
      <p>{name}'s Hand ({ count })</p>
      <table className="cards">
        <tbody>
          <tr>
            { cards.map((card, i) => {
              return <Card key={i} number={card.number} suit={card.suit}/>;
            }) }
          </tr>
        </tbody>
      </table>
        
      {!isDealer 
      ? <Fragment>
        <p>{ message }</p>
        
        <p>Wallet: ${ wallet }</p>
        {
          !currentBet ? 
          <div className="input-bet">            
            <form>
              <input type="text" name="bet" placeholder="" value={inputValue} onChange={inputChange}/>
            </form>
            <button onClick={placeBet}>Place Bet</button>
          </div>
          : null
        }
        {
          gameOver ?
          <div className="buttons">
            <button onClick={() => startNewGame('continue')}>Continue</button>
          </div>
          : null
        }
      </Fragment>
      : null}
    </Fragment>
  );
};