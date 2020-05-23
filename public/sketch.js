
// server stuff
let socket;

// constants
let width = 800;
let height = 600;

// objects
let button1, button2, button3, button4;
let pigs = [];
let players = [];

// global variables
let currentPlayer = 0, playerNum = 0;
let output = "";
let firstRoll = false, moving = false, nameEntered = false;
let mode;
let winner;
let userInput;

// images
function preload() {
  for (let i = 0; i < 6; i++) {
    pigs[i] = loadImage('pigs/pig' + i + '.png');
  }
  table = loadImage('table.png');
}

function setup() {
  canvas = createCanvas(width,height);
  canvas.position(200, 100);

  // creating objects
  createObjects();

  // set font
  textFont('Georgia');

  // set game mode
  mode = 0;

  // create socket
  socket = io();
  // socket = io.connect('http://localhost:3000');
  // socket = io.connect('https://daniel-glynn1-passthepigs.glitch.me/');


  serverListening();

  // send new player to server
  socket.emit('player', 1);
}

function draw() {
  background(209, 242, 235);
  fill(255);

  if (mode == 0) {
    startMenu();

  } else if (mode == 1) {
    if (playerNum == currentPlayer + 1) {
      button1.show();
      button2.show();
    }

    // UI elements
    gameScreen();

    // if first pigs have been rolled
    if (firstRoll) {
      showPigs();

      // if pigs are moving or not
      if (moving) {
        movePigs();
      } else {
        changeScore();

        // print pig landing name
        pigLanding();
      }

      // check if anyone has won
      for (let i = 0; i < players.length; i++) {
        if (players[i].totalScore >= 100) {
          mode = 2;
          winner = i;
        }
      }
    }
  } else if (mode == 2) {
    // end game screen
    endScreen();
  }
}

// Controls roll/pass, buttons don't work if pigs are moving
function mouseClicked() {
  if (mode == 0) {
    // Start game button
    if (button3.underMouse(mouseX, mouseY)) {
      mode = 1;
      socket.emit('join', 1);
      if (playerNum != 1) {
        for (i = 0; i < playerNum - 1; i++) {
          let p = new Player();
          players.push(p);
          socket.emit('getNames', 1);
        }
      }
    }
  } else if (mode == 1 && playerNum == currentPlayer + 1) {
    // Roll button
    if (button1.underMouse(mouseX, mouseY)) {
      if (!moving) {
        socket.emit('rand', [1,1]);

        // randomize pigs and move them back
        resetPigs();
      }
    }

    // Pass button
    if (button2.underMouse(mouseX, mouseY)) {

      if (!moving) {
        // add score to total, change player
        players[currentPlayer].totalScore += players[currentPlayer].roundScore;
        players[currentPlayer].roundScore = 0;
        changePlayer();
      }
    }

    // send mouse data
    let data = {
      x: mouseX,
      y: mouseY
    }
    socket.emit('mouse', data);


  } else if (mode == 2) {
    // New Game button
    if (button4.underMouse(mouseX, mouseY)) {
      mode = 1;
      for (let i = 0; i < players.length; i++) {
        players[i].reset();
        firstRoll = false;
        currentPlayer = 0;
      }
    }
  }
}

// dims button if mouse is over it
function mouseMoved() {
  if (mode == 0) {
    // Join Game button
    dimButton(button3);
  } else if (mode == 1) {
    // Roll button
    dimButton(button1);
    // Pass button
    dimButton(button2);
  } else if (mode == 2) {
    // New Game button
    dimButton(button4);
  }
}

function keyPressed() {
  if (keyCode == ENTER) {
    if (!nameEntered) {
      players[playerNum - 1].name = userInput.value();
      nameEntered = true;
      socket.emit('name', userInput.value());
    }
  }
}
