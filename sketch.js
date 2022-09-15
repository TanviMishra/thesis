let shared;let me;
let guests;
let pixel=20;
let winHeight=pixel*7;
let start =5*pixel;
let startGame=false;
let players=3;
let largest=400;
let smallest=0;
function preload() {
  partyConnect(
    "wss://deepstream-server-1.herokuapp.com",
    "concept_tm",
    "main"
  );
  shared = partyLoadShared("globals");
  me = partyLoadMyShared({ x: 0, y: 0 });
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
  me.x=pixel*int(random(0,width/pixel));
  me.height=pixel*int(random(3,6));
  me.y=height-start-me.height;
  me.win=false;
  me.turn="normal";
  if(guests.length==players){
    heightScale()
  }
}
function heightScale(){
  for (const p of guests) {
    if (p.height>largest) {
      largest=p.height;
      p.turn="largest";
    } 
    if (p.height<smallest) {
      smallest=p.height
      p.turn="smallest";
    }
  }
  console.log(smallest,largest);
}
function reducePixels(){
  let heightCheck=true
  for (const p of guests) {
    if(p.height!="largest"){
      heightCheck=false;
    }
  }
  if(heightCheck==false){
    for (const p of guests) {
      if(p.turn=="largest"){
        p.height-=2*pixel
      }
      else if(p.turn=="smallest"){
        p.height+=pixel
      }
      else if(p.turn=="normal"){
        p.height-=pixel
      }
    }
  }
}
function keyPressed() {
  for (const p of guests) {
    if (keyCode === LEFT_ARROW) {
      me.x-= pixel/2;

    } else if (keyCode === RIGHT_ARROW) {
      me.x +=pixel/2;
    }
  }
}
function checkWin(){
  (me.y==winHeight)? me.win= true: me.win= false
}
function pixelAppearance(){
  for (const p of guests) {
    p.win?col="#CDDC39" : col="#9E9E9E";
    fill(col);
    rect(p.x, p.y, pixel, p.height);
  }
  me.win?pixCol="#CDDC39" : pixCol="#FF5722";
  fill(pixCol);
  rect(me.x, me.y, pixel, me.height);
  fill("#FFEB3B");
  for (const p of shared.fallingArr) {
    rect(p.x, p.y, pixel, pixel);
  }
}
function updatePixel(){
  me.y-=pixel;
  me.height+=pixel
}
function createFallingPix(){
  shared.fallingArr.push({ x: pixel*int(random(0,width/pixel)), y: -pixel });
}
function checkCollision(p){
  if(p.x==me.x && p.y+pixel==me.y && !me.win){
     p.y=height;
    updatePixel();
    checkWin();
  }
}
function updateFall(){
  if(shared.fallingArr){
    for (const p of shared.fallingArr) {
      checkCollision(p);
      (p.y<height-start-pixel)? p.y+=pixel:p.y=height;
    }
  }
}
function textBox(){
  let s = 'collect falling pixels, player who reaches 0 pixels first wins. Players lose one or two pixels when they reach the same height' //*It is sometimes glitchy*'
  push()
  fill("#005C04");
  textSize(16);
  noStroke()
  text(s, pixel, height-start+pixel, width-(4*pixel), height); // Text wraps within text box
  pop()
}
function draw() {
  background("#FFC107");
  fill("#8BC34A");
  strokeWeight(1);
  stroke("#005C04");
  rect(0,height-pixel-start,width,height); //ground
  textBox();
  if(guests.length==players){
    heightScale()
    pixelAppearance();
    // startGame=true;
  }
  // console.log(guests)
  
}
// if(startGame==true){
  setInterval(() => createFallingPix(), 5000);
  setInterval(() => updateFall(), 1000);
// }