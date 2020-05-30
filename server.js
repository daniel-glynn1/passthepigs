
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
let players = [];
let playerNames = [];
let ids = [];

function newConnection(socket) {
  numConnections++;
  if (numConnections == 1) {
    playerNames = [];
    players = [];
    ids = [];
  }
  ids.push(socket.id);

  console.log('Connection #' + numConnections + ': ' + socket.id);
  io.to(socket.id).emit('playerList', players);

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

  socket.on('player', setPlayerNum);
  function setPlayerNum(num) {
    num = findIndex(socket.id) + 1;
    io.to(socket.id).emit('player', num);
  }

  socket.on('join', makeNewPlayer);
  function makeNewPlayer(num) {
    io.sockets.emit('join', num);
  }

  socket.on('add', addPlayer);
  function addPlayer(p) {
    players.push(p);
  }

  socket.on('name', addName);
  function addName(n) {
    playerNames.push(n);
    let namePos = {
      name: n,
      pos: findIndex(socket.id)
    }
    socket.broadcast.emit('name', namePos);
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


  // disconnection
  socket.on('disconnect', disconnection);
  function disconnection() {
    numConnections--;
    ids.splice(findIndex(socket.id), 1);
    socket.broadcast.emit('leave', numConnections);
    console.log(socket.id + ' disconnected');
  }

}

function findIndex(s) {
  let ind;
  for (let i = 0; i < ids.length; i++) {
    if (ids[i] == s) {
      ind = i;
    }
  }
  return ind;
}
