export class Color {
    static Red = new Color("Red");
    static Black = new Color("Black");

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `${this.name}`;
    }
}

export class Suit {
    static Heart = new Suit("♥", Color.Red);
    static Club = new Suit("♣", Color.Black);
    static Diamond = new Suit("♦", Color.Red);
    static Spade = new Suit("♠", Color.Black);

    constructor(text, color) {
        this.text = text;
        this.color = color;
    }

    toString() {
        return `${this.text}`;
    }
}

export class Rank {
    static Ace = new Rank(1, "A");
    static Two = new Rank(2, "2");
    static Three = new Rank(3, "3");
    static Four = new Rank(4, "4");
    static Five = new Rank(5, "5");
    static Six = new Rank(6, "6");
    static Seven = new Rank(7, "7");
    static Eight = new Rank(8, "8");
    static Nine = new Rank(9, "9");
    static Ten = new Rank(10, "10");
    static Joker = new Rank(11, "V");
    static Queen = new Rank(12, "Q");
    static King = new Rank(13, "K");

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

export class Deck extends CardStack {
    constructor() {
        super();
        for (let eachSuit of Object.values(Suit)) {
            for (let eachRank of Object.values(Rank)) {
                this.cards.push(new Card(eachRank, eachSuit, false));
            }
        }
    }

    shuffle() {
        shuffle(this.cards);
    }
}
