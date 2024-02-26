let currentMoleHole;
let currentRatHole;
let score = 0;
let gameOver = false;
let timeleft;
let level = 1;
let store = {},
  inteval_speed = 0;
let currentExpression = [];
let currentScore = [];
let scoreBoard = {};
let flag = false;

const levelIndicator = document.getElementById("level");
const player = document.getElementById("username");
const start = document.getElementById("start");
const mainbody = document.getElementById("main");
const popup = document.getElementById("popUp");
const highScorePopup = document.getElementById("highScorePopup");
const cursor = document.querySelector(".cursor img");
const container = document.querySelector("#container");
const submit = document.querySelector(".submit");
const btnOk = document.querySelector("#ok");

container.addEventListener("mousemove", (e) => {
  // These two steps enable the hammer move with the cursor
  cursor.style.top = e.clientY + "px";
  cursor.style.left = e.clientX + "px";
});

window.onload = () => {
  openPopup();
};

submit.addEventListener("click", () => {
  currentExpression.push(player.value);
  // console.log(currentExpression);
  popup.classList.remove("open-Popup");

  // When clicked on start the game will load and the timer will start.
  // Timer
  timer();

  // This loads the game.
  loadGame();
});

function openPopup() {
  popup.classList.add("open-Popup");
}

function timer() {
  timeleft = 45;
  let downloadTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(downloadTimer);
      document.getElementById("timer").innerHTML = "Finished";
      document.getElementById("score").innerHTML = `Game Over. Score ${score}`;
      gameOver = true;
      displayOutput(score);
    } else {
      document.getElementById("timer").innerHTML =
        timeleft + " seconds remaining";
    }
    timeleft -= 1;
  }, 1000);
}

// To check the currect score with the previous high score.
function displayOutput(currentScore) {
  cursor.remove("img");
  if (isHighScore(currentScore)) {
    let highScores = getScores();

    console.log(highScores);

    let prevHighScore = highScores[0].score; //getting scores from storage in sorted form

    if (parseInt(currentScore) > parseInt(prevHighScore)) {
      let message = document.getElementById("message");
      message.innerText = "Congratulations! You beat high score!";
      message.classList.add("high-score"); // Apply the "high-score" style
    }
    saveScore(currentExpression, currentScore);
  }
  openHighScore();
}

// This creates 9 div boxes where the mole and the rat will pop.
function loadGame() {
  // Creating 9 divs for the holes from where the moles will pop at random intervals.
  for (let i = 0; i < 9; i++) {
    let hole = document.createElement("div");

    // Giving id's to the 9 divs from 0-8.
    hole.id = i.toString();

    hole.addEventListener("click", selectHole);

    // Adding these holes to the container.
    document.getElementById("container").appendChild(hole);
  }
  setInterval(createMole, 1000);
  setInterval(createRat, 1000);
}

// Getting random number between 0-8, i.e, between the id's of the div holes.
function getRandomHole() {
  let num = Math.floor(Math.random() * 9);

  // Returning the num as a string to use it as a pointer for div id's.
  return num.toString();
}

// Function to create mole.
function createMole() {
  if (gameOver) {
    return;
  }

  // Check if the Mole already present in a hole.
  if (currentMoleHole) {
    currentMoleHole.innerHTML = "";
  }

  let mole = document.createElement("img");
  mole.src = "./mole.png";

  // Getting random number that points to where the mole will appear.
  let num = getRandomHole();

  // Checking if the Rat already exists in that hole.
  if (currentRatHole && currentRatHole.id == num) {
    // return;
    num = getRandomHole();
    currentMoleHole = document.getElementById(num);
    currentMoleHole.appendChild(mole);
  }

  currentMoleHole = document.getElementById(num);

  // Appending the mole to the hole
  currentMoleHole.appendChild(mole);
}

