//--------------------------------------------------------------
// Your web app's Firebase configuration
//--------------------------------------------------------------
let config = {
    apiKey: "AIzaSyCI3tPf61sTY3nLoHJG7P8TGBakZU69o3w",
    authDomain: "comp-1800-94b18.firebaseapp.com",
    databaseURL: "https://comp-1800-94b18.firebaseio.com",
    projectId: "comp-1800-94b18",
    storageBucket: "comp-1800-94b18.appspot.com",
    messagingSenderId: "254451731238",
    appId: "1:254451731238:web:ff1e74fe12719d02740fe7"
};

// Initialize Firebase
firebase.initializeApp(config);

//---------------------------------CONSTANTS-----------------------------------//
//1 second in milliseconds
const SECONDS = 1000;
//Number of question categories
const CATEGORIES = 4;
//Number of questions per easy category
const EASYSELECT = 4;
//Number of questions per hard category
const HARDSELECT = 8;

//------------------------------GLOBAL VARIABLES------------------------------//
//Difficulty level for game, 0: easy, 1: hard
let difficulty;
//3 second start countdown timer
let startTime = 3;
//Time for easy 30 second timer
let easyTime = 30;
//Time for hard 45 second timer
let hardTime = 45;
//Easy and Hard timers
let easyTimer;
let hardTimer;
//Start Timer
let startTimer;
//Start clock timer
let startClock = document.getElementById("startClock");
//Game clock timer
let gameClock = document.getElementById("clock");
//User's score
let score = 0;
//Previous highest score; set from server
let previousHigh;
//Question image
let question = document.getElementById("question");
//Current question category
let currCategory;

//Buttons
let trashButton = document.getElementById("trash");
let compostButton = document.getElementById("compost");
let plapapButton = document.getElementById("paper");
let ewasteButton = document.getElementById("ewaste");

//Score display
let scoreDisplay = document.getElementById("score");

//Game music
let music = document.getElementById("music");
music.loop = true;
music.volume = 0.075;
let overMusic = document.getElementById("overM");
overMusic.loop = true;
overMusic.volume = 0.075;


//----------------------------IMAGE SRC ARRAYS-------------------------------//
//Array for compost img src on easy difficulty, size 4
let easyCompostArr = ["../images/compost/fruits.png", "../images/compost/vegetables.png", "../images/compost/eggshell.png", "../images/compost/leaves.png"];
//Array for plastic and paper img src on easy difficulty, size 4
let easyPlaPapArr = ["../images/p&p/cerealBox.png", "../images/p&p/waterbottle.png", "../images/p&p/magazine.png", "../images/p&p/newspaper.webp"];
//Array for e-waste img src on easy difficulty, size 4
let easyEwasteArr = ["../images/e-waste/cellphone.png", "../images/e-waste/laptop.png", "../images/e-waste/controller.png", "../images/e-waste/headphone.webp"];
//Array for trash img src on easy difficulty, size 4
let easyTrashArr = ["../images/trash/chipbag.png", "../images/trash/straw.png", "../images/trash/candywrapper.png", "../images/trash/erasers.png"];
//Array for compost img src on easy difficulty, size 8
let hardCompostArr = ["../images/compost/fruits.png", "../images/compost/vegetables.png", "../images/compost/eggshell.png", "../images/compost/pizzbox.png",
    "../images/compost/bones.png", "../images/compost/leaves.png", "../images/compost/fishbone.png", "../images/compost/seeds.png"
];
//Array for plastic and paper img src on easy difficulty, size 8
let hardPlaPapArr = ["../images/p&p/cerealBox.png", "../images/p&p/waterbottle.png", "../images/p&p/magazine.png", "../images/p&p/newspaper.webp",
    "../images/p&p/cardboard.svg", "../images/p&p/milk.png", "../images/p&p/milkjug.png", "../images/p&p/envelope.png"
];
//Array for e-waste img src on easy difficulty, size 8
let hardEwasteArr = ["../images/e-waste/cellphone.png", "../images/e-waste/laptop.png", "../images/e-waste/controller.png", "../images/e-waste/headphone.webp",
    "../images/e-waste/tv.png", "../images/e-waste/microwave.png", "../images/e-waste/keyboard.png", "../images/e-waste/battery.png"
];
//Array for trash img src on easy difficulty, size 8
let hardTrashArr = ["../images/trash/chipbag.png", "../images/trash/straw.png", "../images/trash/candywrapper.png", "../images/trash/erasers.png",
    "../images/trash/gluestick.png", "../images/trash/mask.svg", "../images/trash/toiletpaper.png", "../images/trash/pencil.png"
];

