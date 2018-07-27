
/*jslint node: true, vars: true, white: true */
/*global gEngine, GameObject, SpriteRenderable, RigidCircle, RigidRectangle, Particle */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!
function Rabbit(SpaceShip,TEXTURE,atX,atY) {
    this.SpaceShip = SpaceShip;

    this.RelaPos = [atX,atY];

    this.mState = Rabbit.eHeroState.eMove;

    this.predirect = null;

    this.Control = null;

    var Rabbit1 = new TextureRenderable(TEXTURE);

    Rabbit1.getXform().setSize(1,2);
    Rabbit1.getXform().setRotationInDegree(0);
    Rabbit1.setColor([1,1,1,0]);
    Rabbit1.getXform().setPosition(SpaceShip.mRenderComponent.getposX(),SpaceShip.mRenderComponent.getposY());
    GameObject.call(this,Rabbit1);
}

gEngine.Core.inheritPrototype(Rabbit, GameObject);

Rabbit.eHeroState = Object.freeze({
    eMove: 1,
    eClimb: 2,
    eAttack: 3,
    eAdvance: 4,
    eDefend: 5,
    eFallDown: 6,
    eFaceLeft: 7,
    eFaceRight: 8
});


Rabbit.prototype.getType = function (x,y) {
    var i,j;
    i=32-Math.ceil(y+16);
    j=Math.floor(x+16);
    return this.SpaceShip.SpaceShipMap[i][j];
};

Rabbit.prototype.draw = function (aCamera){

    var Pos = this.SpaceShip.mRenderComponent.getpos();
    this.mRenderComponent.getXform().setPosition(this.RelaPos[0]+Pos[0],this.RelaPos[1]+Pos[1]);
    GameObject.prototype.draw.call(this,aCamera);
};
Rabbit.prototype.update = function () {
    this.control(this.mState);
};

Rabbit.prototype.judge = function (direction){
    if (direction === this.Control.Up) {
        if (this.getType(this.RelaPos[0],this.RelaPos[1]+0.05)==2)
            return true;
    }

    if (direction === this.Control.Down){
        if (this.getType(this.RelaPos[0],this.RelaPos[1]-1.1)==2)
            return true;
    }
    if (direction === this.Control.Left) {
        if (this.getType(this.RelaPos[0]-0.55,this.RelaPos[1])&&this.getType(this.RelaPos[0]-0.55,this.RelaPos[1]+0.95)&&this.getType(this.RelaPos[0]-0.525,this.RelaPos[1]-0.95))
            return true;
    }
    if (direction === this.Control.Right)  {
        if (this.getType(this.RelaPos[0]+0.55,this.RelaPos[1])&&this.getType(this.RelaPos[0]+0.55,this.RelaPos[1]+0.95)&&this.getType(this.RelaPos[0]+0.525,this.RelaPos[1]-0.95))
            return true;
    }
    return false;
};

Rabbit.prototype.control = function(aState){
    var temp = null;
    switch (aState) {
        case Rabbit.eHeroState.eMove:
            var deltaX = 0.1;
            if (gEngine.Input.isKeyPressed(this.Control.Up)) {
                if (this.judge(this.Control.Up)){
                    this.RelaPos = [-32/2+0.5+Math.floor(16+this.RelaPos[0]),this.RelaPos[1]+deltaX];
                    this.mState = Rabbit.eHeroState.eClimb;
                }
            }
            if (gEngine.Input.isKeyPressed(this.Control.Down )){
                if (this.judge(this.Control.Down)){
                    this.RelaPos = [-32/2+0.5+Math.floor(16+this.RelaPos[0]),this.RelaPos[1]-deltaX];
                    this.mState = Rabbit.eHeroState.eClimb;
                }
            }
            if (gEngine.Input.isKeyPressed(this.Control.Left)) {
                if (this.judge(this.Control.Left)) {
                    this.RelaPos = [this.RelaPos[0] - deltaX, this.RelaPos[1]];
                    if (this.getType(this.RelaPos[0]+0.5,this.RelaPos[1]-1.05)>0)
                        this.mState = Rabbit.eHeroState.eClimb;
                }
            }
            if (gEngine.Input.isKeyPressed(this.Control.Right)) {
                if (this.judge(this.Control.Right))
                    this.RelaPos = [this.RelaPos[0]+deltaX,this.RelaPos[1]];
                if (this.getType(this.RelaPos[0]-0.5,this.RelaPos[1]-1.05)>0)
                    this.mState = Rabbit.eHeroState.eClimb;
            }
            if (gEngine.Input.isKeyClicked(this.Control.Leave)) {
                if ((temp=this.getType(this.RelaPos[0],this.RelaPos[1]))>2)
                    this.mState = temp;
            }
            break;
        case Rabbit.eHeroState.eClimb:
            var deltaX = 0.2;
            if (gEngine.Input.isKeyPressed(this.Control.Up)) {
                if (this.judge(this.Control.Up)){
                    this.RelaPos = [-32/2+0.5+Math.floor(16+this.RelaPos[0]),this.RelaPos[1]+deltaX];
                }
            }

            if (gEngine.Input.isKeyPressed(this.Control.Down )){
                if (this.judge(this.Control.Down)){
                    this.RelaPos = [-32/2+0.5+Math.floor(16+this.RelaPos[0]),this.RelaPos[1]-deltaX];
                }
            }
            if (gEngine.Input.isKeyPressed(this.Control.Left)) {
                if (this.judge(this.Control.Left)){
                    this.RelaPos = [this.RelaPos[0]-deltaX,this.RelaPos[1]];
                    this.mState = Rabbit.eHeroState.eFallDown;
                    this.predirect = this.Control.Left;
                }
            }
            if (gEngine.Input.isKeyPressed(this.Control.Right))  {
                if (this.judge(this.Control.Right)){
                    this.RelaPos = [this.RelaPos[0]+deltaX,this.RelaPos[1]];
                    this.mState = Rabbit.eHeroState.eFallDown;
                    this.predirect = this.Control.Right;
                }
            }
            break;
        case Rabbit.eHeroState.eFallDown:
            var deltaX = 0.1;

            if (this.predirect ===  this.Control.Right)  {
                if (this.getType(this.RelaPos[0]+0.5,this.RelaPos[1]-1.05)>0) {
                    this.RelaPos = [this.RelaPos[0] + deltaX, this.RelaPos[1] - deltaX];
                }
                else
                    this.mState = Rabbit.eHeroState.eMove;
            }
            if (this.predirect ===  this.Control.Left)  {
                if (this.getType(this.RelaPos[0]-0.5,this.RelaPos[1]-1.05)>0){
                    this.RelaPos = [this.RelaPos[0]-deltaX,this.RelaPos[1] - deltaX];
                }
                else
                    this.mState = Rabbit.eHeroState.eMove;
            }
            break;
        case Rabbit.eHeroState.eAttack:
            if (gEngine.Input.isKeyClicked(this.Control.Leave))
                this.mState = Rabbit.eHeroState.eMove;
            break;
        case Rabbit.eHeroState.eDefend:
            if (gEngine.Input.isKeyClicked(this.Control.Leave))
                this.mState = Rabbit.eHeroState.eMove;
            break;
        case Rabbit.eHeroState.eAdvance:
            if (gEngine.Input.isKeyClicked(this.Control.Leave))
                this.mState = Rabbit.eHeroState.eMove;
            break;
    }
};
