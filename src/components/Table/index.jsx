import React, { Component, Fragment } from 'react';
import styled from 'styled-components'

import { Board } from '../Board'
import { getRandomCard, getCount, dealerDraw } from '../../shared/misc'

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
  
  dealCards() {
    const players = this.state.players.map(player => {
      const playerCard1 = getRandomCard();
      const playerCard2 = getRandomCard();
      const playerStartingHand = [playerCard1, playerCard2];
    
      return {
        ...player,
        cards: playerStartingHand,
        count: getCount(playerStartingHand),
        inputValue: '',
        currentBet: null,
        gameOver: false,
        message: null,
      }
    })

    const dealerCard1 = getRandomCard();
    const dealerStartingHand = [dealerCard1, {}];
    const dealer = {
      cards: dealerStartingHand,
      count: getCount(dealerStartingHand),
      name: 'Dealer',
      isDealer: true,
    };
    
    return {players, dealer};
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
    const { players, dealer } = this.dealCards();

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
          player.wallet = player.wallet - currentBet;
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
      let newPlayerStateCopy = playersStateCopy[this.state.position]
      newPlayerStateCopy.cards.push(randomCard);
      newPlayerStateCopy.count = getCount(newPlayerStateCopy.cards);

      if (newPlayerStateCopy.count > 21) {
        newPlayerStateCopy.gameOver = true
        newPlayerStateCopy.message = 'BUST!'
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
      const draw = dealerDraw(dealer);
      dealer = draw;
    }

    if (dealer.count > 21) {
      const newPlayersStateCopy = playersStateCopy.map(player => {
        if (!player.gameOver) {
          player.wallet = player.wallet + player.currentBet * 2;
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
          const winner = this.getWinner(dealer, player);
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
  
  getWinner(dealer, player) {
    if (dealer.count > player.count || player.count > 21) {
      return 'dealer';
    } else if (dealer.count < player.count) {
      return 'player';
    } else {
      return 'draw';
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