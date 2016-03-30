'use strict';

var PIXI = PIXI;

var renderer = new PIXI.autoDetectRenderer(400, 300);

// The renderer will create a canvas element for you that you can then insert into the DOM.
var pixiDiv = document.getElementById('pixi');
console.log(pixiDiv);
pixiDiv.appendChild(renderer.view);
renderer.backgroundColor = 0x111111;

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

// image loader
var loader = new PIXI.loaders.Loader();
loader.add('bird1', 'images/bird-1.png');
loader.add('bird2', 'images/bird-2.png');
//loading message
loader.on('loading',console.log('Loading'));
//once items are loaded start
loader.once('complete', init);
loader.load();

//time variables
var lasttime;
var currtime;
var delta;

//bird object
//create bird
var bird;
//frame images
var FRAMES = [
  'images/bird-1.png',
  'images/bird-2.png'
];
//current frame
var frameindex;
//frame animation time
var frametime;
//framerate
var FRAMERATE = 0.08;
//move speed
var VELOCITY = 100;

function init() {
  console.log('init');

  bird = new PIXI.Sprite(PIXI.Texture.fromFrame(FRAMES[0]));
  frameindex = 0;
  frametime = FRAMERATE;
  bird.anchor.x = 0.5;
  bird.anchor.y = 0.5;
  bird.position.y = 100;
  bird.position.x = 100;
  bird.scale.x = 0.1;
  bird.scale.y = 0.1;

  //add bird to stage;
  stage.addChild(bird);

  //start animation
  lasttime = new Date().getMilliseconds();
  animate();
}

function logic(delta) {
  //move bird
  bird.position.x += (VELOCITY * delta);

  //animate bird
  frametime -= delta;
  if (frametime <= 0) {
    frameindex++;
    if (frameindex >= FRAMES.length) {
      frameindex = 0;
    }
    bird.texture = PIXI.Texture.fromFrame(FRAMES[frameindex]);
    frametime = FRAMERATE;
  }
}

function animate() {
  // start the timer for the next animation loop
  currtime = new Date().getMilliseconds();
  delta = (currtime - lasttime) / 1000;

  logic(delta);

  //render and update animation/time
  renderer.render(stage);
  requestAnimationFrame(animate);
  lasttime = currtime;
}