//------------------------------TIMER FUNCTIONS--------------------------------------//
//Countdown function for easy timer
function easyCountdown() {
    gameClock.innerHTML = easyTime;
    if (easyTime == 0) {
        clearInterval(easyTimer);
        //Game over
        gameOver();
    } else {
        easyTime--;
    }
}

//Countdown function for hard timer
function hardCountdown() {
    gameClock.innerHTML = hardTime;
    if (hardTime == 0) {
        clearInterval(hardTimer);
        //Game over
        gameOver();
    } else {
        hardTime--;
    }
}

//Countdown for start game
function startCountdown() {
    startClock.innerHTML = startTime;
    if (startTime == 0) {
        //Show GO!
        startClock.innerHTML = "GO!";
        startTime--;
    } else if (startTime < 0) {
        clearInterval(startTimer);
        //Hide start coundown and show gameplay UI
        startGame();
    } else {
        startTime--;
    }
}


//--------------------------ONCLICK FUNCTIONS-------------------------------//

//Onclick function for the four answer buttons
function answerSelect() {
    //If selected correct category increment score, else decrement
    if (this.id == currCategory) {
        score++;
        //Update score display
        scoreDisplay.innerHTML = "Score" + "</br>" + score;
    } else {
        score--;
        //Update score display
        scoreDisplay.innerHTML = "Score" + "</br>" + score;
    }
    //Change question
    setRandomQuestion();
}

//Onclick function to quit game and return to homepage
function quitGame() {
    location.replace("homePage.html");
}

trashButton.onclick = answerSelect;
compostButton.onclick = answerSelect;
plapapButton.onclick = answerSelect;
ewasteButton.onclick = answerSelect;

//-------------------------------GAMEPLAY FUNCTIONS---------------------------------//

//Generate random number between 1 and 4 to determine the category of question
//1. Compost, 2. Plastic & Paper, 3. E-waste, 4. Trash
function randomCategory() {
    return Math.ceil(Math.random() * CATEGORIES);
}

//Get a random img for the question from the array of img src
function getRandomQuestion(arr) {
    let index = Math.floor(Math.random() * arr.length);
    console.log(arr[index]);
    return arr[index];
}

//Sets question image to random question
function setRandomQuestion() {
    //1. Compost, 2. Plastic & Paper, 3. E-waste, 4. Trash
    switch (randomCategory()) {
        //Compost
        case 1:
            //set current category
            currCategory = "compost";
            //Easy
            if (difficulty == 0) {
                question.src = getRandomQuestion(easyCompostArr);
                //Hard
            } else {
                question.src = getRandomQuestion(hardCompostArr);
            }
            break;
            //Plastic & Paper
        case 2:
            //set current category
            currCategory = "paper";
            //Easy
            if (difficulty == 0) {
                question.src = getRandomQuestion(easyPlaPapArr);
                //Hard
            } else {
                question.src = getRandomQuestion(hardPlaPapArr);
            }
            break;
            //E-waste
        case 3:
            //set current category
            currCategory = "ewaste";
            //Easy
            if (difficulty == 0) {
                question.src = getRandomQuestion(easyEwasteArr);
                //Hard
            } else {
                question.src = getRandomQuestion(hardEwasteArr);
            }
            break;
            //Trash
        case 4:
            //set current category
            currCategory = "trash";
            //Easy
            if (difficulty == 0) {
                question.src = getRandomQuestion(easyTrashArr);
                //Hard
            } else {
                question.src = getRandomQuestion(hardTrashArr);
            }
            break;
    }
}

//Start game
function startGame() {
    //Dipslay game UI
    showGame();
    //Start easy timer
    if (difficulty == 0) {
        easyTimer = setInterval(easyCountdown, SECONDS);
        //Start hard timer        
    } else {
        hardTimer = setInterval(hardCountdown, SECONDS);
    }
    setRandomQuestion();
}

//Hide start clock and show game UI
function showGame() {
    //Hide start clock
    startClock.style.display = "none";
    //Show game UI
    let gameUI = document.getElementsByClassName("gameplay");
    for (let i = 0; i < gameUI.length; i++) {
        gameUI[i].style.display = "block";
    }
}

