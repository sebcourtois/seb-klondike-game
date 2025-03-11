class Color {
    static Red = new Color("Red");
    static Black = new Color("Black");

    constructor(name) {
        this.name = name;
    }

    toString() {
        return `${this.name}`;
    }
}

class Suit {
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

class Rank {
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

class Card {
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

class CardStack {
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

class AlternateColorStack extends CardStack {

    prepare(...someCards) {
        this.cards.push(...someCards);
    }

    push(...someCards) {
        let firstCard = someCards[0];
        if (!this.accepts(firstCard)) {
            throw new Error(`Invalid card: ${firstCard.toString()}`);
        }
        this.cards.push(...someCards);
    }

    accepts(someCard) {
        if (this.isEmpty()) {
            return (someCard.rank === Rank.King);
        }
        let lastCard = this.cards[this.cards.length - 1];
        return (
            (lastCard.suit.color !== someCard.suit.color)
            && ((lastCard.rank.value - someCard.rank.value) === 1)
        );
    }
}

class FamilyStack extends CardStack {

    push(someCard) {
        if (!this.accepts(someCard)) {
            throw new Error(`Invalid card: ${someCard.toString()}`);
        }
        this.cards.push(someCard);
    }

    accepts(someCard) {
        if (this.isEmpty()) return (someCard.rank === Rank.Ace);

        let lastCard = this.cards[this.cards.length - 1];
        return (
            (lastCard.suit === someCard.suit)
            && ((lastCard.rank.value - someCard.rank.value) === -1)
        );

    }
}

function shuffle(someArray) {
    for (let i = someArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [someArray[i], someArray[j]] = [someArray[j], someArray[i]];
    }
    return someArray;
}

class Deck extends CardStack {
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


class Klondike {
    constructor() {
        this.talon = [];
        this.waste = [];
        this.bases = [
            new FamilyStack(),
            new FamilyStack(),
            new FamilyStack(),
            new FamilyStack(),
        ];
        this.columns = [
            new AlternateColorStack(),
            new AlternateColorStack(),
            new AlternateColorStack(),
            new AlternateColorStack(),
            new AlternateColorStack(),
            new AlternateColorStack(),
            new AlternateColorStack(),
        ];
    }

    deal(deck) {
        this.columns[0].prepare(deck.at(0)); // 1 card
        this.columns[1].prepare(...deck.slice(1, 3)); // 2 cards
        this.columns[2].prepare(...deck.slice(3, 6)); // 3 cards...
        this.columns[3].prepare(...deck.slice(6, 10));
        this.columns[4].prepare(...deck.slice(10, 15));
        this.columns[5].prepare(...deck.slice(15, 21));
        this.columns[6].prepare(...deck.slice(21, 28)); //...7 cards

        this.talon.push(...deck.slice(28, deck.length));

        for (let i = 0; i < 7; i++) {
            let oneColumn = this.columns[i];
            if (oneColumn.isEmpty()) continue;
            let topmostCard = oneColumn.at(-1);
            topmostCard.faceUp = true;
        }
    }

    moveFromColumnToColumn(srcColumIdx, cardIdx, targetColumnIdx) {
        let srcColumn = this.columns.at(srcColumIdx);
        let srcFirstCard = srcColumn.at(cardIdx);
        let targetColumn = this.columns.at(targetColumnIdx);

        if (!targetColumn.accepts(srcFirstCard)) {
            return false;
        }
        console.log(srcColumn.toString());
        console.log(targetColumn.toString());

        targetColumn.push(...srcColumn.splice(cardIdx));
        // if (!srcColumn.isEmpty()) {
        //     srcColumn.at(-1).faceUp = true;
        // }

        console.log(srcColumn.toString());
        console.log(targetColumn.toString());

        return true;
    }

    moveFromColumnToBase(srcColumIdx, cardIdx, targetColumnIdx) {
        let srcColumn = this.columns.at(srcColumIdx);
        if (srcColumn.length === 0) {
            return false;
        }
        if (cardIdx !== srcColumn.length - 1) {
            console.log("only last card allowed to move to base");
            return false;
        }
        let srcCard = srcColumn.at(cardIdx);
        let targetBase = this.bases.at(targetColumnIdx);
        if (!targetBase.accepts(srcCard)) {
            return false;
        }
        console.log(srcColumn.toString());
        console.log(targetBase.toString());

        targetBase.push(srcColumn.pop());

        console.log(srcColumn.toString());
        console.log(targetBase.toString());

        return true;
    }

    moveFromTalonToWaste() {
        if (this.talon.length === 0) {
            this.talon = this.waste.toReversed();
            this.waste = [];
        }
        let card = this.talon.pop();
        this.waste.push(card);
        return card;
    }

    moveFromWasteToColumn(columnIdx) {
        if (this.waste.length === 0) return false;

        let targetColumn = this.columns.at(columnIdx);
        if (!targetColumn.accepts(this.waste.at(-1))) {
            return false;
        }
        let wasteCard = this.waste.pop();
        targetColumn.push(wasteCard);

        return true;
    }

    moveFromWasteToBase(baseIdx) {
        if (this.waste.length === 0) return false;

        let targetBase = this.bases.at(baseIdx);
        if (!targetBase.accepts(this.waste.at(-1))) {
            return false;
        }
        let wasteCard = this.waste.pop();
        targetBase.push(wasteCard);

        return true;
    }

    moveFromBaseToColumn(srcBaseIdx, targetColumnIdx) {
        let srcBase = this.bases.at(srcBaseIdx);
        if (srcBase.length === 0) {
            return false;
        }
        let srcCard = srcBase.at(-1);
        let targetColumn = this.columns.at(targetColumnIdx);
        if (!targetColumn.accepts(srcCard)) {
            return false;
        }
        console.log(srcBase.toString());
        console.log(targetColumn.toString());

        targetColumn.push(srcBase.pop());

        console.log(srcBase.toString());
        console.log(targetColumn.toString());

        return true;
    }

}