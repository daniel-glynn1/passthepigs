
function serverListening() {
  socket.on('mouse', newMouseClicked);
  socket.on('rand', newRandNums);
  socket.on('player', newPlayerNum);
  socket.on('join', newPlayerAdd);
  socket.on('leave', deletePlayer);
  socket.on('name', newPlayerName);
  socket.on('getNames', fillNames);
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

      pig1.x = 1000;
      pig2.x = 1000
      output = "";
      changePlayer();
    }
  }
}

function newPlayerNum(num) {
  playerNum = num;
}
function newPlayerAdd() {
  let p = new Player();
  players.push(p);
}
function deletePlayer(num) {
  players.splice(num - 1, 1);
  if (playerNum > num) {
    playerNum--;
  }
}
function newPlayerName(x) {
  players[x.pos].name = x.name;
}
function fillNames(names) {
  for (let i = 0; i < playerNum - 1; i++) {
    players[i].name = names[i];
  }
}
