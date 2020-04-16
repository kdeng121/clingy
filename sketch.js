let heart, lay, fb;
var counter = 0;
var rgb = 0;

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

  // heart
  if (frameCount % 80 == 0) lay.scale(-33);
  else lay.scale(-27);

  lay.rotateY(radians(frameCount))
  if (score.score >0.9) rgb = 255;
  else rgb = 0;
  lay.stroke(255 - rgb, rgb, 0);
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
