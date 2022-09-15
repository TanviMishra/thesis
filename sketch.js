let shared;
let me;
let guests;
let pixel = 20;
let winHeight = pixel * 2;
let start = 5 * pixel;
let startGame = false;
let players = 3;
let largest = 0;
let smallest = 400;
function preload() {
  partyConnect("wss://deepstream-server-1.herokuapp.com", "collab_tm", "main");
  shared = partyLoadShared("globals");
  me = partyLoadMyShared();
  guests = partyLoadGuestShareds();
}
function setup() {
  createCanvas(400, 400);
  noStroke();
  if (partyIsHost()) {
    partySetShared(shared, {
      fallingArr: [],
    });
  }
  me.x = pixel * int(random(0, width / pixel));
  me.height = pixel * int(random(3, 6));
  me.y = height - start - me.height;
  me.win = false;
  me.turn = "normal";
  console.log(me);
  // heightScale();
}
function heightScale() {
  for (const p of guests) {
    if (p.height > largest) {
      largest = p.height;
      p.turn = "largest";
    }
    if (p.height < smallest) {
      smallest = p.height;
      p.turn = "smallest";
    }
  }
  console.log(smallest, largest);
}
function reducePixels() {
  let heightCheck = true;
  for (const p of guests) {
    if (p.height != "largest") {
      heightCheck = false;
    }
  }
  if (heightCheck == false) {
    for (const p of guests) {
      if (p.turn == "largest") {
        p.height -= 2 * pixel;
      } else if (p.turn == "smallest") {
        p.height += pixel;
      } else if (p.turn == "normal") {
        p.height -= pixel;
      }
    }
  }
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
  for (const p of guests) {
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
  for (const p of shared.fallingArr) {
    rect(p.x, p.y, pixel, pixel);
  }
}
function updatePixel() {
  me.y -= pixel;
  me.height += pixel;
}
function createFallingPix() {
  if (startGame) {
    shared.fallingArr.push({
      x: pixel * int(random(0, width / pixel)),
      y: -pixel,
    });
  }
}
function checkCollision(p) {
  if (p.x == me.x && p.y + pixel == me.y && !me.win) {
    p.y = height;
    updatePixel();
    checkWin();
  }
}
function updateFall() {
  if (startGame) {
    if (shared.fallingArr) {
      for (const p of shared.fallingArr) {
        checkCollision(p);
        p.y < height - start - pixel ? (p.y += pixel) : (p.y = height);
      }
    }
  }
}
function textBox() {
  let s =
    "collect falling pixels, player who reaches 0 pixels first wins. Players lose one or two pixels when they reach the same height"; //*It is sometimes glitchy*'
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
    if (guests.length == players) {
      heightScale();
      pixelAppearance();
    }
  } else background("#4AC3BE"); //bg
}
function startGameCheck() {
  guests.length == players ? (startGame = true) : (startGame = false);
  // console.log(guests.length);
}
setInterval(() => startGameCheck(), 500);
setInterval(() => createFallingPix(), 5000);
setInterval(() => updateFall(), 1000);
// }
