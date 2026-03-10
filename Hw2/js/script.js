// ---------------------------
// Web Storage: count quiz uses
// ---------------------------
function loadQuizCount() {
    let quizCount = localStorage.getItem("quizCount");

    if (quizCount === null) {
        quizCount = 0;
        localStorage.setItem("quizCount", quizCount);
    }

    document.querySelector("#quizCount").textContent = quizCount;
}

function incrementQuizCount() {
    let quizCount = localStorage.getItem("quizCount");

    if (quizCount === null) {
        quizCount = 0;
    } else {
        quizCount = parseInt(quizCount);
    }

    quizCount++;
    localStorage.setItem("quizCount", quizCount);
    document.querySelector("#quizCount").textContent = quizCount;
}

loadQuizCount();

// ---------------------------
// Randomized question for Q1
// ---------------------------
const q1Choices = [
    "Sacramento",
    "Los Angeles",
    "San Diego"
];

function shuffleArray(array) {
    let copiedArray = [...array];

    for (let i = copiedArray.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [copiedArray[i], copiedArray[j]] = [copiedArray[j], copiedArray[i]];
    }

    return copiedArray;
}

function loadQuestion1() {
    const q1Container = document.querySelector("#q1Options");
    const shuffled = shuffleArray(q1Choices);

    q1Container.innerHTML = "";

    for (let i = 0; i < shuffled.length; i++) {
        const choice = shuffled[i];
        const inputId = `q1_${i}`;

        q1Container.innerHTML += `
      <div class="form-check">
        <input class="form-check-input" type="radio" name="q1" id="${inputId}" value="${choice}">
        <label class="form-check-label" for="${inputId}">${choice}</label>
      </div>
    `;
    }
}

loadQuestion1();

shuffleOptions("q2");
shuffleOptions("q3");
shuffleOptions("q4");
shuffleOptions("q5");

// ---------------------------
// Range live display
// ---------------------------
const q9Range = document.querySelector("#q9");
const rangeValue = document.querySelector("#rangeValue");

q9Range.addEventListener("input", function () {
    rangeValue.textContent = q9Range.value;
});

// ---------------------------
// Helper to display feedback
// ---------------------------
function showFeedback(questionNumber, isCorrect, correctAnswerText) {
    const feedbackDiv = document.querySelector(`#feedback${questionNumber}`);
    const imagePath = isCorrect ? "img/correctImage.webp" : "img/incorrectImage.png";

    if (isCorrect) {
        feedbackDiv.innerHTML = `
      <span class="correct-text">Correct!</span>
      <img src="${imagePath}" alt="Correct answer icon">
    `;
    } else {
        feedbackDiv.innerHTML = `
      <span class="incorrect-text">Incorrect. Correct answer: ${correctAnswerText}</span>
      <img src="${imagePath}" alt="Incorrect answer icon">
    `;
    }
}

function updateProgress() {
    let answered = 0;

    if (document.querySelector('input[name="q1"]:checked')) answered++;
    if (document.querySelector('input[name="q2"]:checked')) answered++;
    if (document.querySelector('input[name="q3"]:checked')) answered++;
    if (document.querySelector('input[name="q4"]:checked')) answered++;
    if (document.querySelector('input[name="q5"]:checked')) answered++;

    const q6Checked =
        document.querySelector("#q6a").checked ||
        document.querySelector("#q6b").checked ||
        document.querySelector("#q6c").checked ||
        document.querySelector("#q6d").checked;
    if (q6Checked) answered++;

    if (document.querySelector("#q7").value !== "") answered++;
    if (document.querySelector("#q8").value.trim() !== "") answered++;
    if (document.querySelector("#q9").value !== "") answered++;
    if (document.querySelector("#q10").value !== "") answered++;

    const percent = answered * 10;
    const progressBar = document.querySelector("#quizProgress");
    progressBar.style.width = `${percent}%`;
    progressBar.textContent = `${percent}%`;
}

document.querySelectorAll("input, select").forEach(element => {
    element.addEventListener("input", updateProgress);
    element.addEventListener("change", updateProgress);
});

function animateScore(finalScore) {
    let currentScore = 0;

    const scoreInterval = setInterval(function () {
        currentScore += 5;

        document.querySelector("#totalScore").textContent = currentScore;

        if (currentScore >= finalScore) {
            document.querySelector("#totalScore").textContent = finalScore;
            clearInterval(scoreInterval);
        }

    }, 40);
}

