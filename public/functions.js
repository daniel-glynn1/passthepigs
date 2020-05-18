
// text shown on screen
function showText() {

  // current player info
  textSize(25);
  text('Player ' + (currentPlayer + 1) + "'s turn", 580, height - 80);
  textSize(22);
  text('Player ' + (currentPlayer + 1) + ':', 25, height - 85);
  text('Round score: ' + players[currentPlayer].roundScore, 25, height - 50);
  text('Total score: ' + players[currentPlayer].totalScore, 25, height - 25);

  // each players total score
  textSize(18);
  for (let i = 0; i < numPlayers; i++) {
    text('Player ' + (i + 1), 10 + 120 * i, 100);
    text('Score: ' + players[i].totalScore, 10 + 120 * i, 120);
  }

  // title with image
  textSize(30);
  text('Pass the Pigs', 300, 30);
  image(pigs[3], 460, -35, 150, 150);
  image(pigs[3], 425, -45, 150, 150);

  textSize(20);
  text('You are player #' + playerNum, width - 200, 20);
}

// randomize pig images
function rollPigs() {
  pig1.roll();
  pig2.roll();

  firstRoll = true;
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
  if (currentPlayer == numPlayers - 1) {
    currentPlayer = 0;
  } else {
    currentPlayer++;
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
