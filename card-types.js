export class CardColor {
    static Red = new CardColor("Red");
    static Black = new CardColor("Black");

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `${this.name}`;
    }
}

export class CardSuit {
    static Heart = new CardSuit("♥", CardColor.Red);
    static Club = new CardSuit("♣", CardColor.Black);
    static Diamond = new CardSuit("♦", CardColor.Red);
    static Spade = new CardSuit("♠", CardColor.Black);

    constructor(text, color) {
        this.text = text;
        this.color = color;
    }

    toString() {
        return `${this.text}`;
    }
}

export class CardRank {
    static Ace = new CardRank(1, "A");
    static Two = new CardRank(2, "2");
    static Three = new CardRank(3, "3");
    static Four = new CardRank(4, "4");
    static Five = new CardRank(5, "5");
    static Six = new CardRank(6, "6");
    static Seven = new CardRank(7, "7");
    static Eight = new CardRank(8, "8");
    static Nine = new CardRank(9, "9");
    static Ten = new CardRank(10, "10");
    static Joker = new CardRank(11, "V");
    static Queen = new CardRank(12, "Q");
    static King = new CardRank(13, "K");

    constructor(value, text) {
        this.value = value;
        this.text = text;
    }

    toString() {
        return `${this.text}`;
    }

    valueOf() {
        return this.value;
    }
}

export class Card {
    constructor(rank, suit, faceUp) {
        this.rank = rank;
        this.suit = suit;
        this.faceUp = faceUp;
    }

    toString() {
        if (this.faceUp) {
            return `|${this.rank.toString()}${this.suit.toString()}|`;
        } else {
            return "|XX|";
        }

    }
}

export class CardStack {
    constructor() {
        this.cards = [];
    }

    get length() {
        return this.cards.length;
    }

    pop() {
        if (this.isEmpty()) {
            throw new Error("CardStack is empty");
        }
        return this.cards.pop();
    }

    splice(start) {
        if (this.isEmpty()) {
            throw new Error("CardStack is empty");
        }
        return this.cards.splice(start);
    }

    at(index) {
        if (this.isEmpty()) {
            throw new Error("CardStack is empty");
        }
        return this.cards.at(index);
    }

    slice(start, end) {
        if (this.isEmpty()) {
            throw new Error("CardStack is empty");
        }
        return this.cards.slice(start, end);
    }

    isEmpty() {
        return this.cards.length === 0;
    }

    toString() {
        return this.cards.toString();
    }

    valueOf() {
        return this.cards.valueOf();
    }

    accepts(someCard) {
        return false;
    }
}

function shuffle(someArray) {
    for (let i = someArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [someArray[i], someArray[j]] = [someArray[j], someArray[i]];
    }
    return someArray;
}

export class CardDeck extends CardStack {
    constructor() {
        super();
        for (let eachSuit of Object.values(CardSuit)) {
            for (let eachRank of Object.values(CardRank)) {
                this.cards.push(new Card(eachRank, eachSuit, false));
            }
        }
    }

    shuffle() {
        shuffle(this.cards);
    }
}
