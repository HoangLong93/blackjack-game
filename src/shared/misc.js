const generateDeck = () => {
  const cards = [2,3,4,5,6,7,8,9,10,'J','Q','K','A'];
  const suits = ['♦','♣','♥','♠'];
  const deck = [];
  for (let i = 0; i < cards.length; i++) {
    for (let j = 0; j < suits.length; j++) {
      deck.push({number: cards[i], suit: suits[j]});
    }
  }
  return deck;
}

const DECK = generateDeck()
       
export const getRandomCard = () => {
  const randomIndex = Math.floor(Math.random() * DECK.length);
  const randomCard = DECK[randomIndex];
  return randomCard;
}
  
export const getCount = (cards) => {
  const rearranged = [];
  cards.forEach(card => {
    if (card.number === 'A') {
      rearranged.push(card);
    } else if (card.number) {
      rearranged.unshift(card);
    }
  });
  
  return rearranged.reduce((total, card) => {
    if (card.number === 'J' || card.number === 'Q' || card.number === 'K') {
      return total + 10;
    } else if (card.number === 'A') {
      return (total + 11 <= 21) ? total + 11 : total + 1;
    } else {
      return total + card.number;
    }
  }, 0);
}
  
export const dealerDraw = (dealer) => {
  const randomCard = getRandomCard();
  dealer.cards.push(randomCard);
  dealer.count = getCount(dealer.cards);
  return dealer;
}