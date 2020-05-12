
let width = 800;
let height = 600;
let numPlayers = 4;
let currentPlayer = 0;

let button1;
let button2;
let pigs = [];
let players = [];
let output = "";
let score = 0, totalScore = 0;
let showPigs = false, moving = false;

function preload() {
  for (let i = 0; i < 6; i++) {
    pigs[i] = loadImage('pigs/pig' + i + '.png');
  }
  bg = loadImage('table.png');
}

function setup() {
  createCanvas(width,height);
  button1 = new Button(width - 80,height - 40, 'Roll');
  button2 = new Button(width - 160,height - 40, 'Pass');

  pig1 = new Pig(600, 100);
  pig2 = new Pig(700, 100);

  for (let i = 0; i < numPlayers; i++) {
    players[i] = new Player();
  }
}

function draw() {
  background(255);
  image(bg, 0, 0, width, height);
  button1.show();
  button2.show();

  fill(0);


  if (showPigs) {
    pig1.show();
    pig2.show();



    if (moving) {
      pig1.move();
      pig2.move();
    } else {
      textSize(40);
      text(output, 350, 450);
    }
  }

  textSize(20);
  text('Player ' + (currentPlayer + 1) + "'s turn", 350, height - 70);
  text('Round score: ' + players[currentPlayer].roundScore, 350, height - 50);
  text('Total Score: ' + players[currentPlayer].totalScore, 350, height - 30);

  textSize(18);
  for (let i = 0; i < numPlayers; i++) {
    text('Player ' + (i + 1), 20 + 100 * i, 20);
    text('Score: ' + players[i].totalScore, 20 + 100 * i, 40);
  }
  textSize(20);

}

function mouseMoved() {
  if (button1.underMouse(mouseX, mouseY)) {
    button1.changeBlue(200);
  } else {
    button1.changeBlue(255);
  }
  if (button2.underMouse(mouseX, mouseY)) {
    button2.changeBlue(200);
  } else {
    button2.changeBlue(255);
  }
}

function mouseClicked() {
  if (button1.underMouse(mouseX, mouseY)) {
    if (!moving) {
      rollPigs();
      pig1.reset();
      pig2.reset();
      pig2.x += 100;
      moving = true;
    }


  }
  if (button2.underMouse(mouseX, mouseY)) {
    players[currentPlayer].totalScore += players[currentPlayer].roundScore;
    players[currentPlayer].roundScore = 0;
    changePlayer();

  }

}

function rollPigs() {
  pig1.roll();
  pig2.roll();

  let num = calcScore(pig1.land, pig2.land);
  if (num == -1) {
    players[currentPlayer].roundScore = 0;
    changePlayer();
  } else {
    players[currentPlayer].roundScore += num;
  }

  showPigs = true;
}


class Button {
  constructor(x, y, tx) {
    this.x = x;
    this.y = y;
    this.w = 70;
    this.h = 30;

    this.r = 0;
    this.g = 0;
    this.b = 255;

    this.tx = tx;
  }

  underMouse(mx, my) {
    return ((mx > this.x && mx < this.x + this.w) &&
    (my > this.y && my < this.y + this.h));
  }

  changeBlue(b) {
    this.b = b;
  }

  show() {
    fill(this.r, this.g, this.b);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 5);

    fill(255);
    textSize(18);
    text(this.tx, this.x + 9, this.y + 21);
  }
}

class Pig {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.img = pigs[0];
    this.land = 0;
  }

  roll() {
    let num = random(1000);
    if (num < 7) {
      this.img = pigs[5];
      this.land = 5;
    } else if (num < 7 + 30) {
      this.img = pigs[4];
      this.land = 4;
    } else if (num < 7 + 30 + 88) {
      this.img = pigs[3];
      this.land = 3;
    } else if (num < 7 + 30 + 88 + 224) {
      this.img = pigs[2];
      this.land = 2;
    } else if (num < 7 + 30 + 88 + 224 + 302) {
      this.img = pigs[0];
      this.land = 0;
    } else {
      this.img = pigs[1];
      this.land = 1;
    }
  }

  show() {
    image(this.img, this.x, this.y, 250, 250);
  }

  move() {
    this.y -= this.vy;
    this.x += this.vx;
    this.vy -= this.ay;

    if (this.y > 150) {
      this.vy *= -0.65;
      this.vx += 0.7;
      if (this.vy < 4) {
        this.vy = 0;
        this.vx = 0;
        moving = false;
      } else {
        this.roll();
      }
    }
  }

  reset() {
    this.x = 600;
    this.y = 100;
    this.vy = 10;
    this.ay = 0.6;
    this.vx = -5;
  }
}

class Player {
  constructor() {
    this.roundScore = 0;
    this.totalScore = 0;
  }

}

function changePlayer() {
  if (currentPlayer == numPlayers - 1) {
    currentPlayer = 0;
  } else {
    currentPlayer++;
  }
}


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
      output = "Leaning Jowler";
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
      output = "Leaning Jowler";
    }
  }
  return sc;
}
