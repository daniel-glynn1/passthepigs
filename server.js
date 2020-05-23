
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const server = app.listen(port);

app.use(express.static('public'));

console.log("look at this server bro");

const socket = require("socket.io");
const io = socket(server);

io.sockets.on('connection', newConnection);



let numConnections = 0;
let players = [];
let playerNames = [];

function newConnection(socket) {
  numConnections++;
  console.log('Connection #' + numConnections + ': ' + socket.id);
  io.to(socket.id).emit('playerList', players);

  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
    // io.sockets.emit('mouse', data);

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
    num = numConnections;
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
      pos: numConnections - 1
    }
    socket.broadcast.emit('name', namePos);
  }
  socket.on('getNames', sendNames);
  function sendNames(names) {
    names = playerNames;
    io.to(socket.id).emit('getNames', names);
  }


  // disconnection
  socket.on('disconnect', disconnection);
  function disconnection() {
    numConnections--;
    io.sockets.emit('leave', numConnections);
    console.log(socket.id + ' disconnected');
  }

}