// Function to create rat.
function createRat() {
  if (gameOver) {
    return;
  }

  // Check if the rat already present in a hole.
  if (currentRatHole) {
    currentRatHole.innerHTML = "";
  }

  let rat = document.createElement("img");
  rat.src = "./rat.png";
  rat.style.height = 120 + "px";

  // Getting random number that points to where the rat will appear.
  let num = getRandomHole();

  // Checking if the Mole already exists in that hole.
  if (currentMoleHole && currentMoleHole.id == num) {
    num = getRandomHole();
    currentRatHole = document.getElementById(num);
    currentRatHole.appendChild(rat);
  }

  currentRatHole = document.getElementById(num);

  // Appending the mole to the hole
  currentRatHole.appendChild(rat);
}

function selectHole() {
  container.addEventListener("click", () => {
    // This animation will work only once.
    cursor.style.animation = "hit 0.1s ease";

    // For consecutive hit animatio we need to remove the previous animaiton after each hit.
    setTimeout(() => {
      cursor.style.removeProperty("animation");
    }, 100);
  });
  if (this == currentMoleHole && gameOver === false) {
    score += 10;
    document.getElementById("score").innerHTML = score;

    if (score >= 70 && score <= 120) {
      inteval_speed = 2000;
      setInterval(createMole, inteval_speed);
      setInterval(createRat, inteval_speed);
      levelIndicator.innerHTML = 2;
    } else if (score > 120) {
      inteval_speed = 3000;
      setInterval(createMole, inteval_speed);
      setInterval(createRat, inteval_speed);
      levelIndicator.innerHTML = 3;
    }
  } else if (this == currentRatHole) {
    document.getElementById("timer").innerHTML = "Finished";
    document.getElementById("score").innerHTML = `Game Over. Score ${score}`;
    document.getElementById("score").innerHTML = `Game Over. Score ${score}`;
    currentScore.push(score);
    gameOver = true;

    displayOutput(currentScore);
  }
}

function openHighScore() {
  mainbody.style.display = "none";
  highScorePopup.classList.add("open-HighScore-popup");
  highScorePopup.style.display = "block";
  document.getElementById(
    "yourScore"
  ).textContent = `Game Over, your score ${currentScore}.`;
  document.getElementById("yourScore").style.color = "orange";

  const localStorageData = JSON.parse(localStorage.getItem("highScores")) || [];

  const storedData = document.getElementById("scores");

  storedData.innerHTML += "<ul>";

  if (flag) return;
  else {
    localStorageData.forEach((item) => {
      storedData.innerHTML += `<li>${item.name} ${item.score}`;
      flag = true;
    });
    // flag = true;
  }

  storedData.innerHTML += "</ul>";
}

btnOk.addEventListener("click", () => {
  mainbody.style.display = "block";
  highScorePopup.style.display = "none";
  highScorePopup.classList.remove("open-HighScore-popup");
  location.reload();
});

//This function checks if a given score qualifies as a high score. It does this by comparing it with the existing high scores.
// It first retrieves the previous high scores using the getScores() function.
// If there are fewer than 5 previous scores (less than 5 high scores have been recorded) or the score is higher than the lowest score among the top 4 high scores (as specified by getScores()), it returns true. Otherwise, it returns false.
function isHighScore(score) {
  const getPrevScores = getScores();
  return score > getPrevScores[getPrevScores.length - 1].score;
}

//This function retrieves the high scores from localStorage. If there are no high scores stored, it initializes an empty array.
// It then sorts the high scores in descending order (from highest to lowest) based on the score property of each object and returns only the top 4 high scores.
function getScores() {
  const highScores = JSON.parse(localStorage.getItem("highScores")) || [
    { name: "", score: 0 },
  ];
  return highScores.sort((a, b) => b.score - a.score).slice(0, 5);
}

// This function retrieves the previous scores from the local storage. Push the current score into it, again sort it in descending order
// and then stores the whole data into the local storage.
function saveScore(currentExpression, currentScore) {
  let highScores = getScores();

  highScores.push({ name: currentExpression, score: currentScore });
  highScores.sort((a, b) => b.score - a.score);

  localStorage.setItem("highScores", JSON.stringify(highScores));
}

// This function reload the page and the game starts again.
reset.addEventListener("click", () => {
  location.reload();
});
