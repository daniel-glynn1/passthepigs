
class Player {
  constructor() {
    this.roundScore = 0;
    this.totalScore = 0;
    this.name = "";
    this.showQuickChat = false;
    this.quickChatTime = 0;
    this.keyInput = 0;
  }

  reset() {
    this.roundScore = 0;
    this.totalScore = 0;
  }
}