// ---------------------------
// Grade quiz
// ---------------------------
function gradeQuiz() {
    incrementQuizCount();

    let score = 0;

    // Question 1
    const q1Answer = document.querySelector('input[name="q1"]:checked');
    const q1Correct = q1Answer && q1Answer.value === "Sacramento";
    if (q1Correct) score += 10;
    showFeedback(1, q1Correct, "Sacramento");

    // Question 2
    const q2Answer = document.querySelector('input[name="q2"]:checked');
    const q2Correct = q2Answer && q2Answer.value === "Arizona";
    if (q2Correct) score += 10;
    showFeedback(2, q2Correct, "Arizona");

    // Question 3
    const q3Answer = document.querySelector('input[name="q3"]:checked');
    const q3Correct = q3Answer && q3Answer.value === "Alaska";
    if (q3Correct) score += 10;
    showFeedback(3, q3Correct, "Alaska");

    // Question 4
    const q4Answer = document.querySelector('input[name="q4"]:checked');
    const q4Correct = q4Answer && q4Answer.value === "Gulf of Mexico";
    if (q4Correct) score += 10;
    showFeedback(4, q4Correct, "Gulf of Mexico");

    // Question 5
    const q5Answer = document.querySelector('input[name="q5"]:checked');
    const q5Correct = q5Answer && q5Answer.value === "Hawaii";
    if (q5Correct) score += 10;
    showFeedback(5, q5Correct, "Hawaii");

    // Question 6 - checkbox
    const q6a = document.querySelector("#q6a").checked;
    const q6b = document.querySelector("#q6b").checked;
    const q6c = document.querySelector("#q6c").checked;
    const q6d = document.querySelector("#q6d").checked;

    const q6Correct = q6a && q6b && q6d && !q6c;
    if (q6Correct) score += 10;
    showFeedback(6, q6Correct, "Oregon, Nevada, and Arizona");

    // Question 7 - select
    const q7Answer = document.querySelector("#q7").value;
    const q7Correct = q7Answer === "Austin";
    if (q7Correct) score += 10;
    showFeedback(7, q7Correct, "Austin");

    // Question 8 - text
    const q8Answer = document.querySelector("#q8").value.trim().toLowerCase();
    const q8Correct = q8Answer === "albany";
    if (q8Correct) score += 10;
    showFeedback(8, q8Correct, "Albany");

    // Question 9 - range
    const q9Answer = document.querySelector("#q9").value;
    const q9Correct = q9Answer === "50";
    if (q9Correct) score += 10;
    showFeedback(9, q9Correct, "50");

    // Question 10 - number
    const q10Answer = document.querySelector("#q10").value;
    const q10Correct = q10Answer === "5";
    if (q10Correct) score += 10;
    showFeedback(10, q10Correct, "5");

    animateScore(score);

    const messageDiv = document.querySelector("#message");

    if (score > 80) {
        messageDiv.textContent = "Congratulations! You scored above 80! You are a U.S. geography expert!";
        messageDiv.className = "mt-2 fw-bold text-success";

        console.log("score > 80 reached");
        console.log("confetti type:", typeof confetti);

        if (typeof confetti === "function") {
            confetti({
                particleCount: 120,
                spread: 90,
                origin: { y: 0.6 }
            });
        } else {
            console.log("confetti library did not load");
        }
    } else if (score >= 60) {
        messageDiv.textContent = "Nice job! You're close—give it another try and go for 100!";
        messageDiv.className = "mt-2 fw-bold text-warning";
    } else {
        messageDiv.textContent = "Keep practicing and try again!";
        messageDiv.className = "mt-2 fw-bold text-danger";
    }
    document.querySelector("#submitBtn").disabled = true;

    document.querySelector("#scoreSection").scrollIntoView({
        behavior: "smooth"
    });

}

// ---------------------------
// Reset quiz
// ---------------------------
function resetQuiz() {
    document.querySelector("#quizForm").reset();
    document.querySelector("#totalScore").textContent = "0";
    document.querySelector("#message").textContent = "";
    document.querySelector("#rangeValue").textContent = "50";
    document.querySelector("#quizProgress").style.width = "0%";
    document.querySelector("#quizProgress").textContent = "0%";

    for (let i = 1; i <= 10; i++) {
        document.querySelector(`#feedback${i}`).innerHTML = "";
    }

    document.querySelector("#submitBtn").disabled = false;
    loadQuestion1();

    shuffleOptions("q2");
    shuffleOptions("q3");
    shuffleOptions("q4");
    shuffleOptions("q5");
}

function shuffleOptions(questionName) {
    const options = Array.from(document.querySelectorAll(`input[name="${questionName}"]`));
    const container = options[0].closest(".question-block");

    const optionElements = options.map(input => input.parentElement);

    for (let i = optionElements.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [optionElements[i], optionElements[j]] = [optionElements[j], optionElements[i]];
    }

    optionElements.forEach(option => container.appendChild(option));
}

// ---------------------------
// Event listeners
// ---------------------------
document.querySelector("#submitBtn").addEventListener("click", gradeQuiz);
document.querySelector("#resetBtn").addEventListener("click", resetQuiz);