//With assistance by ChatGPT using the following prompt: "How do I write my checkanswer function so that it checks if the player made the correct move?"

const bsTable = [
    ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"], // 5
    ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"], // 6
    ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"], // 7
    ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"], // 8
    ["D", "D", "D", "D", "D", "H", "H", "H", "H", "H"], // 9
    ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"], // 10
    ["D", "D", "D", "D", "D", "D", "D", "D", "D", "D"], // 11
    ["H", "H", "S", "S", "S", "H", "H", "H", "H", "H"], // 12
    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // 13
    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // 14
    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // 15
    ["S", "S", "S", "S", "S", "H", "H", "H", "H", "H"], // 16
    ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // 17

    ["H", "H", "H", "D", "D", "H", "H", "H", "H", "H"], // A, 2
    ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"], // A, 3
    ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"], // A, 4
    ["H", "H", "D", "D", "D", "H", "H", "H", "H", "H"], // A, 5
    ["H", "D", "D", "D", "D", "H", "H", "H", "H", "H"], // A, 6
    ["D", "D", "D", "D", "D", "S", "S", "H", "H", "H"], // A, 7
    ["S", "S", "S", "S", "D", "S", "S", "S", "S", "S"], // A, 8
    ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // A, 9
];

const bsTableWithPair = [
    ["H", "H", "V", "V", "V", "V", "H", "H", "H", "H"], // 2, 2
    ["H", "H", "V", "V", "V", "V", "H", "H", "H", "H"], // 3, 3
    ["H", "H", "H", "H", "H", "H", "H", "H", "H", "H"], // 4, 4
    ["D", "D", "D", "D", "D", "D", "D", "D", "H", "H"], // 5, 5
    ["V", "V", "V", "V", "V", "H", "H", "H", "H", "H"], // 6, 6
    ["V", "V", "V", "V", "V", "V", "H", "H", "H", "H"], // 7, 7
    ["V", "V", "V", "V", "V", "V", "V", "V", "V", "V"], // 8, 8
    ["V", "V", "V", "V", "V", "S", "V", "V", "S", "S"], // 9, 9
    ["S", "S", "S", "S", "S", "S", "S", "S", "S", "S"], // 10, 10
    ["V", "V", "V", "V", "V", "V", "V", "V", "V", "V"], // A, A
];

const playerTrain = document.getElementById("playerTrain");

const dealerHandValueElementTrain = document.getElementById(
    "dealerHandValueTrain",
);
const playerHandValueElementTrain = document.getElementById(
    "playerHandValueTrain",
);
const pointValueELement = document.getElementById("pointValue");

const resultBanner = document.getElementById("banner-train");

const hitTrainBtn = document.getElementById("hit-train-btn");
const standTrainBtn = document.getElementById("stand-train-btn");
const doubleDownBtn = document.getElementById("double-down-btn-train");
const splitBtn = document.getElementById("split-btn");

