
let express = require("express");
let app = express();
let server = app.listen(3000);

app.use(express.static('public'));

console.log("look at this server bro");

let socket = require("socket.io");
let io = socket(server);

io.sockets.on('connection', newConnection);


let numConnections = 0;

function newConnection(socket) {
  numConnections++;
  console.log('Connection #' + numConnections + ': ' + socket.id);

  socket.on('mouse', mouseMessage);
  function mouseMessage(data) {
    socket.broadcast.emit('mouse', data);
    // io.sockets.emit('mouse', data);
    console.log(data);

  }

  socket.on('rand', genRand);
  function genRand(nums) {
    for (let i = 0; i < 8; i++) {
      nums[i] = Math.random(1000);
    }
    io.sockets.emit('rand', nums);
    console.log(nums);
  }

  socket.on('player', setPlayerNum);
  function setPlayerNum(num) {
    num = numConnections;
    io.to(socket.id).emit('player', num);
  }


}
