//Source code & inspiration by the following youtube video: https://www.youtube.com/watch?v=wYchaoAhmgA


const hitBtn = document.getElementById("hit-btn");
const standBtn = document.getElementById("stand-btn");
const nextHandBtn = document.getElementById("deal");
const doubleDownBtn = document.getElementById("double-down-btn");
const btnContainer = document.getElementById("btn-container");
const chipBtnContainer = document.getElementById("chipBtnContainer"); 

const dealerHandValueElement = document.getElementById("dealerHandValue");
const playerHandValueElement = document.getElementById("playerHandValue");
const chipBalanceElement = document.getElementById("chip-balance");
const currentBetElement = document.getElementById("current-bet");

const bet10btn = document.getElementById("bet-10");
const bet25btn = document.getElementById("bet-25");
const bet50btn = document.getElementById("bet-50");
const bet100btn = document.getElementById("bet-100");
const allInBtn = document.getElementById("all-in");
const undoBtn = document.getElementById("undo");


const resultBanner = document.getElementById("banner");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Placing bets
let startingChipBalance = 1000;
let currentChipBalance = startingChipBalance;
let currentBetAmount = 0;

updateChipBalance(startingChipBalance);
updateCurrentBetAmount(currentBetAmount);

//Betting buttons
bet10btn.addEventListener("click", () => {
    currentBetAmount += 10;
    currentChipBalance -= 10;
    updateCurrentBetAmount(currentBetAmount);
    updateChipBalance(currentChipBalance);
});
bet25btn.addEventListener("click", () => {
    currentBetAmount += 25;
    currentChipBalance -= 25;
    updateCurrentBetAmount(currentBetAmount);
    updateChipBalance(currentChipBalance);
});

bet50btn.addEventListener("click", () => {
    currentBetAmount += 50;
    currentChipBalance -= 50;
    updateCurrentBetAmount(currentBetAmount);
    updateChipBalance(currentChipBalance);
});

bet100btn.addEventListener("click", () => {
    currentBetAmount += 100;
    currentChipBalance -= 100;
    updateCurrentBetAmount(currentBetAmount);
    updateChipBalance(currentChipBalance);
});

allInBtn.addEventListener("click", () => {
    currentBetAmount += currentChipBalance;
    currentChipBalance -= currentChipBalance;
    updateCurrentBetAmount(currentBetAmount);
    updateChipBalance(currentChipBalance);
});