let dealerHandTraining = [];
let playerHandTraining = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function dealHandTraining() {
    dealerTrain.innerHTML = "";
    playerTrain.innerHTML = "";

    dealerHandTraining = [selectRandomCard(), selectRandomCard()];

    // Display dealer's cards
    dealerHandTraining.forEach((card) => {
        setCardProperty(card, dealerTrain);
    });

    playerHandTraining = [selectRandomCard(), selectRandomCard()];
    playHandNoSuits = [
        playerHandTraining[0].slice(0, -1),
        playerHandTraining[1].slice(0, -1),
    ];

    // Display player's cards
    playerHandTraining.forEach((card) => {
        setCardProperty(card, playerTrain);
    });

    handValue = calcValue(playerHandTraining);

    updatePlayerHandValueTrain(handValue);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Update the value element on the page

function updatePlayerHandValueTrain(value) {
    playerHandValueElementTrain.textContent = value;
}

function updateDealerHandValueTrain(value) {
    dealerHandValueElementTrain.textContent = value;
}


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Foldable cheat sheet
document.getElementById("toggle-btn").addEventListener("click", function () {
    let sheetContent = document.getElementById("cheat-sheet-content");
    sheetContent.classList.toggle("hidden");

    this.classList.toggle("hidden");
});

document.getElementById("hide-cheat-sheet-btn").addEventListener("click", function () {
        let sheetContent = document.getElementById("cheat-sheet-content");
        sheetContent.classList.toggle("hidden");

        document.getElementById("toggle-btn").classList.toggle("hidden");
    });

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Checks if the player made the correct move according to the basic strategy table

function checkAnswer(handValue, playerHand, dealerUpcard, playerMove) {
    console.log("move " + playerMove);

    let table;
    let rowIndex;
    let colIndex;

    // Check if both cards are the same. 
    if (playerHand[0] == playerHand[1]) {
        if (playerHand.includes("A")) {
            rowIndex = 9; // A,A
        } else if (playerHand.includes("J") || playerHand.includes("Q") || playerHand.includes("K")){
            rowIndex = 8; // 10,10
        } else {
            rowIndex = playerHand[0] - 2;// index 0 == value 2 (one card)
        }

        table = bsTableWithPair; // Use the table with pairs
    }
    // Otherwise, use standard table.
    else {
        if (handValue == 21) {
            rowIndex = 12; // This row is only stand
            console.log("Just stand, dumbass!");
        } else if (playerHand.includes("A")) {
            rowIndex = handValue; // Coincidentally, the value and rowIndex line up perfectly
        } else if (handValue < 5) {
            rowIndex = 0; // This row is only hit
        } else if (handValue > 17) {
            rowIndex = 12; // This row is only stand
        } else {
            rowIndex = handValue - 5; // Standard table, hard values (index 0 == combined value of 5)
        }
        table = bsTable;
    }
    console.log("row " + rowIndex);

    // Define the mapping for column indexes to dealer card values
    const dealerCardValues = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "A"];

    let dealerCardValue = dealerUpcard.substring(0, dealerUpcard.length - 1);

    // Find the column index corresponding to the dealer card value
    if (
        dealerCardValue === "K" ||
        dealerCardValue === "Q" ||
        dealerCardValue === "J"
    ) {
        colIndex = 8;
    } else if (dealerCardValue === "A") {
        colIndex = 9;
    } else {
        colIndex = dealerCardValues.indexOf(dealerCardValue);
    }
    console.log("col " + colIndex);

    console.log(table[rowIndex][colIndex] === playerMove);

    function waitForNextHand() {
        setTimeout(function () {
            resultBanner.classList.add("hidden");
            resultBanner.classList.remove("win");
            resultBanner.classList.remove("lose");
            dealHandTraining();
        }, 1000); // 1500 milliseconds
    }

    if (table[rowIndex][colIndex] === playerMove) {
        resultBanner.textContent = "Correct!";
        resultBanner.classList.remove("hidden");
        resultBanner.classList.add("win");
        waitForNextHand();
    } else {
        resultBanner.textContent =
            "Incorrect! Move was " + table[rowIndex][colIndex];
        resultBanner.classList.remove("hidden");
        resultBanner.classList.add("lose");
        waitForNextHand();
    }
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

deckQty(5);

dealHandTraining();

hitTrainBtn.addEventListener("click", function () {
    checkAnswer(handValue, playHandNoSuits, dealerHandTraining[0], "H");
});
standTrainBtn.addEventListener("click", function () {
    checkAnswer(handValue, playHandNoSuits, dealerHandTraining[0], "S");
});
doubleDownBtn.addEventListener("click", function () {
    checkAnswer(handValue, playHandNoSuits, dealerHandTraining[0], "D");
});
splitBtn.addEventListener("click", function () {
    checkAnswer(handValue, playHandNoSuits, dealerHandTraining[0], "V");
});
