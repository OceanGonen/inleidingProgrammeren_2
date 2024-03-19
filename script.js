//Source code & inspiration by the following youtube video: https://www.youtube.com/watch?v=wYchaoAhmgA


const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const suits = ['♠', '♥', '♣', '♦']

const cardStyle = document.createElement('div');
cardStyle.classList.add('card');

const dealer = document.getElementById("dealer");
const player = document.getElementById("player");
const dealerTrain = document.getElementById("dealerTrain");


let allDecks = [];
let dealerHand = [];
let playerHand = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Creating the deck of cards and putting them in an array
function createDeck() {
    const deck = [];

    for (let suit of suits) {
        for (let value of values) {
            const card = value + suit;
            deck.push(card);
        }
    }
    return deck;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Adding additional decks
function deckQty(num) {
    allDecks = [];

    for (let i = 0; i < num; i++) {
        const newDeck = createDeck();

        // Combine the new deck with the existing decks 
        allDecks = allDecks.concat(newDeck);
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Select a random card (instead of shuffling)
function selectRandomCard() {
    // Generate a random index within the range of allDecks 
    const randomIndex = Math.floor(Math.random() * allDecks.length);

    const card = allDecks[randomIndex];

    // Remove the selected card from the allDecks array
    allDecks.splice(randomIndex, 1);

    return card;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Calculating hand value

const calcValue = (hand) => {
    let value = 0;
    let containsAce = null;
    hand.forEach((card) => {

        // Extract the value of the card
        const cardValue = card.substring(0, card.length - 1);

        if (cardValue === 'K' || cardValue === 'Q' || cardValue === 'J') {
            value += 10;
        } else if (cardValue === '10') {
            value += 10;
        } else if (cardValue === 'A') {
            containsAce = true;
            value += 11;
        } else {
            value += Number(card[0]);
        }

        // If the hand contains an Ace and the total value exceeds 21, reduce the Ace value to 1 (Instead of 11)
        if (containsAce && value > 21) {
            value -= 10;
            containsAce = false;
        }

    })
    return value;
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Asign the cards their respective property

function setCardProperty(card, container) {
    const newCard = cardStyle.cloneNode(true);
    if (card[card.length - 1] === '♦' || card[card.length - 1] === '♥') {
        newCard.setAttribute('data-red', true);
    }

    if ((container === dealer || container == dealerTrain) && container.children.length === 1) {
        newCard.classList.add('back');
    }
    // Display the card value
    newCard.innerHTML = card;
    container.append(newCard);
}























