
// constants
let width = 800;
let height = 600;
let numPlayers = 4;
let currentPlayer = 0;

// objects
let button1;
let button2;
let pigs = [];
let players = [];

// global variables
let output = "";
let showPigs = false, moving = false;

// images
function preload() {
  for (let i = 0; i < 6; i++) {
    pigs[i] = loadImage('pigs/pig' + i + '.png');
  }
  bg = loadImage('table.png');
}

function setup() {
  createCanvas(width,height);

  // creating objects
  button1 = new Button(width - 110,height - 55, 'Roll');
  button2 = new Button(width - 220,height - 55, 'Pass');

  pig1 = new Pig(600, 100);
  pig2 = new Pig(700, 100);

  for (let i = 0; i < numPlayers; i++) {
    players[i] = new Player();
  }

  // set font
  textFont('Georgia');
}

function draw() {
  background(210, 235, 220);

  // UI elements
  image(bg, 0, 0, width, height);
  button1.show();
  button2.show();
  fill(0);
  showText();

  // if first pigs have been rolled
  if (showPigs) {
    pig1.show();
    pig2.show();

    // if pigs are moving
    if (moving) {
      pig1.move();
      pig2.move();
    } else {
      changeScore();

      // print pig landings
      textSize(30);
      text(output, 320, 450);
    }

    // check if anyone has won
    for (let i = 0; i < numPlayers; i++) {
      if (players[i].totalScore >= 100) {

        // end game screen
        textsize(45);
        text('Player ' + (i + 1) + ' wins!', 300, 350);
        noLoop();
        // **change mode?**
      }
    }
  }


}

// Controls roll/pass, buttons don't work if pigs are moving
function mouseClicked() {
  // Roll button
  if (button1.underMouse(mouseX, mouseY)) {

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
  if (button2.underMouse(mouseX, mouseY)) {

    if (!moving) {
      // add score to total, change player
      players[currentPlayer].totalScore += players[currentPlayer].roundScore;
      players[currentPlayer].roundScore = 0;
      changePlayer();
    }
  }
}

// dims button if mouse is over it
function mouseMoved() {
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
}
