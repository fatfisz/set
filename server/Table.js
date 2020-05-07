const maxTableCards = 12;
const emptyCard = -1;

exports.Table = class Table {
  #cards;
  #nextCardIndex;
  #tableCards;
  #tableCardsCount;

  constructor() {
    this.#cards = getShuffledCards();
    this.#nextCardIndex = 0;
    this.#tableCards = Array.from(
      { length: this.#cards.length },
      () => emptyCard
    );
    this.#tableCardsCount = 0;
    this.#fill();
  }

  #fill() {
    while (
      this.getRemainingCardCount() &&
      this.#tableCardsCount < maxTableCards
    ) {
      const indexToFill = this.#tableCards.indexOf(emptyCard);
      this.#tableCards[indexToFill] = this.#cards[this.#nextCardIndex];
      this.#nextCardIndex += 1;
      this.#tableCardsCount += 1;
    }
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
