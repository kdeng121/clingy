let heart, lay, fb;
var counter = 0;
var rgb = 0;
var r = 255;
var g = 255;
var b = 0;
var bpm =0;
var colorFSM = 0;

function preload() {
  heart = loadModel('resources/hort3.obj');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  lay = createGraphics(width, height, WEBGL);
  imageMode(CENTER);
}

function draw() { 
  // text
  var randColor = random(255);
  fill(255);
  textSize(width / 50);
  if (frameCount % 3 == 0) text(words, random(-width, width), random(-height, height));
  counter++;

  // setup heart layer
  lay.reset();
  lay.clear();

  // heart color and bpm
  lay.rotateY(radians(frameCount));
  if (score == 2){
    bpm = 80;
    if (colorFSM == 0){ // need to go from 255,255,0 to 255,0,255
      g--;
      b++;
      if (b == 255) colorFSM = 1;
    }
    else if (colorFSM == 1){ // need to go from 255,0,255 to 0, 255, 255
      r--;
      g++;
      if (g == 255) colorFSM = 2; // go forward
    }
    else if (colorFSM == 2){ // need to go from 0, 255,255 to 255,0,255
      g--;
      r++;
      if (r == 255) colorFSM = 3;
    }
    else if (colorFSM == 3){ // need to go from 255,0,255 to 255,255,0
      b--;
      g++;
      if (g == 255) colorFSM = 0;
      
    }
  }
  else if (score >= 0.6){ // positive
    bpm = Math.round((1/score)*30);
    r = 0;
    g = 255;
    b = 0;
  }
  else if (score >= 0.3 && score < 0.6){ // neutral
    r = score*random(0,255);
    g = score*random(0,255);
    b = score*random(0,255);
    score = 2;
  }
  else if (score < 0.3){ // negative
    bpm = Math.round(160*(1-score));
    r = 255;
    g = 0;
    b = 0;
  }

  // heart size
  if (frameCount % bpm == 0) lay.scale(-33);
  else lay.scale(-27);

  lay.stroke(r,g,b);
  console.log(score);
  // if (score.score > 0.9) rgb = 255;
  // else rgb = 0;
  // lay.stroke(255 - rgb, rgb, 0);


  lay.fill(0, 0);
  background(0, 20)
  translate(width / 2, height / 2)
  lay.model(heart)
  image(lay, 0, 0)

  // heart glow effect
  fb = get(0, 0, width, height);
  let fbscl = 1.015;
  image(fb, 0, 0, width * fbscl, height * fbscl)
}
