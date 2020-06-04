// server stuff
let socket;

// constants
let width = 800;
let height = 600;
let targetScore = 100;

// objects
let button1, button2, button3, button4, button5, button6, button7;
let pigs = [];
let players = [];

// global variables
let currentPlayer = 0, playerNum = 0;
let output = "";
let isFirstRoll = false, isMoving = false;
let mode = -1;
let winner = 0;
let userInput = "";
let lastTurn = 0;
let isDarkMode = false, isMenuOpen = false;
let allNames = [], randomNames = [];
let tempName = "";
let connectTime = 0, connectWait = false;
