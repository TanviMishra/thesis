//VARIABLES
let socket = io();
//DOM VARIABLES
let grid = document.querySelector("#grid-content");
let boxesArr = [];
let startButton = document.querySelector("#start");
//GENERAL VARIABLES
let roles = ["empty", "tree", "building"];
let player = {
  playerID: null,
  playerRole: null,
  playerTag: null,
};
let domArray = [];
//INITIALISE PLAYER
function checkRole() {
  switch (player.playerRole) {
    case roles[0]: //empty
      player.playerTag = 0;
      break;
    case roles[1]: //tree
      player.playerTag = 2; //return 1 will create primary forest instead
      break;
    case roles[2]: //building
      player.playerTag = 3; //return 1 will create primary forest instead
      break;
  }
}
function playerSetup(input) {
  player.playerID = Date.now(); //uuidv4();
  player.playerRole = roles[input % roles.length];
  checkRole(player);
}
//EVENT LISTENERS
startButton.addEventListener("click", () => {
  socket.emit("startGame");
});
function addingEventListener(domElement, array, row, column) {
  domElement.addEventListener("click", () => {
    array[row][column] = player.playerTag; //changing value of the grid array TO DO: based on role
    socket.emit("updatedArray", array);
  });
}

//SOCKET CLIENT LISTENERS
socket.on("gameBoard", (data) => {
  makeGameBoard(grid, data.board);
  if (player.playerID == null) {
    playerSetup(data.count);
    console.log(data.count);
    console.log(player);
  }
});
socket.on("startGame", () => {
  cueStart();
});
socket.on("updatedArray", (data) => {
  console.log("board update");
  updateBoard(data);
});

//GENERAL FNS
function cueStart() {
  document.querySelector("body").style.overflowY = "scroll";
  document.querySelector("#instruct").style.display = "none";
}
function makeGameBoard(canvas, array) {
  if (!canvas.hasChildNodes()) drawBoard(canvas, array); //if children don't exist, add the grid
}
function drawBoard(canvas, array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      let box = document.createElement("div");
      box.classList.add("boxConst");
      addingClass(array[i][j], box);
      canvas.append(box);
      addingEventListener(box, array, i, j);
    }
  }
}
function updateBoard(array) {
  domArray = document.querySelectorAll(".boxConst");
  checkArray(array, domArray);
}
function checkArray(array, domArray) {
  // console.log(array);
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      addingClass(array[i][j], domArray[i * 10 + j]);
    }
  }
}
function addingClass(checkValue, domElement) {
  domElement.className = ""; //flush out previous values
  domElement.classList.add("boxConst");
  switch (checkValue) {
    case 0:
      domElement.classList.add("vacant");
      break;
    case 1:
      domElement.classList.add("primaryTree");
      // player.playerRole == "tree"
      //   ? domElement.classList.add("primaryTree")
      //   : domElement.classList.add("secondaryTree");
      break;
    case 2:
      domElement.classList.add("secondaryTree");
      break;
    case 3:
      domElement.classList.add("building");
      break;
  }
}
