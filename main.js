'use strict';

var PIXI = PIXI;

var GAME_WIDTH = 960;
var GAME_HEIGHT = 540;

var renderer = new PIXI.autoDetectRenderer(GAME_WIDTH, GAME_HEIGHT);

// The renderer will create a canvas element for you that you can then insert into the DOM.
var pixiDiv = document.getElementById('pixi');
console.log(pixiDiv);
pixiDiv.appendChild(renderer.view);
renderer.backgroundColor = 0x111111;

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

// image loader
var loader = PIXI.loader;
loader.add('bird1', 'images/bird-1.png');
loader.add('bird2', 'images/bird-2.png');
loader.add('bg1', 'images/bg1.png');
loader.add('bg2', 'images/bg2.png');
loader.add('bg3', 'images/bg3.png');
loader.add('bg4', 'images/bg4.png');
loader.add('bg5', 'images/bg5.png');
loader.add('spike1', 'images/spike-1.png');

//once items are loaded start
loader.once('complete', init);
loader.load();

//time variables
var lasttime;
var currtime;
var delta;

var keySpace = keyboard(32);

//background
var bg = new Array(5);

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
var FRAMERATE = 0.20;
//move speed of pipes
var SPEED = 1;
//bird fall speed
var ySpeed = 2;

//text
var txtTimer;
var time = 0;
var txtScore;
var score = 0;

//pipes
var pipes = new Array();

function init() {
  console.log('init');

  bg[0] = new PIXI.Sprite(loader.resources.bg1.texture);
  bg[1] = new PIXI.extras.TilingSprite(loader.resources.bg2.texture, 1920, 1080);
  bg[2] = new PIXI.extras.TilingSprite(loader.resources.bg3.texture, 1920, 1080);
  bg[3] = new PIXI.extras.TilingSprite(loader.resources.bg4.texture, 1920, 1080);
  bg[4] = new PIXI.extras.TilingSprite(loader.resources.bg5.texture, 1920, 1080);


  bird = new PIXI.Sprite(PIXI.Texture.fromFrame(FRAMES[0]));
  frameindex = 0;
  frametime = FRAMERATE;
  bird.anchor.x = 0.5;
  bird.anchor.y = 0.5;
  bird.position.y = GAME_HEIGHT / 2;
  bird.position.x = 200;
  bird.scale.x = 0.1;
  bird.scale.y = 0.1;

  //add BG
  bg.forEach(function(b) {
    b.scale.x = 0.5;
    b.scale.y = 0.5;
    stage.addChild(b);
  });
  //add bird to stage;
  stage.addChild(bird);

  txtTimer = new PIXI.Text('0', {
    dropShadow: true,
    fill: 'white',
    dropShadowDistance: 3
  });
  txtTimer.x = 10;
  txtTimer.y = 10;
  stage.addChild(txtTimer);

  txtScore = new PIXI.Text('Score: 0', {
    dropShadow: true,
    fill: 'white',
    dropShadowDistance: 3
  });
  txtScore.x = GAME_WIDTH - 200;
  txtScore.y = 10;
  stage.addChild(txtScore);

  //start animation
  lasttime = new Date().getTime();
  animate();
}

var cooldown = 0;
var count = 0;

function restartGame() {
  //alert("YOU LOSE, OK TO RESTART");
  bird.y = GAME_HEIGHT / 2;
  time = 0;
  score = 0;
  SPEED = 1;
  pipes.forEach(function(p) {
    stage.removeChild(p);
  });
  pipes = new Array();
}

function collision(s1, s2) {
  //True if there is a collision
  return (
  (s1.x - s1.width/2) < (s2.x + s2.width/2) &&
  (s1.x + s1.width/2) > (s2.x - s2.width/2) &&
  (s1.y - s1.height/2) < (s2.y + s2.height/2) &&
  (s1.y + s1.height/2) > (s2.y - s2.height/2)
  );
}

function logic(delta) {

  //spawn pipes
  cooldown -= 0.1;
  if (cooldown <= 0) {
    var p = new PIXI.Sprite(loader.resources.spike1.texture);
    p.anchor.x = 0.5;
    p.anchor.y = 1;
    p.scale.y = 0.25 + (0.35 * Math.random());
    p.scale.x = 0.5;
    p.x = GAME_WIDTH + 30;
    p.y = GAME_HEIGHT + 10;
    if (count >= 1) {
      p.rotation = Math.PI;
      p.y = -10;
      count = 0;
    } else {
      count++;
    }
    pipes.push(p);
    stage.addChildAt(p, 5);
    cooldown = 8 + Math.random() * 5;
  }

  pipes.forEach(function(p) {
    p.x -= SPEED * 2;
    if (collision(bird, p)) {
      restartGame();
    }
    if (p.x < -30) {
      //remove sprite from stage then array then destroy
      stage.removeChild(p);
      pipes.splice(p, 1);
      p.destroy();
      score++;
    }
  });

  //timer
  time += 1 * delta;
  txtTimer.text = Math.floor(time) + 's';
  txtScore.text = 'Score: ' + score;

  //increase game speed over time
  SPEED = (1 + time / 100);

  //parallax background
  bg[1].tilePosition.x -= 0.5 * SPEED;
  bg[2].tilePosition.x -= 1 * SPEED;
  bg[3].tilePosition.x -= 2 * SPEED;
  bg[4].tilePosition.x -= 2 * SPEED;

  //move bird
  bird.position.y += ySpeed;
  //cap max drop speed
  if (ySpeed < 4) {
    ySpeed += 0.2;
  }
  //lose if touches ground
  if (bird.position.y > GAME_HEIGHT || bird.position.y < 0) {
    restartGame();
  }

  //check if space is pressed
  keySpace.press = function() {
    ySpeed = -4;
  };

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

  //rotate based on ySpeed
  bird.rotation = ySpeed / 6;
}

function animate() {
  // start the timer for the next animation loop
  currtime = new Date().getTime();
  delta = (currtime - lasttime) / 1000;

  logic(delta);

  //render and update animation/time
  renderer.render(stage);
  requestAnimationFrame(animate);
  lasttime = currtime;
}

function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;

  //The `downHandler`
  key.downHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
  };

  //The `upHandler`
  key.upHandler = function(event) {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
  };

  //Attach event listeners
  window.addEventListener(
    'keydown', key.downHandler.bind(key), false
  );
  window.addEventListener(
    'keyup', key.upHandler.bind(key), false
  );
  return key;
}

window.addEventListener('touchstart', function() {
  ySpeed= -4;
 });
