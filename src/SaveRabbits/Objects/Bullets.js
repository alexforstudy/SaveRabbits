/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


"use strict";

function Bullets(atX, atY, velocity, radius) {
    this.kTexture = "assets/jetpack.png";
    this.kSpeed = 0.5;

    ParticleGameObject.call(this, this.kTexture, atX, atY, 500);
    this.setSpeed(this.kSpeed);
    this.setCurrentFrontDir(velocity);
    var obj = this.getRenderable();
    obj.getXform().setSize(3, 6);
    obj.getXform().setRotationInDegree(radius);
    obj.setColor([1,1,1,0]);
    var rigidShape = new RigidRectangle(this.getXform(),3,3);
    rigidShape.setMass(1);
    rigidShape.setDrawBounds(0);
    rigidShape.setColor([1, 1, 1, 1]);
    rigidShape.setAcceleration([0, 0]);
    this.setPhysicsComponent(rigidShape);
    
    this.setSizeDelta(1);
}
gEngine.Core.inheritPrototype(Bullets, ParticleGameObject);
