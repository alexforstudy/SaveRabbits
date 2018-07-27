/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/*
 * File: AdventuresOfDye.js 
 * This is the logic of our game. 
 */

/*jslint node: true, vars: true, white: true */
/*global gEngine, Scene, GameObjectset, TextureObject, Camera, vec2,
  Renderable, TextureRenderable, FontRenderable, SpriteRenderable, LightRenderable, IllumRenderable,
  GameObject, TiledGameObject, ParallaxGameObject, Hero, Minion, Dye, Light */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function winLevel() {
    // The camera to view the scene
    this.mCamera = null;
    this.mMsg = null;
    this.mRestart = false;  
}
gEngine.Core.inheritPrototype(winLevel, Scene);


winLevel.prototype.initialize = function () {
    // Step A: set up the cameras
    this.mCamera = new Camera(
        vec2.fromValues(100, 300), // position of the camera
        1280,                        // width of camera
        [0, 0, 1280, 720],         // viewport (orgX, orgY, width, height)
        2
    );
    this.mCamera.setBackgroundColor([0.5, 0.5, 0.9, 1]);

    
    //this.mRestart = false;            
    this.mMsg = new FontRenderable("YOU WIN");
    this.mMsg.setColor([1, 0, 0, 1]);
    this.mMsg.getXform().setPosition(10, 50);
    this.mMsg.setTextHeight(50);
};

// This is the draw function, make sure to setup proper drawing environment, and more
// importantly, make sure to _NOT_ change any state.
winLevel.prototype.draw = function () {
    // Step A: clear the canvas
    gEngine.Core.clearCanvas([0.9, 0.9, 0.9, 1.0]); // clear to light gray
    
    this.mCamera.setupViewProjection();
    this.mMsg.setText("YOU WIN");
    this.mMsg.getXform().setPosition(80, 300);
    this.mMsg.draw(this.mCamera);
    this.mMsg.setText("press R to Start again");
    this.mMsg.getXform().setPosition(10, 250);
    this.mMsg.setTextHeight(20);
    this.mMsg.draw(this.mCamera);
    this.mMsg.setText("press C to next level");
    this.mMsg.getXform().setPosition(10, 200);
    this.mMsg.setTextHeight(20);
    this.mMsg.draw(this.mCamera);
};

// The Update function, updates the application state. Make sure to _NOT_ draw
// anything from this function!
winLevel.prototype.update = function () {
    
    // select which character to work with
    if (gEngine.Input.isKeyPressed(gEngine.Input.keys.R))
    {  this.mRestart = true;
      gEngine.GameLoop.stop();
  }
  
};


winLevel.prototype.unloadScene = function() {
    // Step B: starts the next level
    // starts the next level
     if (this.mRestart == true)
    {
        var nextLevel = new SaveRabbits();  // next level to be loaded
        gEngine.Core.startScene(nextLevel);
    }
    
};
