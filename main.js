'use strict';

var PIXI = PIXI;

var renderer = new PIXI.autoDetectRenderer(400, 300);

// The renderer will create a canvas element for you that you can then insert into the DOM.
var pixiDiv = document.getElementById('pixi');
console.log(pixiDiv);
pixiDiv.appendChild(renderer.view);

// You need to create a root container that will hold the scene you want to draw.
var stage = new PIXI.Container();

// image loader
var loader = new PIXI.loaders.Loader();
loader.add('bird','./objects/bird.js');

//once items are loaded start
loader.once('complete',animate);
loader.load();

function logic(){


}

function animate() {
  // start the timer for the next animation loop
  requestAnimationFrame(animate);

  logic();



  // this is the main render call that makes pixi draw your container and its children.
  renderer.render(stage);
}
