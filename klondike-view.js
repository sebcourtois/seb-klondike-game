import {CardColor} from "./card-types.js";

const SUITS_CONFIG = {
    "♥": {
        "sign": "assets/suit_hearts.svg",
        "face_cards": {
            11: "assets/Jack_of_hearts_fr.svg",
            12: "assets/Queen_of_hearts_fr.svg",
            13: "assets/King_of_hearts_fr.svg",
        },
    },
    "♣": {
        "sign": "assets/suit_clubs.svg",
        "face_cards": {
            11: "assets/Jack_of_clubs_fr.svg",
            12: "assets/Queen_of_clubs_fr.svg",
            13: "assets/King_of_clubs_fr.svg",
        },
    },
    "♠": {
        "sign": "assets/suit_spades.svg",
        "face_cards": {
            11: "assets/Jack_of_spades_fr.svg",
            12: "assets/Queen_of_spades_fr.svg",
            13: "assets/King_of_spades_fr.svg",
        },
    },
    "♦": {
        "sign": "assets/suit_diamonds.svg",
        "face_cards": {
            11: "assets/Jack_of_diamonds_fr.svg",
            12: "assets/Queen_of_diamonds_fr.svg",
            13: "assets/King_of_diamonds_fr.svg",
        },
    },
};

export class KlondikeView {

    static moveFromColumnToBase(srcColumnElem, cardIdx, targetBaseElem) {
        let srcCardElements = KlondikeView.takeCardsFromColumn(cardIdx, srcColumnElem);
        KlondikeView.addCardToBase(srcCardElements.at(-1), targetBaseElem);
    }

    static moveFromBaseToColumn(srcBaseElem, targetColumnElem) {
        let srcCardElem = srcBaseElem.lastElementChild;
        srcCardElem.remove();
        if (srcBaseElem.children.length !== 0) {
            let newLastCard = srcBaseElem.lastElementChild;
            newLastCard.dataset.visible = "true";
        }
        KlondikeView.addCardsToColumn([srcCardElem], targetColumnElem);
    }

    static moveFromTalonToWaste() {
        let talonElem = document.querySelector("#klondike_talon");
        let wasteElem = document.querySelector("#klondike_waste");

        if (talonElem.children.length === 0) {
            KlondikeView.addCardsToTalon(Array.from(wasteElem.children).toReversed(), talonElem);
        }
        let cardToMove = talonElem.lastElementChild;
        cardToMove.dataset.visible = "true";
        cardToMove.style.zIndex = (wasteElem.children.length + 1).toString();
        KlondikeView.turnCardFaceUp(cardToMove);
        cardToMove.remove();

        let talon_counter = document.querySelector("#klondike_talon_counter");
        talon_counter.dataset.counter = talonElem.children.length.toString();
        talon_counter.textContent = talonElem.children.length.toString();

        let cardSelector = cardToMove.querySelector(".card-selector");
        cardSelector.dataset.depotType = "klondike_waste";

        let cardToHide = wasteElem.lastElementChild;
        if (cardToHide !== null) cardToHide.dataset.visible = "false";

        wasteElem.appendChild(cardToMove);
    }

    static moveFromWasteToColumn(targetColumElem) {
        let wastePileElem = KlondikeView.wastePileElement();
        let wasteCardElem = wastePileElem.lastElementChild;
        wasteCardElem.remove();
        KlondikeView.addCardsToColumn([wasteCardElem], targetColumElem);

        if (wastePileElem.children.length !== 0) {
            wastePileElem.lastElementChild.dataset.visible = "true";
        }
    }

    static moveFromWasteToBase(targetBaseElem) {
        let wastePileElem = KlondikeView.wastePileElement();
        let wasteCardElem = wastePileElem.lastElementChild;
        wasteCardElem.remove();
        KlondikeView.addCardToBase(wasteCardElem, targetBaseElem);

        if (wastePileElem.children.length !== 0) {
            wastePileElem.lastElementChild.dataset.visible = "true";
        }
    }

