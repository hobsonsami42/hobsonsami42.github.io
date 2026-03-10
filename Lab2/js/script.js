//Event listeners
document.querySelector("#guessBtn").addEventListener("click", checkGuess);
document.querySelector("#resetBtn").addEventListener("click", initializeGame);
document.querySelector("#playerGuess").addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
        checkGuess();
    }
});

//Global variables
let randomNumber;
let attempts = 0;
let totalWins = 0;
let totalLosses = 0;
let previousGuesses = [];

initializeGame();

function initializeGame() {
    randomNumber = Math.floor(Math.random() * 99) + 1;
    console.log("Random number: " + randomNumber);

    previousGuesses = [];
    attempts = 0;

    document.querySelector("#guesses").textContent ="";

    //Hide reset Button
    document.querySelector("#resetBtn").style.display = "none";

    //Show guess button
    document.querySelector("#guessBtn").style.display = "inline-block";

    //Focus and clear textbox
    let playerGuess = document.querySelector("#playerGuess");
    playerGuess.focus();
    playerGuess.value = "";

    //Clear feedback
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";

    //Clear previous guesses
    document.querySelector("#guesses").textContent = "";

    //Reset attempts left
    document.querySelector("#attemptsLeft").textContent = String(7);

}

function checkGuess() {
    let feedback = document.querySelector("#feedback");
    feedback.textContent = "";
    feedback.className = "";

    let guess = Number(document.querySelector("#playerGuess").value);
    console.log("Player guess: " + guess);

    //Validation
    if (guess < 1 || guess > 99 || isNaN(guess)) {
        feedback.textContent = "Enter a number between 1 and 99.";
        feedback.className = "error-message";
        return;
    }

    if (previousGuesses.includes(guess)) {
        feedback.textContent = "You already guessed that number!";
        feedback.className = "hint-message";
        return;
    }

    attempts++;
    console.log("Attempts: " + attempts);

    //Save guess in array
    previousGuesses.push(guess);

    document.querySelector("#attemptsLeft").textContent = String(7 - attempts);

    //Show previous guesses
    document.querySelector("#guesses").textContent += guess + " ";

    feedback.className = "hint-message";

    if (guess === randomNumber) {
        feedback.textContent = "Congratulations! You guessed the number in " + attempts + " attempt(s)!";
        feedback.className = "win-message";

        totalWins++;
        document.querySelector("#wins").textContent = String(totalWins);

        gameOver();
    } else {
        if (attempts === 7) {
            feedback.textContent = "You Lost! The random number was " + randomNumber + ".";
            feedback.className = "loss-message";

            totalLosses++;

            document.querySelector("#losses").textContent = String(totalLosses);

            gameOver();
        } else if (guess > randomNumber) {
            feedback.textContent = "Too high! Guess Lower.";
            feedback.className = "hint-message";
        } else {
            feedback.textContent = "Too low! Guess higher.";
            feedback.className = "hint-message";
        }
    }

    document.querySelector("#playerGuess").value = "";
    document.querySelector("#playerGuess").focus();
}

function gameOver() {
    let guessBtn = document.querySelector("#guessBtn");
    let resetBtn = document.querySelector("#resetBtn");

    guessBtn.style.display = "none";
    resetBtn.style.display = "inline-block";
}