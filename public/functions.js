
function createObjects() {
  button1 = new Button(690, 545, 100, 43, 'Roll');
  button2 = new Button(580, 545, 100, 43, 'Pass');
  button3 = new Button(337, 380, 130, 43, 'Start Game');
  button4 = new Button(338, 340, 130, 43, 'New Game');
  button5 = new Button(630, 240, 135, 43, 'Join Lobby');
  button6 = new Button(5, 5, 25, 25, '');
  button7 = new Button(10, 40, 170, 43, 'Leave Game');

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

  // start game button
  button3.show();
}

function lobbyMenu() {

  // title with image, top
  fill(255);
  textSize(30);
  textAlign(LEFT);
  text('Pass the Pigs', 280, 30);
  image(pigs[3], 436, -40, 150, 150);
  image(pigs[3], 401, -47, 150, 150);

  // name, top right
  textSize(23);
  textAlign(RIGHT);
  text(tempName, 785, 25);
  textAlign(LEFT);

  // text box for user input
  fill(84, 153, 199, 70);
  rect(20, 50, 760, 80, 10);
  userInput.position(380, 155);
  userInput.size(250, 25);
  userInput.style('font-size', '18px');
  fill(255);
  textSize(25);
  text('Enter name:', 30, 80);
  textSize(15);
  text('(Press enter to save)', 445, 77);

  // Current lobby
  fill(84, 153, 199, 70);
  rect(20, 150, 760, 150, 10);
  textSize(25);
  fill(255);
  text('Current lobby:', 30, 180);

  if (allNames.length == 1) {
    text(allNames.length + ' player', 660, 180);
  } else {
    text(allNames.length + ' players', 660, 180);
  }

  textSize(18);
  let x, y;
  for (let i = 0; i < allNames.length; i++) {
    if (i < 4) {
      x = 50;
      y = 210 + 20 * i;
    } else {
      x = 280;
      y = 210 + 20 * (i - 4);
    }
    text(allNames[i], x, y);
  }

  // Rules
  fill(84, 153, 199, 70);
  rect(20, 320, 760, 260, 10);
  fill(255);
  textSize(25);
  text('Rules:', 30, 350);
  textSize(20);
  text("lmao you don't know the rules?", 50, 390);

  if (connectWait) {
    fill(0);
    rect(330,275,140,50,5);
    fill(23, 32, 42);
    rect(335,280,130,40,5);
    fill(255);
    textSize(18);
    text('Connecting...', 345, 305);
  } else {
    // join button
    if (allNames.length >= 8) {
      textSize(20);
      text('Lobby is full', 650, 280);
    } else {
      button5.show();
    }
  }

}

// text shown on screen
function gameScreen() {
  // table
  image(table, 0, 20, 800, 600);
  userInput.position(-300,0);

  if (isDarkMode) fill(255);
  else fill(0);
  textAlign(LEFT);

  // whose turn it is, bottom right
  textSize(25);
  if (playerNum == currentPlayer + 1) {
    text('Your turn', 678, 520);
  } else {
    textAlign(RIGHT);
    text(players[currentPlayer].name + "'s turn", 770, 565);
    textAlign(LEFT);
  }

  // current player score, bottom left
  textSize(25);
  text(players[currentPlayer].name + ':', 25, 515);
  textSize(22);
  text('Round score: ' + players[currentPlayer].roundScore, 25, 550);
  if (players[currentPlayer].roundScore == 0) {
    text('Total score: ' + players[currentPlayer].totalScore, 25, 575);
  } else {
    text('Total score: ' + players[currentPlayer].totalScore + ' (' +
      (players[currentPlayer].totalScore + players[currentPlayer].roundScore) +')', 25, 575);
  }


  // each players total score, above table
  textSize(17);
  textAlign(LEFT);

  let h, x;
  for (let i = 0; i < players.length; i++) {
    if (i < 4) {
      h = 38;
      x = i;
    } else {
      h = 100;
      x = i - 4;
    }
    fill(84, 153, 199, 70);
    rect(15 + 195 * x, h, 185, 54, 4);
    if (isDarkMode) fill(255);
    else fill(0);
    text(players[i].name, 21 + 195 * x, h + 20);
    text('Score: ' + players[i].totalScore, 21 + 195 * x, h + 44);

  }
  // quick chat
  for (let i = 0; i < players.length; i++) {
    if (players[i].showQuickChat) {
      quickChat(players[i].keyInput, i + 1);
    }
  }

  if (isDarkMode) fill(255);
  else fill(0);


  // title with image, top
  textSize(30);
  textAlign(LEFT);
  text('Pass the Pigs', 280, 30);
  image(pigs[3], 436, -40, 150, 150);
  image(pigs[3], 401, -47, 150, 150);

  // name, top right
  textSize(23);
  textAlign(RIGHT);
  text(players[playerNum - 1].name, 785, 25);
  textAlign(LEFT);

  // if it's last turn
  if (lastTurn >= 1) {
    textSize(22);
    textAlign(CENTER);
    text('Last turn!', 400, 570);
    textAlign(LEFT);
  }

  // side menu
  button6.show();
  if (isMenuOpen) {
    if (isDarkMode) fill(0);
    else fill(255);
    rect(5, 35, 180, 290, 10);

    button7.show();

    textSize(18);
    if (isDarkMode) fill(255);
    else fill(0);
    text('D: toggle dark mode', 15, 130);
    text('P: play/pause music', 15, 155);
    text('Quick Chat:', 15, 200);
    text('1 - Wow!', 15, 225);
    text('2 - What a roll!', 15, 250);
    text('3 - Next time bud', 15, 275);
    text('4 - Shit.', 15, 300);
  }

}