    static setupFromModel(klondikeModel) {
        let klondikeColumnsRow = document.querySelector("#klondike_columns_group");

        for (let [columnIdx, eachColumn] of klondikeModel.columns.entries()) {
            let columnGroup = document.createElement("div");
            columnGroup.classList.add("klondike-one-column-group", "card-shape", "card-depot-shade");
            columnGroup.dataset.depotIndex = columnIdx.toString();
            columnGroup.innerHTML = `
            <div class="card-shape card-selector" data-depot-type="klondike_column" 
                data-depot-index="${columnIdx}" style="z-index: 1"></div>
            <div class="klondike-column" style="z-index: 2" data-depot-index="${columnIdx}"></div>
            `;

            let columnElem = columnGroup.querySelector(".klondike-column");

            for (let [cardIdx, eachCard] of eachColumn.cards.entries()) {
                let cardElem = KlondikeView.makeCardElement(eachCard.rank, eachCard.suit);
                cardElem.style.zIndex = `${cardIdx + 1}`;
                if (!eachCard.faceUp) {
                    let cardFaceElem = cardElem.querySelector(".card-face");
                    cardFaceElem.dataset.visible = "false";
                    let cardBackElem = cardElem.querySelector(".card-back");
                    cardBackElem.dataset.visible = "true";
                }
                cardElem.dataset.depotIndex = columnIdx.toString();
                cardElem.dataset.cardIndex = cardIdx.toString();
                columnElem.appendChild(cardElem);

                let cardSelector = cardElem.querySelector(".card-selector");
                cardSelector.dataset.depotIndex = columnIdx.toString();
                cardSelector.dataset.cardIndex = cardIdx.toString();
                cardSelector.dataset.depotType = "klondike_column";
            }
            klondikeColumnsRow.appendChild(columnGroup);
        }

        let klondikeBasesRow = document.querySelector("#klondike_bases_row");
        let baseElements = Array.from(klondikeBasesRow.children).entries();
        for (let [baseIdx, baseDiv] of baseElements) {
            baseDiv.innerHTML = `
            <div class="card-shape card-selector" data-depot-type="klondike_base" 
                data-depot-index="${baseIdx}" style="z-index: 1"></div>
            <div class="klondike-base" style="z-index: 2" data-depot-index="${baseIdx}"></div>
        `;
        }

        let talonElem = document.querySelector("#klondike_talon");
        let cardElementsForTalon = [];
        for (let eachCard of klondikeModel.talon) {
            let cardElem = KlondikeView.makeCardElement(eachCard.rank, eachCard.suit);
            cardElementsForTalon.push(cardElem);
        }
        KlondikeView.addCardsToTalon(cardElementsForTalon, talonElem);
    }

    static cardColumnAt(columnIdx) {
        let klondikeColumnsGrp = document.querySelector("#klondike_columns_group");
        return klondikeColumnsGrp.querySelector(`.klondike-column[data-depot-index="${columnIdx}"]`);
    }

    static foundationPileAt(baseIdx) {
        let klondikeBasesGrp = document.querySelector("#klondike_bases_row");
        return klondikeBasesGrp.querySelector(`.klondike-base[data-depot-index="${baseIdx}"]`);
    }

    static wastePileElement() {
        return document.querySelector("#klondike_waste");
    }

    static talonCounterElement() {
        return document.querySelector("#klondike_talon_counter");
    }

    static allCardSelectors() {
        return document.querySelectorAll(".card-selector");
    }

    static turnCardFaceUp(cardElem) {
        let cardFaceElem = cardElem.querySelector(".card-face");
        cardFaceElem.dataset.visible = "true";
        let cardBackElem = cardElem.querySelector(".card-back");
        cardBackElem.dataset.visible = "false";
    }

    static takeCardsFromColumn(startIdx, columnElem) {
        let cardElements = Array.from(columnElem.children).slice(startIdx);
        for (let cardElem of cardElements) {
            cardElem.remove();
        }
        return cardElements;
    }

