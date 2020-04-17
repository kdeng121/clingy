let heart, lay, fb;
var counter = 0;
var rgb = 0;
var r = 0;
var g = 0;
var b = 0;
var decreasingColorFlag = "";
var bpm =0;

function preload() {
  heart = loadModel('resources/hort3.obj');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  lay = createGraphics(width, height, WEBGL);
  imageMode(CENTER);
  r = random(0,255);
  g = random(0,255);
  b = random(0,255);  
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

  // heart color and drawing
  lay.rotateY(radians(frameCount));

  if (score == 2){
    bpm = 0.5;
    if (decreasingColorFlag == true){
      r--;
      g--;
      b--;
      if (r <= 0 || g <= 0 || b <= 0) decreasingColorFlag = false;
    }
    else{
      r++;
      g++;
      b++;
      if (r >= 255 || g >= 255 || b >= 255) decreasingColorFlag = true;
    } 
  }
  else if (score >= 0.6){
    bpm = 1-score;
    r = 0;
    g = 255;
    b = 0;
  }
  else if (score >= 0.3 && score < 0.6){
    r = score*random(0,255);
    g = score*random(0,255);
    b = score*random(0,255);
    score = 2;
  }
  else if (score < 0.3){
    bpm = 1-score;
    r = 255;
    g = 0;
    b = 0;
  }
  // heart size
  if (frameCount % (Math.round(bpm*160)) == 0) lay.scale(-33);
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
