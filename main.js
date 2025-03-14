import * as cards from "./cards.js"
import {Klondike} from "./klondike.js";

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

function makeCardId(rank, suit) {
    return `card_${rank.text}${suit.text}`;
}

function makePictureCardElement(rank, suit) {
    let suitConfig = SUITS_CONFIG[suit.text];
    let picture = suitConfig["face_cards"][rank.value];

    let cardId = makeCardId(rank, suit);
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

function makeNumberedCardElement(rank, suit) {
    let suitConfig = SUITS_CONFIG[suit.text];
    let suitSign = suitConfig["sign"];

    let cardId = makeCardId(rank, suit);
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
        eachLabel.classList.add(suitColor === cards.Color.Red ? "card-red-text" : "card-black-text");
    }
    return cardTemplate.content.firstElementChild;
}

function makeCardElement(rank, suit) {
    if (rank > 10) {
        return makePictureCardElement(rank, suit);
    }
    return makeNumberedCardElement(rank, suit);
}

function getKlondikeColumn(columnIdx) {
    let klondikeColumnsGrp = document.querySelector("#klondike_columns_group");
    return klondikeColumnsGrp.querySelector(`.klondike-column[data-depot-index="${columnIdx}"]`);
}

function getKlondikeBase(columnIdx) {
    let klondikeColumnsGrp = document.querySelector("#klondike_bases_row");
    return klondikeColumnsGrp.querySelector(`.klondike-base[data-depot-index="${columnIdx}"]`);
}

function getKlondikeWaste() {
    return document.querySelector("#klondike_waste");
}

function turnCardFaceUp(cardElem) {
    let cardFaceElem = cardElem.querySelector(".card-face");
    cardFaceElem.dataset.visible = "true";
    let cardBackElem = cardElem.querySelector(".card-back");
    cardBackElem.dataset.visible = "false";
}

function takeCardFromColumn(cardIdx, columnElem) {
    let cardElements = Array.from(columnElem.children).slice(cardIdx);
    for (let cardElem of cardElements) {
        cardElem.remove();
    }
    return cardElements;
}

