// server stuff
let socket;

// constants
let width = 800;
let height = 600;
let targetScore = 100;

// objects
let button1, button2, button3, button4;
let pigs = [];
let players = [];

// global variables
let currentPlayer = 0, playerNum = 1;
let output = "";
let firstRoll = false, moving = false, nameEntered = false;
let mode;
let winner;
let userInput;
let lastTurn = 0;
let darkMode = false;
let quickChatTime;
