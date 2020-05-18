
// server stuff
let socket;

// constants
let width = 800;
let height = 600;
let numPlayers = 4;

// objects
let button1, button2, button3, button4;
let pigs = [];
let players = [];

// global variables
let currentPlayer = 0, playerNum = 1;
let output = "";
let firstRoll = false, moving = false;
let mode;
let winner;

// images
function preload() {
  for (let i = 0; i < 6; i++) {
    pigs[i] = loadImage('pigs/pig' + i + '.png');
  }
  table = loadImage('table.png');
}

function setup() {
  createCanvas(width,height);

  // creating objects
  button1 = new Button(width - 110,height - 55, 100, 43, 'Roll');
  button2 = new Button(width - 220,height - 55, 100, 43, 'Pass');
  button3 = new Button(338, 360, 130, 43, "Start Game");
  button4 = new Button(338, 340, 130, 43, "New Game");

  pig1 = new Pig(600, 100, 1);
  pig2 = new Pig(700, 100, 2);

  for (let i = 0; i < numPlayers; i++) {
    players[i] = new Player();
  }

  // set font
  textFont('Georgia');

  // set game mode
  mode = 0;

  // server stuff
  socket = io.connect('http://localhost:3000');
  socket.on('mouse', newMouseClicked);
  socket.on('rand', newRandNums);
  socket.on('player', newPlayerNum);

  socket.emit('player', 1);

}

function draw() {
  background(210, 235, 220);

  if (mode == 0) {
    // border
    fill(0);
    rect(width / 4 - 10,height / 4 - 10, width / 2 + 20, height / 2 + 20);
    fill(170, 210, 200);
    rect(width / 4,height / 4, width / 2, height / 2);

    image(table, 250, 200, 300, 200);
    image(pigs[3], 305, 220, 150, 150);
    image(pigs[1], 350, 225, 150, 150);

    fill(0);
    textSize(40);
    textAlign(CENTER);
    text("Pass the Pigs", width / 2, 200);
    textAlign(LEFT);

    button3.show();

  } else if (mode == 1) {
    // UI elements
    image(table, 0, 0, width, height);
    button1.show();
    button2.show();
    fill(0);
    showText();

    // if first pigs have been rolled
    if (firstRoll) {
      pig1.show();
      pig2.show();

      // if pigs are moving or not
      if (moving) {
        pig1.move();
        pig2.move();
      } else {
        changeScore();

        // print pig landings
        textAlign(CENTER);
        textSize(30);
        text(output, width / 2, 450);
        textAlign(LEFT);
      }

      // check if anyone has won
      for (let i = 0; i < numPlayers; i++) {
        if (players[i].totalScore >= 100) {
          mode = 2;
          winner = i;

        }
      }
    }
  } else if (mode == 2) {
    // end game screen

    fill(0);
    rect(width / 4 - 10,height / 4 - 10, width / 2 + 20, height / 2 + 20);
    fill(170, 210, 200);
    rect(width / 4,height / 4, width / 2, height / 2);

    fill(0);
    textSize(45);
    textAlign(CENTER);
    text('Player ' + (winner + 1) + ' wins!', width / 2, 300);
    textAlign(LEFT);

    button4.show();

  }

}

// Controls roll/pass, buttons don't work if pigs are moving
function mouseClicked() {
  fill(255);
  ellipse(mouseX, mouseY, 40, 40);
  if (mode == 0) {
    // Start game button
    if (button3.underMouse(mouseX, mouseY)) {
      mode = 1;

    }
  } else if (mode == 1) {
    // Roll button
    if (button1.underMouse(mouseX, mouseY)) {

      if (!moving) {
        socket.emit('rand', [1,1]);

        // randomize pigs and move them back
        rollPigs();
        pig1.reset();
        pig2.reset();
        pig2.x += 100;
        moving = true;
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

    // server stuff
    console.log('Sending: ' + mouseX + ', ' + mouseY);
    let data = {
      x: mouseX,
      y: mouseY
    }
    socket.emit('mouse', data);


  } else if (mode == 2) {
    // New Game button
    if (button4.underMouse(mouseX, mouseY)) {
      mode = 1;
      for (let i = 0; i < numPlayers; i++) {
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
    // Start Game button
    if (button3.underMouse(mouseX, mouseY)) {
      button3.changeBlue(200);
    } else {
      button3.changeBlue(255);
    }
  } else if (mode == 1) {
    // Roll button
    if (button1.underMouse(mouseX, mouseY)) {
      button1.changeBlue(200);
    } else {
      button1.changeBlue(255);
    }

    // Pass button
    if (button2.underMouse(mouseX, mouseY)) {
      button2.changeBlue(200);
    } else {
      button2.changeBlue(255);
    }
  } else if (mode == 2) {
    // New Game button
    if (button4.underMouse(mouseX, mouseY)) {
      button4.changeBlue(200);
    } else {
      button4.changeBlue(255);
    }
  }

}

function newRandNums(nums) {
  for (let i = 0; i < 4; i++) {
    pig1.nums[i] = nums.pop();
  }
  for (let i = 0; i < 4; i++) {
    pig2.nums[i] = nums.pop();
  }

}


function newMouseClicked(data) {
  fill(100);
  ellipse(data.x, data.y, 40, 40);
    // Roll button
    if (button1.underMouse(data.x, data.y)) {

      if (!moving) {
        // randomize pigs and move them back
        rollPigs();
        pig1.reset();
        pig2.reset();
        pig2.x += 100;
        moving = true;
      }
    }

    // Pass button
    if (button2.underMouse(data.x, data.y)) {

      if (!moving) {
        // add score to total, change player
        players[currentPlayer].totalScore += players[currentPlayer].roundScore;
        players[currentPlayer].roundScore = 0;
        changePlayer();
      }
    }

    // server stuff
}

function newPlayerNum(num) {
  playerNum = num;
}
