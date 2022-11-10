//declaring variables
//REQD DEPENDENCIES ~import
const path = require("path");
const http = require("http");
const express = require("express");
const socketIO = require("socket.io");
// const { v4: uuidv4 } = require("uuid");
//CLIENT PATH
const publicPath = path.join(__dirname, "/../public"); //setting path to serve HTML through the public folder
//PORT
const port = process.env.PORT || 3000;
//IO VARIABLES
let app = express(); //created in line 4
let server = http.createServer(app); //http method
let io = socketIO(server); //sockt.io connect

//some CONNECTION
app.use(express.static(publicPath)); //setting express server to serve content
server.listen(port, () => {
  console.log(`Server is up on port ${port}.`);
});
//GENERAL VARIABLES
let playerCount = -1;
let tileCount = { width: 10, height: 10 };
boardState = Array.from(
  Array(tileCount.width),
  () => new Array(tileCount.height)
);
for (let i = 0; i < tileCount.width; i++) {
  for (let j = 0; j < tileCount.height; j++) {
    boardState[i][j] = Math.floor(Math.random() * 3);
  }
}
//GENERAL FNS

//OPEN a socket.io connection
io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    // playerCount--; //TO DO: eventually that specific player will need to be removed
    // console.log("user has disconnected.");
  });
  socket.on("startGame", () => {
    // io.emit("startGame"); //emit a message back to all the connected clients
    playerCount++;
    io.emit("gameBoard", { board: boardState, count: playerCount });
    console.log(playerCount);
  });
  socket.on("updatedArray", (array) => {
    boardState = array;
    io.emit("updatedArray", boardState);
  });
});

io.on("updatedArray", (socket) => {
  socket.on("updatedArray", (array) => {
    boardState = array;
    io.emit("updatedArray", boardState);
  });
});
