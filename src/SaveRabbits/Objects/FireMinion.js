"use strict";

function FireMinion(atX, atY,  texture, w, h) {
    this.kOffset = 4.7;
    this.kShootTimer = 90;
    this.mNumCycles = 0;
    Minion.call(this, atX, atY, texture, w, h);
}
gEngine.Core.inheritPrototype(FireMinion,Minion);

FireMinion.prototype.update = function () {
    Minion.prototype.update.call(this);
    var b;
    this.mNumCycles++;
    if(this.mNumCycles > this.kShootTimer){
        this.mNumCycles = 0;
        b = new Bullets(this.getXform().getXPos() - 0.5, this.getXform().getYPos(), [-1, 0], 0.75);
        this.mProjectiles.addToSet(b);
    }
        
};