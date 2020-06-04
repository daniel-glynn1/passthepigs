
function serverListening() {
  socket.on('mouse', newMouseClicked);
  socket.on('rand', newRandNums);
  socket.on('checkLobby', newLobbyNames);
  socket.on('join', newPlayerAdd);
  socket.on('player', newPlayerNum)
  socket.on('leave', deletePlayer);
  socket.on('getNames', fillNames);
  socket.on('newChat', newQuickChat);
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
  // Roll button
  if (button1.underMouse(data.x, data.y)) {

    if (!isMoving) {
      // randomize pigs and move them back
      rollPigs();
      pig1.reset();
      pig2.reset();
      pig2.x += 100;
      isMoving = true;
    }
  }

  // Pass button
  if (button2.underMouse(data.x, data.y)) {

    if (!isMoving) {
      // add score to total, change player
      players[currentPlayer].totalScore += players[currentPlayer].roundScore;
      players[currentPlayer].roundScore = 0;

      pig1.x = 1000;
      pig2.x = 1000
      output = "";
      changePlayer();
    }
  }
}

function newLobbyNames(names) {
  allNames = names;
}

function newPlayerAdd(name) {
  if (mode == 2) {
    let p = new Player();
    players.push(p);
    players[players.length - 1].name = name;
  } else if (mode == 1) {
    allNames.push(name);
  }

}
function newPlayerNum(num) {
  playerNum = num;
}
function deletePlayer(num) {
  if (mode == 2) {
    players.splice(num, 1);
    if (playerNum > num) {
      playerNum--;
    }
    currentPlayer = 0;
  }

  allNames.splice(num, 1);

}
function fillNames(names) {
  for (let i = 0; i < playerNum - 1; i++) {
    players[i].name = names[i];
  }
}

function newQuickChat(data) {
  players[data.p - 1].showQuickChat = true;
  players[data.p - 1].quickChatTime = millis();
  players[data.p - 1].keyInput = data.k - 48;
}