function addCardsToColumn(cardElements, targetColumnElem) {
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

function addCardToBase(cardElem, targetBaseElem) {
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

function addCardsToTalon(cardElements, talonElem) {
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

function moveFromColumnToBase(srcColumIdx, cardIdx, targetColumnIdx) {
    console.log("moveFromColumnToBase", srcColumIdx, cardIdx, targetColumnIdx);

    if (!klondike.moveFromColumnToBase(srcColumIdx, cardIdx, targetColumnIdx)) {
        console.warn("invalid move");
        return false;
    }

    let srcColumnElem = getKlondikeColumn(srcColumIdx);
    let targetBaseElem = getKlondikeBase(targetColumnIdx);

    let srcCardElements = takeCardFromColumn(cardIdx, srcColumnElem);
    addCardToBase(srcCardElements.at(-1), targetBaseElem);

    if (srcColumnElem.children.length > 0) {
        klondike.columns.at(srcColumIdx).at(-1).faceUp = true;
        turnCardFaceUp(srcColumnElem.lastElementChild);
    }

    return true;
}

function moveFromBaseToColumn(srcBaseIdx, targetColumnIdx) {
    console.log("moveFromBaseToColumn", srcBaseIdx, targetColumnIdx);

    if (!klondike.moveFromBaseToColumn(srcBaseIdx, targetColumnIdx)) {
        console.warn("invalid move");
        return false;
    }
    let srcBaseElem = getKlondikeBase(srcBaseIdx);
    let targetColumnElem = getKlondikeColumn(targetColumnIdx);

    let srcCardElem = srcBaseElem.lastElementChild;
    srcCardElem.remove();
    if (srcBaseElem.children.length !== 0) {
        let newLastCard = srcBaseElem.lastElementChild;
        newLastCard.dataset.visible = "true";
    }
    addCardsToColumn([srcCardElem], targetColumnElem);

    return true;
}

function moveFromColumnToColumn(srcColumIdx, cardIdx, targetColumnIdx) {
    console.log("moveFromColumnToColumn", srcColumIdx, cardIdx, targetColumnIdx);

    if (!klondike.moveFromColumnToColumn(srcColumIdx, cardIdx, targetColumnIdx)) {
        console.warn("invalid move");
        return false;
    }
    let srcColumnElem = getKlondikeColumn(srcColumIdx);
    let targetColumnElem = getKlondikeColumn(targetColumnIdx);

    let srcCardElements = takeCardFromColumn(cardIdx, srcColumnElem);
    addCardsToColumn(srcCardElements, targetColumnElem);

    if (srcColumnElem.children.length > 0) {
        klondike.columns.at(srcColumIdx).at(-1).faceUp = true;
        turnCardFaceUp(srcColumnElem.lastElementChild);
    }
    return true;
}


function moveFromTalonToWaste() {
    let movedCard = klondike.moveFromTalonToWaste();

    let talonElem = document.querySelector("#klondike_talon");
    let wasteElem = document.querySelector("#klondike_waste");

    if (talonElem.children.length === 0) {
        addCardsToTalon(Array.from(wasteElem.children).toReversed(), talonElem);
    }

    let cardToMove = talonElem.lastElementChild;
    cardToMove.dataset.visible = "true";
    cardToMove.style.zIndex = (wasteElem.children.length + 1).toString();
    movedCard.faceUp = true;
    turnCardFaceUp(cardToMove);
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

function moveFromWasteToColumn(targetColumnIdx) {
    console.log("moveFromWasteToColumn", targetColumnIdx);

    if (!klondike.moveFromWasteToColumn(targetColumnIdx)) return false;

    let targetColumElem = getKlondikeColumn(targetColumnIdx);
    let wastePileElem = getKlondikeWaste();
    let wasteCardElem = wastePileElem.lastElementChild;
    wasteCardElem.remove();
    addCardsToColumn([wasteCardElem], targetColumElem);

    if (wastePileElem.children.length !== 0) {
        wastePileElem.lastElementChild.dataset.visible = "true";
    }
    return true;
}

function moveFromWasteToBase(targetBaseIdx) {
    console.log("moveFromWasteToBase", targetBaseIdx);

    if (!klondike.moveFromWasteToBase(targetBaseIdx)) return false;

    let wastePileElem = getKlondikeWaste();
    let targetBaseElem = getKlondikeBase(targetBaseIdx);
    let wasteCardElem = wastePileElem.lastElementChild;
    wasteCardElem.remove();
    addCardToBase(wasteCardElem, targetBaseElem);

    if (wastePileElem.children.length !== 0) {
        wastePileElem.lastElementChild.dataset.visible = "true";
    }
    return true;
}

let FIRST_SELECTION = null;

function clearSelection() {
    FIRST_SELECTION.dataset.selected = "false";
    FIRST_SELECTION = null;
}

function onCardClicked(event) {
    console.log(event.target);

    if (FIRST_SELECTION === null) {
        event.target.dataset.selected = "true";
        FIRST_SELECTION = event.target;
        return;
    }
    let second_selection = event.target;
    let sourceDepotType = FIRST_SELECTION.dataset.depotType;
    let srcDepotIdx = parseInt(FIRST_SELECTION.dataset.depotIndex);
    let targetDepotType = second_selection.dataset.depotType;
    let targetDepotIdx = parseInt(second_selection.dataset.depotIndex);
    let cardIdx = parseInt(FIRST_SELECTION.dataset.cardIndex);

    if (sourceDepotType === "klondike_column" && targetDepotType === "klondike_column") {
        moveFromColumnToColumn(srcDepotIdx, cardIdx, targetDepotIdx);
    } else if (sourceDepotType === "klondike_column" && targetDepotType === "klondike_base") {
        moveFromColumnToBase(srcDepotIdx, cardIdx, targetDepotIdx);
    } else if (sourceDepotType === "klondike_waste" && targetDepotType === "klondike_column") {
        moveFromWasteToColumn(targetDepotIdx);
    } else if (sourceDepotType === "klondike_waste" && targetDepotType === "klondike_base") {
        moveFromWasteToBase(targetDepotIdx);
    } else if (sourceDepotType === "klondike_base" && targetDepotType === "klondike_column") {
        moveFromBaseToColumn(srcDepotIdx, targetDepotIdx);
    }
    clearSelection();
}

const btnShowAllCards = document.querySelector("#start_game");
btnShowAllCards.addEventListener("click", startGame);

let klondike = null;

function startGame() {
    btnShowAllCards.style.display = "none";

    let deck = new cards.Deck();
    deck.shuffle();
    klondike = new Klondike();
    klondike.deal(deck);

    let klondikeColumnsRow = document.querySelector("#klondike_columns_group");
    for (let [columnIdx, eachColumn] of klondike.columns.entries()) {
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
            let cardElem = makeCardElement(eachCard.rank, eachCard.suit);
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
    for (let eachCard of klondike.talon) {
        let cardElem = makeCardElement(eachCard.rank, eachCard.suit);
        cardElementsForTalon.push(cardElem);
    }
    addCardsToTalon(cardElementsForTalon, talonElem);

    document.querySelector("#klondike_talon_counter").addEventListener(
        "click", moveFromTalonToWaste
    );

    let allCardSelectors = document.querySelectorAll(".card-selector");
    for (let cardSelector of allCardSelectors) {
        cardSelector.addEventListener("click", onCardClicked);
    }
}