undoBtn.addEventListener("click", () => {
    currentChipBalance += currentBetAmount;
    updateChipBalance(currentChipBalance);
    currentBetAmount = 0;
    updateCurrentBetAmount(currentBetAmount);
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Dealing the cards
function dealHands() {

    dealer.innerHTML = '';
    player.innerHTML = '';

    dealerHand = [selectRandomCard(), selectRandomCard()];

    // Display dealer's cards
    dealerHand.forEach((card) => {
        setCardProperty(card, dealer);
    });

    playerHand = [selectRandomCard(), selectRandomCard()];

    // Display player's cards
    playerHand.forEach((card) => {
        setCardProperty(card, player);
    });

    handValue = calcValue(playerHand);

    if(playerHand.length == 2 && (handValue <= 11 && handValue >= 9)){
        btnContainer.appendChild(doubleDownBtn);
    }
    
    //Check if the player has Blackjack
    if (playerHand.length == 2 && handValue == 21) {
        console.log("BlackJack! Congratulations")
    }

    updatePlayerHandValue(calcValue(playerHand));
    console.log("Player: " + calcValue(playerHand));
}
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding funtion to the 'Double down' button

function playerDoublesDown () {
    currentChipBalance -= currentBetAmount; //Subtract the current bet amount from the player chip balance again
    updateChipBalance(currentChipBalance);
    currentBetAmount *= 2; // Double the current bet amount
    updateCurrentBetAmount(currentBetAmount);
    playerHits();
    playerStands(); // Player only receives one card
    doubleDownBtn.remove();
}

doubleDownBtn.addEventListener('click', playerDoublesDown);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding funtion to the 'Hit' button

const playerHits = () => { 
    newCard = selectRandomCard();
    playerHand.push(newCard);

    setCardProperty(newCard, player);


    updatePlayerHandValue(calcValue(playerHand));
    console.log("Player: " + calcValue(playerHand));

    //Checks if player lost by busting. 
    if (calcValue(playerHand) > 21) {
        console.log("Bust");
        appendLossBanner();

        hitBtn.remove();
        standBtn.remove();

        // Append the 'nextHand' button to the document body
        chipContainer.appendChild(nextHandBtn);
    }
}

hitBtn.addEventListener('click', playerHits);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding funtion to the 'Stand' button

const playerStands = async () => {

    updateDealerHandValue(calcValue(dealerHand));

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    await delay(500);
    // Reveal the dealer's hidden card
    const hiddenCard = dealer.children[1];
    hiddenCard.classList.remove('back');
    hiddenCard.innerHTML = dealerHand[1];

    //Calculates dealer's hand value and decides next move
    let handValue = calcValue(dealerHand);
    while (handValue < 17) {

        let newDealerCard = selectRandomCard();
        dealerHand.push(newDealerCard);

        setCardProperty(newDealerCard, dealer);

        updateDealerHandValue(calcValue(dealerHand));
        handValue = calcValue(dealerHand);
        console.log("Dealer: " + handValue);

        await delay(1000);
    }

    if (handValue > 21) {
        console.log("Dealer bust, you win!");

        hitBtn.remove();
        standBtn.remove();
        doubleDownBtn.remove();
        appendWinBanner();

        // Append the 'nextHand' button to the document body
        chipContainer.appendChild(nextHandBtn);

    } else if (dealerHand.length == 2 && (dealerHand.includes('A') && handValue == 21)) {
        console.log("Dealer has BlackJack, you lost. ");
    }

    if (handValue > 16 && handValue < 22) {
        appointWinner();
    }
}

standBtn.addEventListener('click', playerStands);
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Appointing the winner

const appointWinner = async () => {
    playerValue = calcValue(playerHand);
    dealerValue = calcValue(dealerHand);

    if (playerValue < 22 && playerValue > dealerValue) {
        console.log('Dealer : ' + dealerValue + ', You win!');
        appendWinBanner();
    } else if (dealerValue < 22 && dealerValue > playerValue) {
        console.log('Dealer : ' + dealerValue + ', You lose');
        appendLossBanner();
    } else {
        console.log('Dealer : ' + dealerValue);
        console.log('Push');
        appendPushBanner();
    }

    hitBtn.remove();
    standBtn.remove();

    // Append the 'nextHand' button to the document body
    chipContainer.appendChild(nextHandBtn);
}

nextHandBtn.addEventListener('click', () => {

    dealerHand.splice(0, dealerHand.length);
    playerHand.splice(0, playerHand.length);

    resultBanner.classList.add('hidden');
    resultBanner.classList.remove('win');
    resultBanner.classList.remove('lose');
    resultBanner.classList.remove('push');

    nextHandBtn.remove();
    btnContainer.appendChild(hitBtn);
    btnContainer.appendChild(standBtn);
    btnContainer.classList.remove('hidden');

    chipBtnContainer.classList.add('hidden');

    dealerHandValueElement.textContent = "";
    dealHands();
});

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Append the result to the page

function appendWinBanner() {
    resultBanner.textContent = "You won €" + currentBetAmount;
    resultBanner.classList.remove('hidden');
    resultBanner.classList.add('win');
    currentChipBalance += (currentBetAmount * 2); // Double the bet for winning
    currentBetAmount = 0;
    updateCurrentBetAmount(currentBetAmount);
    updateChipBalance(currentChipBalance);
    chipBtnContainer.classList.remove('hidden');

}

function appendLossBanner() {
    resultBanner.textContent = "You lost €" + currentBetAmount;
    resultBanner.classList.remove('hidden');
    resultBanner.classList.add('lose');
    currentBetAmount = 0;
    updateCurrentBetAmount(currentBetAmount);
    chipBtnContainer.classList.remove('hidden');
}

function appendPushBanner() {
    resultBanner.textContent = "PUSH";
    resultBanner.classList.remove('hidden');
    resultBanner.classList.add('push');
    currentChipBalance += currentBetAmount; // Return the bet amount for a tie
    currentBetAmount = 0;
    updateCurrentBetAmount(currentBetAmount);
    updateChipBalance(currentChipBalance);
    chipBtnContainer.classList.remove('hidden');
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Update the value element on the page

function updatePlayerHandValue(value) {
    playerHandValueElement.textContent = value;
}

function updateDealerHandValue(value) {
    dealerHandValueElement.textContent = value;
}

function updateChipBalance(value){
    chipBalanceElement.textContent = value;
}

function updateCurrentBetAmount(value) {
    currentBetElement.textContent = value;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Set cards and start the first hand

deckQty(5);

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Adding function to the Split button

// function displaySplitHands(hand1, hand2) {
//     // Clear the player's current hand display
//     player.innerHTML = '';

//     // Display the first split hand
//     hand1.forEach(card => {
//         setCardProperty(card, player);
//     });

//     // Calculate and display the value of the first split hand
//     const hand1Value = calcValue(hand1);
//     updatePlayerHandValue(hand1Value);

//     // Deal an additional card to the first split hand
//     const newCard1 = selectRandomCard();
//     hand1.push(newCard1);
//     setCardProperty(newCard1, player);

//     // Calculate and display the updated value of the first split hand
//     const updatedHand1Value = calcValue(hand1);
//     updatePlayerHandValue(updatedHand1Value);

//     // Create a new container for the second split hand
//     const secondHandContainer = document.createElement('div');
//     secondHandContainer.classList.add('cards');

//     // Append the second hand container to the player area
//     player.appendChild(secondHandContainer);

//     // Display the second split hand
//     hand2.forEach(card => {
//         setCardProperty(card, secondHandContainer);
//     });

//     // Calculate and display the value of the second split hand
//     const hand2Value = calcValue(hand2);
//     updateSplitHandValue(hand2Value);
    
//     // Deal an additional card to the second split hand
//     const newCard2 = selectRandomCard();
//     hand2.push(newCard2);
//     setCardProperty(newCard2, secondHandContainer);

//     // Calculate and display the updated value of the second split hand
//     const updatedHand2Value = calcValue(hand2);
//     updateSplitHandValue(updatedHand2Value);
// }

// splitBtn.addEventListener('click', () => {

//     const hand1 = [playerHand[0], selectRandomCard()];
//     const hand2 = [playerHand[1], selectRandomCard()];

//     displaySplitHands(hand1, hand2);

//     splitBtn.remove();
    
// });



// Function to update the value of the second split hand
// function updateSplitHandValue(value) {
//     const splitHandValueElement = document.getElementById("splitHandValue");
//     splitHandValueElement.textContent = value;
// }






















