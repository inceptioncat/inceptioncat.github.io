// Game variables
var randomizedAritsts;
var currentIndex;
var lastRoundIndex;
var score;
var guessesThisRound;

// Elements
var startScreen = document.getElementById("startScreen");
var filterScreen = document.getElementById("filterScreen");
var playScreen = document.getElementById("playScreen");
var endScreen = document.getElementById("endScreen");

var artistName = document.getElementById("artistName");
var gameDescription = document.getElementById("gameDescription");
var scoreText = document.getElementById("scoreText");
var artistsThisRoundTitle = document.getElementById("artistsThisRoundTitle");
var artistsThisRoundList = document.getElementById("artistsThisRoundList");
var explainationText = document.getElementById("explainationText");
var filterLink = document.getElementById("filterLink");

var nextButton = document.getElementById("nextButton");
var passButton = document.getElementById("passButton");
var nextRoundButton = document.getElementById("nextRoundButton");
var newGameButton = document.getElementById("newGameButton");
var gameButton = document.getElementById("gameButton")
var saveButton = document.getElementById("saveButton")

var timerText = document.getElementById("gameTimer");

var gameTimer;

var popupButtons = document.querySelectorAll("[data-popup]");
 
var roundTimeLeft;
var gameCount = 60;
var startCountdown;
var countdown = 3;
var hasGameStarted = false;

const states = {
  START_SCREEN: "START_SCREEN",
  END_SCREEN: "END_SCREEN",
  PLAYING: "PLAYING",
  COUNTDOWN: "COUNTDOWN"
}

var gameState;

var filterGenres = document.getElementById("filterGenres");
var genreList = new Set(artists.flatMap(m => m.tag))
var filterLanguages = document.getElementById("filterLanguages");
var languageList = new Set(artists.map(m => m.language))

setup();

// function handleKeyUpStartScreen(event) {
//   if (event.code === "Space") {
//     console.log("HELLO")
//     startNewGame();
//   }
// }

// function handleKeyUpNewGame(event) {

// }

function setup() {
  gameState = states.START_SCREEN;

	gameButton.addEventListener("click", startNewGame);

  document.addEventListener("keyup", handleKeyUp);
  document.addEventListener("keydown", handleKeyDown);
  // document.addEventListener("keyup", handleKeyUpStartScreen);

  filterLink.addEventListener("click", showFilterScreen);
  roundTimeLeft = gameCount;

  popupButtons.forEach(button => {
    console.log(button)
    button.addEventListener("click", togglePopup)
  })

  renderGenreCheckboxes()
  renderLanguageCheckboxes()

	timerText.innerHTML = roundTimeLeft;

  showElement(startScreen);
}

function showFilterScreen(e) {
  e.preventDefault();

  hideElement(startScreen);
  showElement(filterScreen);

  saveButton.addEventListener("click", newGame);
}

function togglePopup(e) {
  var popupId = this.getAttribute("data-popup");
  var popupElement = document.getElementById(popupId);

  popupElement.classList.toggle("hidden")

  this.classList.toggle("open")
}

function updateArtists(artists) {
  // get list of checked checkboxes
  var checkedGenres = Array.from(document.querySelectorAll("#filterGenres input:checked")).map(input => input.value);
  var checkedLanguages = Array.from(document.querySelectorAll("#filterLanguages input:checked")).map(input => input.value);

  // filter out checked genres from artists
  var filteredArtists = artists
  .filter(artist => artist.tag.some(t => checkedGenres.includes(t)))

  // filter out checked genres from languages
  .filter(artist => checkedLanguages.includes(artist.language))

  return filteredArtists
}

function newGame() {
  hideElement (endScreen);
  hideElement (filterScreen);
  showElement (startScreen);

  hasGameStarted = false;
}

function startNewGame() {
  var filteredArtists = updateArtists(artists);

  if (filteredArtists.length > 1) {

    hideElement(startScreen);

    randomizedArtists = shuffle(filteredArtists);
    currentIndex = 0;
    nextRound();

  }

  else {
    gameDescription.innerHTML = "No artists generated. Change filter to allow more genres."
    hideElement(gameButton);
  }

}

function nextRound() {
  gameState = states.COUNTDOWN;
  score = 0;
  roundTimeLeft = gameCount;
  lastRoundIndex = currentIndex;

  guessesThisRound = [];

  // var oldSlice = randomizedArtists.slice(0, currentIndex)
  // var newSlice = updateArtists(randomizedArtists.slice(currentIndex))

  // randomizedArtists = oldSlice.concat(newSlice)

  if(!hasArtistsLeft()) {
    return endGame();
  }

  hasGameStarted = true;
  handleCountdownTimer();
  startCountdown = setInterval(handleCountdownTimer, 1000);
  
  hideElement(endScreen);
  showElement(playScreen);
  hideElement(nextButton);
  hideElement(passButton);
  hideElement(explainationText);

  clearElement(artistsThisRoundList)

  scoreText.innerHTML = "";
  timerText.innerHTML = gameCount;
  timerText.classList.remove("redNumbers");

  nextRoundButton.removeEventListener("click", nextRound);
}