    static addCardsToColumn(cardElements, targetColumnElem) {
        for (let [i, cardElem] of cardElements.entries()) {
            let zIndex = 0;
            if (targetColumnElem.children.length !== 0) {
                zIndex = parseInt(targetColumnElem.lastElementChild.style.zIndex);
            }
            cardElem.style.zIndex = (zIndex + (i + 1)).toString();

            let newColumnIdx = targetColumnElem.dataset.depotIndex;
            let newCardIdx = targetColumnElem.children.length.toString();
            cardElem.dataset.depotIndex = newColumnIdx;
            cardElem.dataset.cardIndex = newCardIdx;

            let cardSelector = cardElem.querySelector(".card-selector");
            cardSelector.dataset.depotIndex = newColumnIdx;
            cardSelector.dataset.cardIndex = newCardIdx;
            cardSelector.dataset.depotType = "klondike_column";

            targetColumnElem.appendChild(cardElem);
        }
    }

    static addCardToBase(cardElem, targetBaseElem) {
        let zIndex = 0;
        let previousLastCard = null;
        if (targetBaseElem.children.length !== 0) {
            previousLastCard = targetBaseElem.lastElementChild;
            zIndex = parseInt(previousLastCard.style.zIndex);
        }
        cardElem.style.zIndex = (zIndex + 1).toString();

        let newColumnIdx = targetBaseElem.dataset.depotIndex;
        let newCardIdx = targetBaseElem.children.length.toString();
        cardElem.dataset.depotIndex = newColumnIdx;
        cardElem.dataset.cardIndex = newCardIdx;

        let cardSelector = cardElem.querySelector(".card-selector");
        cardSelector.dataset.depotIndex = newColumnIdx;
        cardSelector.dataset.cardIndex = newCardIdx;
        cardSelector.dataset.depotType = "klondike_base";

        targetBaseElem.appendChild(cardElem);
        if (previousLastCard !== null) {
            previousLastCard.dataset.visible = "false";
        }
    }

    static addCardsToTalon(cardElements, talonElem) {
        let lastCardIdx = talonElem.children.length - 1;
        for (let [cardIdx, cardElem] of cardElements.entries()) {
            cardElem.style.zIndex = `${cardIdx + 1 + lastCardIdx}`;
            cardElem.dataset.visible = "false";

            let cardFaceElem = cardElem.querySelector(".card-face");
            cardFaceElem.dataset.visible = "false";
            let cardBackElem = cardElem.querySelector(".card-back");
            cardBackElem.dataset.visible = "true";

            talonElem.appendChild(cardElem);
        }
        let talon_counter = document.querySelector("#klondike_talon_counter");
        talon_counter.dataset.counter = talonElem.children.length.toString();
        talon_counter.textContent = talonElem.children.length.toString();
    }

    static makeCardId(rank, suit) {
        return `card_${rank.text}${suit.text}`;
    }

    static makePictureCardElement(rank, suit) {
        let suitConfig = SUITS_CONFIG[suit.text];
        let picture = suitConfig["face_cards"][rank.value];

        let cardId = KlondikeView.makeCardId(rank, suit);
        let cardHtml = `
    <div class="card-shape one-card card-shadow" id="${cardId}">
        <div class="card-shape card-back" id="${cardId}_back" data-visible="false"></div>
        <div class="card-shape card-face" id="${cardId}_face" data-visible="true">
            <img class="card-picture" alt="card_picture" src=${picture}>
            <div class="card-shape card-selector" id="${cardId}_selector"></div>
        </div>
    </div>
    `;
        let cardTemplate = document.createElement("template");
        cardTemplate.innerHTML = cardHtml.trim();

        return cardTemplate.content.firstElementChild;
    }

