let shared;
let me;
let players;
let pixel = 20;
let winHeight = pixel * 2;
let start = 5 * pixel;
let startGame = false;
let playerCount = 3;
let largest = 0;
let smallest = 400;
function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "clb_tm", "room4");
  shared = partyLoadShared("collab");
  me = partyLoadMyShared();
  players = partyLoadGuestShareds();
}
function setup() {
  createCanvas(400, 400);
  noStroke();
  heightReset();
  if (partyIsHost()) {
    partySetShared(shared, {
      fallingArr: [],
    });
  }
  me.x = pixel * int(random(0, width / pixel));
  me.height = pixel * int(random(3, 6));
  me.y = height - start - me.height;
  me.win = false;
  me.turn = "middle";
  console.log(me);
  // heightScale();
}
function heightReset() {
  largest = 0;
  smallest = 400;
}
function heightScale() {
  let tempHeightArr = [];
  for (i = 0; i < players.length; i++) {
    p = players[i];
    tempHeightArr.push(p.height);
  }
  if (Math.max(...tempHeightArr) != Math.min(...tempHeightArr)) {
    largest = Math.max(...tempHeightArr);
    smallest = Math.min(...tempHeightArr);
    for (i = 0; i < players.length; i++) {
      p = players[i];
      if (p.height == largest) {
        p.turn = largest;
      } else if (p.height == smallest) {
        p.turn = smallest;
      }
    }
    console.log(largest, smallest);
  } else {
    console.log("same height");
    heightCheck();
  }
}
function heightCheck() {
  // console.log(largest, smallest);
  for (i = 0; i < players.length; i++) {
    p = players[i];
    if (p.turn == largest) {
      // console.log("lagre", p.turn);
      heightUpdate(p, -2 * pixel);
    } else if (p.turn == smallest) {
      // console.log("lagre", p.turn);
      heightUpdate(p, -1 * pixel);
    } else {
      // console.log("lagre", p.turn);
      heightUpdate(p, -1 * pixel);
    }
  }
}
function heightUpdate(object, quantity) {
  object.y -= quantity;
  object.height += quantity;
}
function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    me.x -= pixel / 2;
  } else if (keyCode === RIGHT_ARROW) {
    me.x += pixel / 2;
  }
}
function checkWin() {
  me.y == winHeight ? (me.lose = true) : (me.lose = false);
  me.height == pixel ? (me.win = true) : (me.win = false);
}
function pixelAppearance() {
  for (const p of players) {
    if (p.win) col = "#8BC34A"; //win colour
    else if (p.lose) col = "#FF5722"; //lose colour
    else col = "#FFEAA4"; //other colour
    fill(col);
    rect(p.x, p.y, pixel, p.height);
  }
  if (me.win) pixCol = "#8BC34A"; //personal win colour
  else if (me.lose) pixCol = "#FF5722"; //personal lose colour
  else pixCol = "#FFC300"; //personal colour
  fill(pixCol);
  rect(me.x, me.y, pixel, me.height);
  fill("#FF7B00"); //falling pix colour
  for (const pix of shared.fallingArr) {
    if ((pix.x, pix.y)) {
      rect(pix.x, pix.y, pixel, pixel);
    }
  }
}
function updatePixel() {
  me.y -= pixel;
  me.height += pixel;
}
function createFallingPix() {
  if (startGame && partyIsHost()) {
    shared.fallingArr.push({
      x: pixel * int(random(0, width / pixel)),
      y: -pixel,
    });
  }
}
function checkCollision(p) {
  if ((p.x, p.y)) {
    //so that dist always recieves a parameter
    if (dist(p.x, p.y + pixel, me.x, me.y) <= 0) {
      // p.y = height; //pushes pixel out
      // updatePixel(); //update player block
      heightUpdate(me, pixel);
      checkWin();
      return true;
    } else return false;
  }
}
function updateFall() {
  if (shared.fallingArr && startGame) {
    for (i = 0; i < shared.fallingArr.length; i++) {
      pix = shared.fallingArr[i];
      pix.y < height - start - pixel
        ? (pix.y += pixel / 2)
        : shared.fallingArr.splice(i, 1); //remove the pixel
    }
  }
  // console.log(shared.fallingArr.length);
}
function textBox() {
  let s =
    "collect falling pixels, player who reaches 0 pixels first wins. players lose one or two pixels when they reach the same height"; //*It is sometimes glitchy*'
  push();
  fill("#005C04");
  textSize(16);
  noStroke();
  text(s, pixel, height - start + pixel, width - 4 * pixel, height); // Text wraps within text box
  pop();
}
function draw() {
  if (startGame) {
    background("#4AC3BE"); //bg
    fill("#8BC34A"); //fill
    strokeWeight(1);
    stroke("#005C04");
    rect(0, height - pixel - start, width, height); //ground
    line(0, winHeight, width, winHeight); //win line
    textBox(); //instructions fn call
    heightScale();
    for (i = 0; i < shared.fallingArr.length; i++) {
      pix = shared.fallingArr[i];
      let collided = checkCollision(pix);
      if (collided) shared.fallingArr.splice(i, 1); //remove pixel
    }
    pixelAppearance();
  } else background("#4AC3BE"); //bg
}
function startGameCheck() {
  players.length == playerCount ? (startGame = true) : (startGame = false);
  // console.log(players.length);
}
setInterval(() => startGameCheck(), 500);
setInterval(() => createFallingPix(), 5000);
setInterval(() => updateFall(), 1000);
// }
