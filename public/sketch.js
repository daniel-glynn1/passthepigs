
// load images
function preload() {
  for (let i = 0; i < 6; i++) {
    pigs[i] = loadImage('assets/pig' + i + '.png');
  }
  table = loadImage('assets/table.png');
  font = loadFont('assets/Georgia.ttf');
  music = loadSound('assets/song.mp3');
}

function setup() {
  canvas = createCanvas(width,height);
  canvas.position(200, 100);

  createObjects();
  randomNames = ['Pig', 'Pass', 'The', 'Jowler', 'Passin', 'Luv', 'Finn', 'Dylan', 'Jasper', 'Dan'];

  textFont(font);
  music.setLoop(true);
  music.setVolume(0.05);

  // game mode
  mode = 0;

  // create socket/connection to server
  socket = io();
  serverListening();


}

function draw() {
  if (isDarkMode || mode == 1) background(23, 32, 42);
  else background(209, 242, 235);

  if (mode == 0) {
    startMenu();

  } else if (mode == 1) {

    lobbyMenu();

    if (connectWait) {
      joinLobby();
    }

  } else if (mode == 2) {
    if (playerNum == currentPlayer + 1) {
      button1.show();
      button2.show();
    }
    // UI
    gameScreen();

    // if first pigs have been rolled
    if (isFirstRoll) {
      showPigs();

      // if pigs are moving or not
      if (isMoving) {
        movePigs();
      } else {
        changeScore();

        // print pig landing name
        pigLanding();
      }

      // check if anyone has won
      checkWin();
    }
  } else if (mode == 3) {
    endScreen();
  }
}

function mouseClicked() {
  if (mode == 0) {
    // Start game button
    if (button3.underMouse(mouseX, mouseY)) {
      mode = 1;
      socket.emit('changeMode', mode);
      socket.emit('checkLobby', 1);

    }
  } else if (mode == 1 && !connectWait && allNames.length < 8) {
    if (button5.underMouse(mouseX, mouseY)) {

      // get playerNum from server
      socket.emit('player', 1);

      connectTime = millis();
      connectWait = true;
    }
  } else if (mode == 2) {
    if (playerNum == currentPlayer + 1) {
      // Roll button
      if (button1.underMouse(mouseX, mouseY)) {
        if (!isMoving) {
          socket.emit('rand', [1,1]);

          // randomize pigs and move them back
          resetPigs();
        }
      }

      // Pass button
      if (button2.underMouse(mouseX, mouseY)) {

        if (!isMoving) {
          // add score to total, change player
          players[currentPlayer].totalScore += players[currentPlayer].roundScore;
          players[currentPlayer].roundScore = 0;

          pig1.x = 1000;
          pig2.x = 1000;
          output = "";
          changePlayer();
        }
      }

      // send mouse data
      let data = {x: mouseX, y: mouseY}
      socket.emit('mouse', data);
    }
    // menu button
    if (button6.underMouse(mouseX, mouseY)) {
      if (isMenuOpen) {
        isMenuOpen = false;
      } else {
        isMenuOpen = true;
      }
    }
    // leave button
    if (isMenuOpen) {
      if (button7.underMouse(mouseX, mouseY)) {
        socket.emit('leave', 1);
        mode = 1;
        socket.emit('changeMode', mode);
        isMenuOpen = false;
        players = [];
        playerNum = 0;
        currentPlayer = 0;
        socket.emit('checkLobby', 1);
      }
    }

  } else if (mode == 3) {
    // New Game button
    if (button4.underMouse(mouseX, mouseY)) {
      mode = 2;
      socket.emit('changeMode', mode);
      isFirstRoll = false;
      isMenuOpen = false;
      currentPlayer = 0;
      lastTurn = 0;
      music.pause();
      for (let i = 0; i < players.length; i++) {
        players[i].reset();
      }
    }
  }
}

// dims button if mouse is over it
function mouseMoved() {
  if (mode == 0) {
    // Start Game button
    dimButton(button3);
  } else if (mode == 1) {
    // Join button
    dimButton(button5);
  } else if (mode == 2) {
    // Roll button
    dimButton(button1);
    // Pass button
    dimButton(button2);
    // Menu button
    dimButton(button6);
    // Leave button
    dimButton(button7);
  } else if (mode == 3) {
    // New Game button
    dimButton(button4);
  }
}

function keyPressed() {
  if (keyCode == ENTER && mode == 1) {
    tempName = userInput.value();
    tempName = tempName.substring(0,20);
  }
  if (mode == 2 && keyCode == 68) {
    if (!isDarkMode) {
      isDarkMode = true;
    } else {
      isDarkMode = false;
    }
  }
  if (mode == 2 && keyCode == 80) {
    if (music.isPlaying()) {
      music.pause();
    } else {
      music.play();
    }
  }
  if (mode == 2 && (keyCode >= 49 && keyCode <= 52) && !players[playerNum - 1].showQuickChat) {
    let data = {k: keyCode, p: playerNum}
    socket.emit('newChat', data);
  }
}
