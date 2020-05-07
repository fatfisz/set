const maxTableCards = 12;
const emptyCard = -1;

exports.Room = class Room {
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
    this.#fillTheTable();
  }

  #fillTheTable() {
    while (
      this.#nextCardIndex < this.#cards.length &&
      this.#tableCardsCount < maxTableCards
    ) {
      const indexToFill = this.#tableCards.indexOf(emptyCard);
      this.#tableCards[indexToFill] = this.#cards[this.#nextCardIndex];
      this.#nextCardIndex += 1;
      this.#tableCardsCount += 1;
    }
  }

  getTableCards() {
    const lastNonEmptyIndex = getLastNonEmptyIndex(this.#tableCards);
    return this.#tableCards.slice(0, lastNonEmptyIndex + 1);
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
