const maxTableCards = 12;
const emptyCard = -1;

exports.Table = class Table {
  #cards;
  #nextCardIndex;
  #tableCards;

  constructor() {
    this.#cards = getShuffledCards();
    this.#nextCardIndex = 0;
    this.#tableCards = Array.from(
      { length: this.#cards.length },
      () => emptyCard
    );
    this.#fill();
  }

  #fill() {
    while (
      this.getRemainingCardCount() &&
      this.#getTableCardsCount() < maxTableCards
    ) {
      this.#addNextCard();
    }
  }

  tryAddNextCard() {
    if (this.getRemainingCardCount() > 0) {
      this.#addNextCard();
    }
  }

  #addNextCard() {
      const indexToFill = this.#tableCards.indexOf(emptyCard);
      this.#tableCards[indexToFill] = this.#cards[this.#nextCardIndex];
      this.#nextCardIndex += 1;
    }

  #getTableCardsCount() {
    return this.#tableCards.reduce(
      (tableCardsCount, card) => tableCardsCount + (card === emptyCard ? 0 : 1),
      0
    );
  }

  getCards() {
    const lastNonEmptyIndex = getLastNonEmptyIndex(this.#tableCards);
    return this.#tableCards.slice(0, lastNonEmptyIndex + 1);
  }

  getRemainingCardCount() {
    return this.#cards.length - this.#nextCardIndex + 1;
  }

  popSet(cards) {
    if (new Set(cards).size !== 3) {
      return false;
    }

    if (cards.includes(emptyCard)) {
      return false;
    }

    if (!cards.every((card) => this.#tableCards.includes(card))) {
      return false;
    }

    if (!checkIfMakeSet(cards)) {
      return false;
    }

    for (const card of cards) {
      this.#tableCards[this.#tableCards.indexOf(card)] = -1;
    }
    this.#fill();
    return true;
  }
};

function getShuffledCards() {
  const cards = Array.from({ length: 3 ** 4 }, (_value, index) => index);

  for (let index = 0; index < cards.length; index += 1) {
    const indexToSwap =
      Math.floor(Math.random() * cards.length - index) + index;
    if (index !== indexToSwap) {
      const buffer = cards[index];
      cards[index] = cards[indexToSwap];
      cards[indexToSwap] = buffer;
    }
  }

  return cards;
}

function getLastNonEmptyIndex(cards) {
  for (let index = cards.length - 1; index >= 0; index -= 1) {
    if (cards[index] !== emptyCard) {
      return index;
    }
  }
  return -1;
}

function checkIfMakeSet(cards) {
  for (let propertyIndex = 0; propertyIndex < 4; propertyIndex += 1) {
    const differentPropertiesCount = new Set(
      cards.map((card) => getBase3Digit(card, propertyIndex))
    ).size;

    if (![1, 3].includes(differentPropertiesCount)) {
      return false;
    }
  }

  return true;
}

function getBase3Digit(number, digit) {
  return Math.floor((number % 3 ** (digit + 1)) / 3 ** digit);
}