//When game over
function gameOver() {
    //Hide gameUI
    let gameUI = document.getElementsByClassName("gameplay");
    for (let i = 0; i < gameUI.length; i++) {
        gameUI[i].style.display = "none";
    }
    addScore();
}

//-------------------------------END GAME FUNCTIONS-----------------------------//
//Show end game stats
function endStats() {
    music.pause();
    overMusic.play();
    let endGameUI = document.getElementsByClassName("end");
    for (let i = 0; i < endGameUI.length; i++) {
        endGameUI[i].style.display = "block";
    }
    let endDisplay = document.getElementById("endScore");
    //Easy mode display
    if (difficulty == 0) {
        if (previousHigh < score) {
            endDisplay.innerHTML = "Congratulations! New high score!" + "</br>" +
                "</br>" + "Easy Difficulty" + "</br>" + "</br>" + "Your score: " + score +
                "</br>" + "</br>" + "Your previous high score: " + previousHigh;
        } else {
            //Show score
            endDisplay.innerHTML = "Easy Difficulty" + "</br>" + "</br>" + "Your score: " + score +
                "</br>" + "</br>" + "Your previous high score: " + previousHigh;
        }
        //Hard mode display
    } else {
        if (previousHigh < score) {
            endDisplay.innerHTML = "Congratulations! New high score!" + "</br>" +
                "</br>" + "Hard Difficulty" + "</br>" + "</br>" + "Your score: " + score +
                "</br>" + "</br>" + "Your previous high score: " + previousHigh;
        } else {
            //Show score
            endDisplay.innerHTML = "Hard Difficulty" + "</br>" + "</br>" + "Your score: " + score +
                "</br>" + "</br>" + "Your previous high score: " + previousHigh;
        }
    }
}

//Return to homescreen
function returnHome() {
    location.replace("homePage.html");
}

// Add the users score to the Easy_Leaderboard collection.
function addScore() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {

            // Get the currently signed in users UID
            let id = user.uid;

            // Create reference for database.
            let db = firebase.firestore();

            // Create reference for Users collection.
            let ref = db.collection('Users');

            // Get user data.
            ref.doc(id).get().then(function (doc) {

                // Create a time stamp for the game.
                let timestamp = new Date().getTime();

                // Create reference for Easy-Leaderboard collection
                if (difficulty == 0) {

                    //set previous high score to display on end game
                    //If new user previous high set to 0
                    if (doc.data().ScoresEasy == undefined){
                        previousHigh = 0;
                    } else{
                        previousHigh = doc.data().ScoresEasy;
                    }
                    
                    // Check if the game score is greater than the users current highscore.
                    let highScore = maxScore(score, previousHigh); 

                    // Update users last time played and score in easy difficulty.
                    ref.doc(id).update({
                        'LastTimePlayed': timestamp,
                        'ScoresEasy': highScore
                    }).then(function () {

                        //Show end game stats
                        endStats();
                    }).catch(function (error) {
                        console.error('Error creating game: ', error);
                    });
                } else {

                    //set previous high score to display on end game
                    //If new user previous high set to current score
                    if(doc.data().ScoresHard == undefined){
                        previousHigh = 0;
                    } else {
                        previousHigh = doc.data().ScoresHard;
                    }
                    

                    // Check if the game score is greater than the users current highscore.
                    let highScore = maxScore(score, previousHigh)

                    // Update users last time played and score in hard difficulty.
                    ref.doc(id).update({
                        'LastTimePlayed': timestamp,
                        'ScoresHard': highScore,
                    }).then(function () {
                        //Show endgame stats
                        endStats();
                    }).catch(function (error) {
                        console.error('Error creating game: ', error);
                    });
                }
            })
        } else {
            // If no user is signed in.
            console.log('no user');
        }
    });
}

//Returns higher score
function maxScore(score1, score2){
    let max = score2;
    if (score1 > score2){
        max = score1;
    }
    return max;
}

//-------------------GAME DIFFICULTY SELECTION------------------------//

// Takes user to 'hard' version of the game.
function hardMode() {
    document.getElementById("myNav").style.height = "0%";
    startTimer = setInterval(startCountdown, SECONDS);
    difficulty = 1;
    music.play();
}

// Takes user to 'easy' version of the game.
function easyMode() {
    document.getElementById("myNav").style.height = "0%";
    startTimer = setInterval(startCountdown, SECONDS);
    difficulty = 0;
    music.play();
}

// Sends user to the leaderboard page.
function getHome() {
    location.replace('homePage.html');
}