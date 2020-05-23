
function createObjects() {
  button1 = new Button(690, 545, 100, 43, 'Roll');
  button2 = new Button(580, 545, 100, 43, 'Pass');
  button3 = new Button(340, 380, 125, 43, "Join Game");
  button4 = new Button(338, 340, 130, 43, "New Game");

  pig1 = new Pig(600, 100, 1);
  pig2 = new Pig(700, 100, 2);

  userInput = createInput('');
  userInput.position(-300, 0);
}

function startMenu() {
  // border
  fill(0);
  rect(190, 140, 420, 320);
  fill(163, 228, 215);
  rect(200, 150, 400, 300);

  // title
  fill(0);
  textSize(40);
  textAlign(CENTER);
  text("Pass the Pigs", 400, 200);
  textAlign(LEFT);

  // table with pigs images
  image(table, 250, 190, 300, 200);
  image(pigs[3], 305, 210, 150, 150);
  image(pigs[1], 350, 215, 150, 150);

  // join game button
  button3.show();
}

// text shown on screen
function gameScreen() {
  // UI elements
  image(table, 0, 0, 800, 600);
  fill(0);

  // whose turn it is
  textSize(25);
  if (playerNum == currentPlayer + 1) {
    text('Your turn', 678, 520);
  } else {
    text(players[currentPlayer].name + "'s turn", 590, 565);
  }

  // current player score, bottom left
  textSize(25);
  text(players[currentPlayer].name + ':', 25, 515);
  textSize(22);
  text('Round score: ' + players[currentPlayer].roundScore, 25, 550);
  text('Total score: ' + players[currentPlayer].totalScore, 25, 575);

  // each players total score
  textSize(18);
  for (let i = 0; i < players.length; i++) {
    fill(84, 153, 199, 70);
    rect(4 + 140 * i, 78, 105, 54, 4);
    fill(0);
    text(players[i].name, 10 + 140 * i, 98);
    text('Score: ' + players[i].totalScore, 10 + 140 * i, 122);
  }

  // title with image
  textSize(30);
  text('Pass the Pigs', 300, 30);
  image(pigs[3], 460, -35, 150, 150);
  image(pigs[3], 425, -45, 150, 150);

  // top right name
  textSize(23);
  textAlign(RIGHT);
  text(players[playerNum - 1].name, 780, 30);
  textAlign(LEFT);

  // text box for user input

  if (!nameEntered) {
    // input box
    fill(0);
    rect(275, 200, 250, 120, 4);
    fill(72, 201, 176);
    rect(280, 205, 240, 110, 4);
    userInput.position(497,372);
    userInput.size(200, 25);
    userInput.style('font-size', '18px');

    fill(0);
    textAlign(CENTER);
    text('Enter your name', 400, 240);
    textSize(15);
    text('(Press enter to save)', 400, 260);
    textAlign(LEFT);
  } else {
    userInput.position(-300, 0);
  }

}

function endScreen() {
  // border
  fill(0);
  rect(190, 140, 420, 320);
  fill(170, 210, 200);
  rect(200, 150, 400, 300);

  fill(0);
  textSize(45);
  textAlign(CENTER);
  text('Player ' + (winner + 1) + ' wins!', 400, 300);
  textAlign(LEFT);

  button4.show();
}

function rollPigs() {
  pig1.roll();
  pig2.roll();
  firstRoll = true;
}
function showPigs() {
  pig1.show();
  pig2.show();
}
function movePigs() {
  pig1.move();
  pig2.move();
}
function resetPigs() {
  rollPigs();
  pig1.reset();
  pig2.reset();
  pig2.x += 100;
  moving = true;
}

function pigLanding() {
  textAlign(CENTER);
  textSize(30);
  text(output, 400, 450);
  textAlign(LEFT);
}

// add score/determine outcome after pigs stop moving, only runs once each roll
function changeScore() {
  if (pig1.stopped && pig2.stopped) {
    let num = calcScore(pig1.land, pig2.land);
    if (num == -1) {
      players[currentPlayer].roundScore = 0;
      changePlayer();
    } else {
      players[currentPlayer].roundScore += num;
    }
  }
  pig1.stopped = false;
  pig2.stopped = false;
}

// cycle through players
function changePlayer() {
  if (currentPlayer == players.length - 1) {
    currentPlayer = 0;
  } else {
    currentPlayer++;
  }
}

function dimButton(b) {
  if (b.underMouse(mouseX, mouseY)) {
    b.changeBlue(200);
  } else {
    b.changeBlue(255);
  }
}

// calculate roll score based on each pigs landing
function calcScore(p1, p2) {
  output = "";
  let sc = 0;
  if ((p1 == 0 && p2 == 1) || (p1 == 1 && p2 == 0)) {
    sc = -1;
    output = "Pig Out!";
  } else if (p1 == p2) {
    if (p1 == 0) {
      sc += 0;
      output = "It's a sign";
    } else if (p1 == 1) {
      sc += 1;
      output = "Sider";
    } else if (p1 == 2) {
      sc += 20;
      output = "Double Razorback";
    } else if (p1 == 3) {
      sc += 20;
      output = "Double Trotter";
    } else if (p1 == 4) {
      sc += 40;
      output = "Double Snouter";
    } else if (p1 == 5) {
      sc += 60;
      output = "Double Leaning Jowler";
    }
  } else {
    if (p1 == 2) {
      sc += 5;
      output += "Razorback";
    } else if (p1 == 3) {
      sc += 5;
      output += "Trotter";
    } else if (p1 == 4) {
      sc += 10;
      output += "Snouter";
    } else if (p1 == 5) {
      sc += 15;
      output += "Leaning Jowler";
    }
    if (p2 == 2) {
      sc += 5;
      if (output != "") output += " + ";
      output += "Razorback";
    } else if (p2 == 3) {
      sc += 5;
      if (output != "") output += " + ";
      output += "Trotter";
    } else if (p2 == 4) {
      sc += 10;
      if (output != "") output += " + ";
      output += "Snouter";
    } else if (p2 == 5) {
      sc += 15;
      if (output != "") output += " + ";
      output += "Leaning Jowler";
    }
  }
  return sc;
}