function playGame() {
  gameState = states.PLAYING;

	nextButton.addEventListener("click", nextArtist);
	passButton.addEventListener("click", passArtist);

	countdown = 3;

  handleCurrentArtist();

  showElement(passButton, "inline");
  showElement(nextButton, "inline");
	
	gameTimeHandler();
	gameTimer = setInterval(gameTimeHandler, 1000);
}



function endGame() {
  gameState = states.END_SCREEN;

  console.log("end game called", gameTimer)

  guessesThisRound.push(false);

  var artistsThisRound = randomizedArtists.slice(lastRoundIndex, currentIndex)

  clearInterval(gameTimer);
  clearInterval(startCountdown);

	scoreText.innerHTML = "You scored " + score + " points";

  artistsThisRoundTitle.innerHTML = "In this round";

  console.log(artistsThisRound, guessesThisRound);

  var artistElements = artistsThisRound.forEach((artist, i) => {
    var el = document.createElement("li")

    console.log(artist, i)


    el.innerText = artist.name 

  
    // color
     if(guessesThisRound[i] == true) {
       el.classList.add('blue-text')
     } else {
       el.classList.add('pink-text')
     }
    

    artistsThisRoundList.appendChild(el)
  })  

  hideElement(playScreen);
  showElement(endScreen);
  showElement(artistsThisRoundList);
  showElement(artistsThisRoundTitle, "block");

  nextButton.removeEventListener("click", nextArtist);
 
  // document.removeEventListener("keyup", handleKeyUp);
	// document.removeEventListener("keydown", handleKeyDown);

	newGameButton.addEventListener("click", newGame);

  if (hasArtistsLeft()) {
    showElement(nextRoundButton);
    nextRoundButton.addEventListener("click", nextRound);
  } else {
    showElement(explainationText, "block");
    explainationText.innerHTML = "No more artists."
  }
}


function handleCountdownTimer() {
	console.log(countdown)
  if(countdown === 0) {
    clearInterval(startCountdown);
    playGame();
  } else {
    artistName.innerHTML = countdown;
    countdown--;
  }
}

function gameTimeHandler() {
	timerText.innerHTML = roundTimeLeft;
	console.log(roundTimeLeft)
  console.log({gameTimer})
	if(roundTimeLeft === 5) {
		timerText.classList.add("redNumbers");
	}
  if(roundTimeLeft === 0) {
    clearInterval(gameTimer);
    endGame();

  } else {
    roundTimeLeft--;
  }
}

function renderArtist() {
  console.log("currentindex", currentIndex);
	artistName.innerHTML = randomizedArtists[currentIndex].name;
}

function hasArtistsLeft() {
  if (currentIndex >= randomizedArtists.length) {
    return false
  }

  return true;
}

function handleCurrentArtist() {
	if (!hasArtistsLeft()) {
		return endGame();
	}

	renderArtist();

  currentIndex += 1;
}

function renderGenreCheckboxes() {
  genreList.forEach(function(genre, i) {

    var newCheckbox = document.createElement("input")
    var newLabel = document.createElement("label")

    var genreTitle = document.createTextNode(genre); 

    newLabel.appendChild(newCheckbox);
    newLabel.appendChild(genreTitle);

    newCheckbox.checked = true;

    newCheckbox.type = "checkbox";
    newCheckbox.name = "genre[]"
    newCheckbox.value = genre

    filterGenres.appendChild(newLabel)

    console.log(genre, i, newCheckbox, newLabel)

  }) 
}

function renderLanguageCheckboxes() {
  languageList.forEach(function(language, i) {

    var newCheckbox = document.createElement("input")
    var newLabel = document.createElement("label")

    var languageTitle = document.createTextNode(language); 

    newLabel.appendChild(newCheckbox);
    newLabel.appendChild(languageTitle);

    newCheckbox.checked = true;

    newCheckbox.type = "checkbox";
    newCheckbox.name = "language[]"
    newCheckbox.value = language

    filterLanguages.appendChild(newLabel)

    console.log(language, i, newCheckbox, newLabel)

  }) 
}

function nextArtist() {
	score += 1

  guessesThisRound.push(true)
  handleCurrentArtist();
}

function passArtist() {
  guessesThisRound.push(false)
  handleCurrentArtist();
}

function handleKeyDown(event) {

  if(gameState === states.PLAYING) {
    if (event.key === "ArrowRight") {
      nextButton.classList.add("active");
    }
    if (event.key === "ArrowLeft") {
      passButton.classList.add("active");
    }
  }
}

function handleKeyUp(event) {

  if(gameState === states.PLAYING) {
    // RIGHT
    if (event.code === "ArrowRight") {
      nextArtist();
      nextButton.classList.remove("active");
    }
      // LEFT
    if (event.code === "ArrowLeft") {
      passArtist()
      passButton.classList.remove("active");
    }  
  } else if(gameState === states.START_SCREEN){

    if(event.code === 'Space') {
      //newGame();
      startNewGame();
    }

  } else if(gameState === states.END_SCREEN) {
    if(event.code === 'Space') {
      //newGame();
      nextRound();
    }    
  }

}



function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}