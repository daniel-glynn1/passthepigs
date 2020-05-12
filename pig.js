class Pig {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.img = pigs[0];
    this.land = 0;

    this.stopped = false;
  }

  // randomize image
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

  // bounce animation
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
        this.stopped = true;
      } else {
        this.roll();
      }
    }
  }

  // move pigs back
  reset() {
    this.x = 600;
    this.y = 100;
    this.vy = 10;
    this.ay = 0.6;
    this.vx = -5;
  }
}