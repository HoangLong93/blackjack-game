import React, { useState } from 'react';
import {
  makeStyles,
  FormControl,
  Input,
  InputLabel,
  Container,
  Button,
} from '@material-ui/core';

import { Table } from './components/Table'
import './App.css';

const useStyles = makeStyles(theme => ({
  startButton: {
    marginTop: theme.spacing(2),
  },
}));

const canGameStart = (noofPlayers) => {
  return noofPlayers > 0 && noofPlayers < 5
}

const players = [
  {
    name: 'Player1',
    cards: [],
    count: 0,
    wallet: 1000,
    inputValue: '',
    currentBet: null,
    gameOver: false,
    message: null,
  },
  {
    name: 'Player2',
    cards: [],
    count: 0,
    wallet: 1000,
    inputValue: '',
    currentBet: null,
    gameOver: false,
    message: null,
  },
  {
    name: 'Player3',
    cards: [],
    count: 0,
    wallet: 1000,
    inputValue: '',
    currentBet: null,
    gameOver: false,
    message: null,
  },
  {
    name: 'Player4',
    cards: [],
    count: 0,
    wallet: 1000,
    inputValue: '',
    currentBet: null,
    gameOver: false,
    message: null,
  },
]

const App = () => {
  const classes = useStyles();
  const [noofPlayers, setNoofPlayers] = useState('')
  const [gameState, setGameState] = useState(false)

  const startGame = () => setGameState(true)
  const startNewGame = () => setGameState(false)

  return (
    !gameState
      ? <Container maxWidth="sm">
        <h1>Welcome to Blackjack game</h1>
        <h3>How many players would like to play?</h3>
        <FormControl fullWidth>
          <InputLabel htmlFor="noofPlayers">Please enter number of players (1-4)</InputLabel>
          <Input
            id="noofPlayers"
            onChange={(e) => setNoofPlayers(e.target.value)}
          />
        </FormControl>
        <Button
          className={classes.startButton}
          variant="contained"
          color={canGameStart(noofPlayers) ? 'primary' : 'default'}
          disabled={!canGameStart(noofPlayers)}
          onClick={startGame}
        >
          Start Game
        </Button>
      </Container>
      : <Table
        players={players.slice(0, noofPlayers)}
        startNewGame={startNewGame}
      />
  );
}
export default App;