    static makeNumberedCardElement(rank, suit) {
        let suitConfig = SUITS_CONFIG[suit.text];
        let suitSign = suitConfig["sign"];

        let cardId = KlondikeView.makeCardId(rank, suit);
        let rankText = rank.text;

        let cardHtml = `
<div class="card-shape one-card" id="${cardId}">
    <div class="card-shape card-back card-shadow" id="${cardId}_back" data-visible="false"></div>
    <div class="card-shape card-face" id="${cardId}_face" data-visible="true">
        <div class="card-shape card-face-background card-shadow" id="${cardId}_background"></div>
        <div class="card-shape card-pips-layout" id="${cardId}_pips">
            <div class="card-values-column">
                <div class="card-value-column">
                    <p class="card-rank-text">${rankText}</p>
                    <img alt="card_sign" class="card-suit-img-small" src=${suitSign}>
                </div>
                <div class="card-value-column reversed">
                    <p class="card-rank-text">${rankText}</p>
                    <img alt="card_sign" class="card-suit-img-small" src=${suitSign}>
                </div>
            </div>
            <div class="card-signs-column">
                <img alt="card_sign" class="card-suit-img rank-4 rank-5 rank-6 rank-7 rank-8 rank-9 rank-10" src=${suitSign}>
                <img alt="card_sign" class="card-suit-img rank-6 rank-7 rank-8 rank-9 rank-10" src=${suitSign}>
                <img alt="card_sign" class="card-suit-img rank-6 rank-7 rank-8 rank-9 rank-10 reversed" src=${suitSign}>
                <img alt="card_sign" class="card-suit-img rank-4 rank-5 rank-8 rank-9 rank-10 reversed" src=${suitSign}>
            </div>
            <div class="card-signs-column card-signs-column-center">
                <img alt="card_sign" class="card-suit-img rank-2 rank-3 rank-7 rank-9 rank-10" src=${suitSign}>
                <img alt="card_sign" class="card-suit-img rank-1 rank-3 rank-5" src=${suitSign}>
                <img alt="card_sign" class="card-suit-img rank-2 rank-3 rank-10 reversed" src=${suitSign}>
            </div>
            <div class="card-signs-column">
                <img alt="card_sign" class="card-suit-img rank-4 rank-5 rank-6 rank-7 rank-8 rank-9 rank-10" src=${suitSign}>
                <img alt="card_sign" class="card-suit-img rank-6 rank-7 rank-8 rank-9 rank-10" src=${suitSign}>
                <img alt="card_sign" class="card-suit-img rank-6 rank-7 rank-8 rank-9 rank-10 reversed" src=${suitSign}>
                <img alt="card_sign" class="card-suit-img rank-4 rank-5 rank-8 rank-9 rank-10 reversed" src=${suitSign}>
            </div>
            <div class="card-values-column">
                <div class="card-value-column">
                    <p class="card-rank-text">${rankText}</p>
                    <img alt="card_sign" class="card-suit-img-small" src=${suitSign}>
                </div>
                <div class="card-value-column reversed">
                    <p class="card-rank-text">${rankText}</p>
                    <img alt="card_sign" class="card-suit-img-small" src=${suitSign}>
                </div>
            </div>
        </div>
        <div class="card-shape card-selector" id="${cardId}_selector"></div>
    </div>
</div>
    `;
        let cardTemplate = document.createElement("template");
        cardTemplate.innerHTML = cardHtml.trim();

        let signsToShow = cardTemplate.content.querySelectorAll(`.rank-${rank.value}`);
        for (let eachSign of signsToShow) {
            eachSign.style.display = "block";
        }
        let suitColor = suit.color;
        let rankLabels = cardTemplate.content.querySelectorAll(".card-rank-text");
        for (let eachLabel of rankLabels) {
            eachLabel.classList.add(suitColor === CardColor.Red ? "card-red-text" : "card-black-text");
        }
        return cardTemplate.content.firstElementChild;
    }

    static makeCardElement(rank, suit) {
        if (rank > 10) {
            return KlondikeView.makePictureCardElement(rank, suit);
        }
        return KlondikeView.makeNumberedCardElement(rank, suit);
    }

}

