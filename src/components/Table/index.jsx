import React, { Component, Fragment } from 'react';
import styled from 'styled-components'

import { Board } from '../Board'
import { getRandomCard, getCount, dealerDraw, getWinner, dealCards } from '../../shared/misc'

const PlayerBoardContainer = styled.div`
  display: flex;
  overflow: scroll
`
const FlexContainer = styled.div`
  display: flex;
  justify-content: center;
`

export class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dealer: null,
      players: props.players,
      position: 0,
      showCard: false,
    };
  }

  showCard = () => {
    const playersStateCopy = Object.assign([], this.state.players);
    let betUnplaced = 0
    const newPlayersStateCopy = playersStateCopy.map(player => {
      if ( player.currentBet === null) {
        player.message = "Please place bet!"
        betUnplaced++
      }
      return player
    })
    if (betUnplaced > 0) {
      this.setState({players: newPlayersStateCopy});
    } else {
      this.setState({showCard: true})
    }
  }

  startHand = () => {
    const { players, dealer } = dealCards(this.state.players);

    this.setState({
      dealer,
      players,
      position: 0,
      showCard: false,
    });
  }
  
  placeBet = (name) => {
    const playersStateCopy = Object.assign([], this.state.players);
    const newPlayersStateCopy = playersStateCopy.map(player => {
      if ( player.name === name) {
        const currentBet = player.inputValue;
        if (currentBet > player.wallet) {
          player.message = 'Insufficient funds to bet that amount.';
        } else if (currentBet % 1 !== 0) {
          player.message = 'Please bet whole numbers only.';
        } else {
          // Deduct current bet from wallet
          player.wallet -= currentBet;
          player.inputValue = ''
          player.currentBet = currentBet
          player.message = ''
        }
      }
      return player
    })
    this.setState({players: newPlayersStateCopy});
  }
  
  hit = () => {
    if (this.state.position < this.state.players.length) {
      const randomCard = getRandomCard();

      const playersStateCopy = Object.assign([], this.state.players);
      let currentPlayerStateCopy = playersStateCopy[this.state.position]
      currentPlayerStateCopy.cards.push(randomCard);
      currentPlayerStateCopy.count = getCount(currentPlayerStateCopy.cards);

      if (currentPlayerStateCopy.count > 21) {
        currentPlayerStateCopy.gameOver = true
        currentPlayerStateCopy.message = 'BUST!'
        this.setState({ players: playersStateCopy, position: this.state.position + 1 }, () => {
          if (this.state.position === this.state.players.length) {
            this.revealDealerCards();
          }
        });
      } else {
        this.setState({ players: playersStateCopy });
      }
    } else {
      this.setState({ message: 'Please place bet.' });
    }
  }

  revealDealerCards = () => {
    const playersStateCopy = Object.assign([], this.state.players);

    const randomCard = getRandomCard();
    let dealer = this.state.dealer;
    dealer.cards.pop();
    dealer.cards.push(randomCard);
    dealer.count = getCount(dealer.cards);

    // Keep drawing cards until count is 17 or more
    while(dealer.count < 17) {
      dealer = dealerDraw(dealer);
    }

    if (dealer.count > 21) {
      const newPlayersStateCopy = playersStateCopy.map(player => {
        if (!player.gameOver) {
          player.wallet += player.currentBet * 2;
          player.message = 'Dealer bust! You win!'
        }
        return player
      });
      this.setState({
        dealer,
        players: newPlayersStateCopy,
        position: this.state.position + 1
      })
    } else {
      const newPlayersStateCopy = playersStateCopy.map(player => {
        if (!player.gameOver) {
          const winner = getWinner(dealer, player);
          if (winner === 'dealer') {
            player.message = 'Dealer wins...';
          } else if (winner === 'player') {
            player.wallet += player.currentBet * 2;
            player.message = 'You win!';
          } else {
            player.wallet += player.currentBet;
            player.message = 'Draw';
          }
        }
        return player
      });
      this.setState({
        dealer,
        players: newPlayersStateCopy,
        position: this.state.position + 1
      });
    }
  }
  
  stand = () => {
    if (this.state.position === this.state.players.length - 1) {
      this.revealDealerCards()
    } else {
      this.setState({position: this.state.position + 1})
    }
  }
  
  inputChange = (e, name) => {
    const playersStateCopy = Object.assign([], this.state.players);
    const newPlayersStateCopy = playersStateCopy.map(player => {
      if ( player.name === name) {
        player.inputValue = +e.target.value
      }
      return player
    })
    this.setState({players: newPlayersStateCopy});
  }
  
  componentWillMount() {
    this.startHand();
  }
  
  render() {
    return (
      <div>
        <FlexContainer>
          <button onClick={() => {this.props.startNewGame()}}>New Game</button>
          {!this.state.showCard
          ? <button onClick={() => {this.showCard()}}>Deal Card</button>
          : <Fragment>
            {this.state.position >= this.state.players.length 
              ? <button onClick={() => {this.startHand()}}>Continue</button>
              : <Fragment>
                <button onClick={() => {this.hit()}}>Hit</button>
                <button onClick={() => {this.stand()}}>Stand</button>  
              </Fragment>}
          </Fragment>}
        </FlexContainer>

        <Board 
          player={this.state.dealer}
          showCard={this.state.showCard}
        />

        <PlayerBoardContainer>
          {this.state.players.map((player, i) => <Board 
            key={player.name}
            player={player}
            inputChange={this.inputChange}
            placeBet={this.placeBet}
            showCard={this.state.showCard}
            highlight={this.state.showCard && i === this.state.position}
          />)}
        </PlayerBoardContainer>
      </div>
    );
  }
}