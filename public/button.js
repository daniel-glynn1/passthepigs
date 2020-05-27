
class Button {
  constructor(x, y, w, h, tx) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;

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
    // rectangle
    fill(1, 20, this.b);
    noStroke();
    rect(this.x, this.y, this.w, this.h, 5);

    // text
    fill(255);
    textSize(23);
    text(this.tx, this.x + 8, this.y + 29);
  }
}
