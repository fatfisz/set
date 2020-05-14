const maxTableCards = 12;
const emptyCard = -1;

export class Table {
  private cards: number[];
  private nextCardIndex: number;
  private tableCards: number[];

  constructor() {
    this.cards = getShuffledCards();
    this.nextCardIndex = 0;
    this.tableCards = Array.from(
      { length: this.cards.length },
      () => emptyCard
    );
    this.fill();
  }

  private fill() {
    while (
      this.getRemainingCardCount() > 0 &&
      this.getTableCardsCount() < maxTableCards
    ) {
      this.addNextCard();
    }
  }

  tryAddNextCard() {
    if (this.getRemainingCardCount() > 0) {
      this.addNextCard();
    }
  }

  private addNextCard() {
    const indexToFill = this.tableCards.indexOf(emptyCard);
    this.tableCards[indexToFill] = this.cards[this.nextCardIndex];
    this.nextCardIndex += 1;
  }

  private getTableCardsCount() {
    return this.tableCards.reduce(
      (tableCardsCount, card) => tableCardsCount + (card === emptyCard ? 0 : 1),
      0
    );
  }

  getCards() {
    const lastNonEmptyIndex = getLastNonEmptyIndex(this.tableCards);
    return this.tableCards.slice(0, lastNonEmptyIndex + 1);
  }

  getRemainingCardCount() {
    return this.cards.length - this.nextCardIndex;
  }

  popSet(cards: number[]) {
    if (new Set(cards).size !== 3) {
      return false;
    }

    if (cards.includes(emptyCard)) {
      return false;
    }

    if (!cards.every((card) => this.tableCards.includes(card))) {
      return false;
    }

    if (!checkIfMakeSet(cards)) {
      return false;
    }

    for (const card of cards) {
      this.tableCards[this.tableCards.indexOf(card)] = -1;
    }
    this.fill();
    return true;
  }

  addUntilHasSet() {
    while (this.getRemainingCardCount() > 0 && !this.hasSet()) {
      this.addNextCard();
    }
  }

  private hasSet() {
    const nonEmptyCards = this.tableCards.filter((card) => card !== emptyCard);
    for (
      let firstIndex = 0;
      firstIndex < nonEmptyCards.length;
      firstIndex += 1
    ) {
      for (
        let secondIndex = firstIndex + 1;
        secondIndex < nonEmptyCards.length;
        secondIndex += 1
      ) {
        const first = nonEmptyCards[firstIndex];
        const second = nonEmptyCards[secondIndex];
        const third = getCardThatCompletesSet([first, second]);
        if (nonEmptyCards.includes(third)) {
          return true;
        }
      }
    }
    return false;
  }
}

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

function getLastNonEmptyIndex(cards: number[]) {
  for (let index = cards.length - 1; index >= 0; index -= 1) {
    if (cards[index] !== emptyCard) {
      return index;
    }
  }
  return -1;
}

function checkIfMakeSet(cards: number[]) {
  for (let propertyIndex = 0; propertyIndex < 4; propertyIndex += 1) {
    const values = new Set(
      cards.map((card) => getBase3Digit(card, propertyIndex))
    );

    if (![1, 3].includes(values.size)) {
      return false;
    }
  }

  return true;
}

function getBase3Digit(number: number, digit: number) {
  return Math.floor((number % 3 ** (digit + 1)) / 3 ** digit);
}

function getCardThatCompletesSet(cards: number[]) {
  const digits: number[] = [];

  for (let propertyIndex = 0; propertyIndex < 4; propertyIndex += 1) {
    const values = new Set(
      cards.map((card) => getBase3Digit(card, propertyIndex))
    );

    if (values.size === 1) {
      digits.push([...values][0]);
    } else {
      digits.push([...values].reduce((sum, number) => sum - number, 3));
    }
  }

  return digits.reduceRight((number, digit) => number * 3 + digit);
}