function endScreen() {
  // border
  fill(0);
  rect(140, 140, 520, 320);
  fill(170, 210, 200);
  rect(150, 150, 500, 300);

  fill(0);
  textSize(40);
  textAlign(CENTER);
  text(players[winner].name + ' wins!', 400, 300);
  textAlign(LEFT);

  button4.show();
}

// print pig landing name
function pigLanding() {
  if (isDarkMode) fill(255);
  else fill(0);
  textAlign(CENTER);
  textSize(30);
  text(output, 400, 470);
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
  if (lastTurn >= 1) {
    if (lastTurn == players.length - 1) {
      winner = 0;
      for (let i = 1; i < players.length; i++) {
        if (players[i].totalScore > players[winner].totalScore) {
          winner = i;
        }
      }
      mode = 3;
      socket.emit('changeMode', mode);
      music.stop();
    } else {
      lastTurn++;
    }

  }
}

function joinLobby() {
  if (millis() - connectTime > 500) {
    if (playerNum != 1) {
      for (i = 0; i < playerNum - 1; i++) {
        let p = new Player();
        players.push(p);
        socket.emit('getNames', 1);
      }
    }
    if (tempName == '') {
      tempName = random(randomNames) + ' Mc' + random(randomNames);
    }

    socket.emit('join', tempName);
    mode = 2;
    socket.emit('changeMode', mode);
    connectWait = false;
  }

}

function checkWin() {
  for (let i = 0; i < players.length; i++) {
    if (players[i].totalScore >= targetScore) {
      if (lastTurn == 0) {
        lastTurn = 1;
      }
    }
  }
}

function rollPigs() {
  pig1.roll();
  pig2.roll();
  isFirstRoll = true;
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
  isMoving = true;
}

// dim button when mouse is over
function dimButton(b) {
  if (b.underMouse(mouseX, mouseY)) {
    b.changeBlue(200);
  } else {
    b.changeBlue(255);
  }
}

function quickChat(key, num) {
  let t, w;
  if (key == 1) {
    t = "Wow!";
    w = 65;
  } else if (key == 2) {
    t = "What a roll!";
    w = 110;
  } else if (key == 3) {
    t = "Next time bud";
    w = 128;
  } else if (key == 4) {
    t = "Shit.";
    w = 55;
  }
  let x, y;
  if (num <= 4) {
    x = 100 + 195 * (num - 1);
    y = 65;
  } else {
    x = 100 + 195 * (num - 5);
    y = 127;
  }
  fill(255);
  rect(x - 10, y + 5, w, 30, 15);
  triangle(x, y - 10, x - 3, y + 10, x + 20, y + 10);
  fill(0);
  text(t, x, y + 25);

  if ((millis() - players[num - 1].quickChatTime) > 2000) {
    players[num - 1].showQuickChat = false;
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
