
let express = require('express');
let app = express();
let server = require('http').createServer(app);
let io = require('socket.io')(server);
let port = process.env.PORT || 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static('public'));

io.sockets.on('connection', newConnection);

let numConnections = 0;
let playerNames = [];
let ids = [];
let modes = [];
let modeIDs = [];

function newConnection(socket) {
  numConnections++;
  if (numConnections == 1) {
    playerNames = [];
    ids = [];
    modes = [];
    modeIDs = [];
  }
  modeIDs.push(socket.id);

  console.log('Connection #' + numConnections + ': ' + socket.id);

  socket.on('changeMode', updateMode)
  function updateMode(mode) {
    modes[findIndex(socket.id, modeIDs)] = mode;
  }

  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
  }

  socket.on('rand', genRand);
  function genRand(nums) {
    for (let i = 0; i < 8; i++) {
      nums[i] = Math.random(1000);
    }
    io.sockets.emit('rand', nums);
  }

  socket.on('checkLobby', sendLobbyNames);
  function sendLobbyNames(names) {
    names = playerNames;
    io.to(socket.id).emit('checkLobby', names);
  }

  socket.on('player', sendPlayerNum);
  function sendPlayerNum(num) {
    ids.push(socket.id);

    num = ids.length;
    io.to(socket.id).emit('player', num);
  }


  socket.on('join', makeNewPlayer);
  function makeNewPlayer(name) {
    playerNames.push(name);
    io.sockets.emit('join', name);

  }


  socket.on('getNames', sendNames);
  function sendNames(names) {
    names = playerNames;
    io.to(socket.id).emit('getNames', names);
  }

  socket.on('newChat', sendChat);
  function sendChat(data) {
    io.sockets.emit('newChat', data);
  }

  socket.on('leave', sendToLobby);
  function sendToLobby(num) {
    num = findIndex(socket.id, ids);
    ids.splice(num, 1);
    playerNames.splice(num, 1);
    socket.broadcast.emit('leave', num);
  }


  // disconnection
  socket.on('disconnect', disconnection);
  function disconnection(num) {
    numConnections--;
    num = findIndex(socket.id, ids);
    ids.splice(num, 1);
    if (modes[findIndex(socket.id, modeIDs)] == 2) {
      playerNames.splice(num, 1);
      socket.broadcast.emit('leave', num);
    }
    modeIDs.splice(findIndex(socket.id, modeIDs), 1);
    console.log(socket.id + ' disconnected');
  }

}

function findIndex(s, arr) {
  let ind;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == s) {
      ind = i;
    }
  }
  return ind;
}
