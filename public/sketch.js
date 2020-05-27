
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

  textFont(font);
  music.setLoop(true);
  music.setVolume(0.1);

  // game mode
  mode = 0;

  // create socket/connection to server
  socket = io();
  serverListening();

  // send new player to server
  socket.emit('player', 1);
  socket.emit('join', 1);
}

function draw() {
  if (darkMode) background(23, 32, 42);
  else background(209, 242, 235);

  if (mode == 0) {
    startMenu();

  } else if (mode == 1) {
    if (playerNum == currentPlayer + 1) {
      button1.show();
      button2.show();
    }

    // UI
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
      checkWin();
    }
  } else if (mode == 2) {
    endScreen();
  }
}

function mouseClicked() {
  if (mode == 0) {
    // Start game button
    if (button3.underMouse(mouseX, mouseY)) {
      mode = 1;
      music.play();
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

        pig1.x = 1000;
        pig2.x = 1000
        output = "";
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
      firstRoll = false;
      currentPlayer = 0;
      lastTurn = 0;
      music.play();
      for (let i = 0; i < players.length; i++) {
        players[i].reset();
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
      if (players[playerNum - 1].name.length >= 11) {
        players[playerNum - 1].name = players[playerNum - 1].name.substring(0, 11);
      }
      socket.emit('name', players[playerNum - 1].name);
      nameEntered = true;
    }
  }
  if (nameEntered && keyCode == 68) {
    if (!darkMode) {
      darkMode = true;
    } else {
      darkMode = false;
    }
  }
  if (nameEntered && keyCode == 80) {
    if (music.isPlaying()) {
      music.pause();
    } else {
      music.play();
    }
  }
}
