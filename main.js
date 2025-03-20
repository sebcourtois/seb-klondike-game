import {CardDeck} from "./card-types.js";
import {KlondikeModel} from "./klondike-model.js";
import {KlondikeView} from "./klondike-view.js";

function moveFromColumnToBase(srcColumIdx, cardIdx, targetColumnIdx) {
    console.log("moveFromColumnToBase", srcColumIdx, cardIdx, targetColumnIdx);

    if (!klondikeModel.moveFromColumnToBase(srcColumIdx, cardIdx, targetColumnIdx)) {
        console.warn("invalid move");
        return false;
    }

    let srcColumnElem = KlondikeView.cardColumnAt(srcColumIdx);
    let targetBaseElem = KlondikeView.foundationPileAt(targetColumnIdx);
    KlondikeView.moveFromColumnToBase(srcColumnElem, cardIdx, targetBaseElem);

    let klondikeColumn = klondikeModel.columns.at(srcColumIdx);
    if (klondikeColumn.length > 0) {
        klondikeColumn.at(-1).faceUp = true;
        KlondikeView.turnCardFaceUp(srcColumnElem.lastElementChild);
    }
    return true;
}

function moveFromBaseToColumn(srcBaseIdx, targetColumnIdx) {
    console.log("moveFromBaseToColumn", srcBaseIdx, targetColumnIdx);

    if (!klondikeModel.moveFromBaseToColumn(srcBaseIdx, targetColumnIdx)) {
        console.warn("invalid move");
        return false;
    }

    let srcBaseElem = KlondikeView.foundationPileAt(srcBaseIdx);
    let targetColumnElem = KlondikeView.cardColumnAt(targetColumnIdx);
    KlondikeView.moveFromBaseToColumn(srcBaseElem, targetColumnElem);

    return true;
}

function moveFromColumnToColumn(srcColumIdx, cardIdx, targetColumnIdx) {
    console.log("moveFromColumnToColumn", srcColumIdx, cardIdx, targetColumnIdx);

    if (!klondikeModel.moveFromColumnToColumn(srcColumIdx, cardIdx, targetColumnIdx)) {
        console.warn("invalid move");
        return false;
    }
    let srcColumnElem = KlondikeView.cardColumnAt(srcColumIdx);
    let targetColumnElem = KlondikeView.cardColumnAt(targetColumnIdx);

    let srcCardElements = KlondikeView.takeCardsFromColumn(cardIdx, srcColumnElem);
    KlondikeView.addCardsToColumn(srcCardElements, targetColumnElem);

    let klondikeColumn = klondikeModel.columns.at(srcColumIdx);
    if (klondikeColumn.length > 0) {
        klondikeColumn.at(-1).faceUp = true;
        KlondikeView.turnCardFaceUp(srcColumnElem.lastElementChild);
    }
    return true;
}


function moveFromTalonToWaste() {
    let movedCard = klondikeModel.moveFromTalonToWaste();
    movedCard.faceUp = true;
    KlondikeView.moveFromTalonToWaste();
}

function moveFromWasteToColumn(targetColumnIdx) {
    console.log("moveFromWasteToColumn", targetColumnIdx);

    if (!klondikeModel.moveFromWasteToColumn(targetColumnIdx)) return false;

    let targetColumElem = KlondikeView.cardColumnAt(targetColumnIdx);
    KlondikeView.moveFromWasteToColumn(targetColumElem);

    return true;
}

function moveFromWasteToBase(targetBaseIdx) {
    console.log("moveFromWasteToBase", targetBaseIdx);

    if (!klondikeModel.moveFromWasteToBase(targetBaseIdx)) return false;

    let targetBaseElem = KlondikeView.foundationPileAt(targetBaseIdx);
    KlondikeView.moveFromWasteToBase(targetBaseElem);

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

let klondikeModel = null;

function startGame() {
    btnShowAllCards.style.display = "none";

    let deck = new CardDeck();
    deck.shuffle();
    klondikeModel = new KlondikeModel();
    klondikeModel.deal(deck);

    KlondikeView.setupFromModel(klondikeModel);

    KlondikeView.talonCounterElement().addEventListener("click", moveFromTalonToWaste);
    for (let cardSelector of KlondikeView.allCardSelectors()) {
        cardSelector.addEventListener("click", onCardClicked);
    }
}

