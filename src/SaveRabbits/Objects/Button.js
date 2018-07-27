
function Button(cx, cy, texture, type) {
    this.kWidth = 15;
    this.kHeight = 15;
    this.mIsUnlocked = false;
    this.mButton = new SpriteAnimateRenderable(texture);

    this.buildSprite(cx, cy);
    GameObject.call(this, this.mButton);

    var rigidShape = new RigidRectangle(this.getXform(), this.kWidth, this.kHeight);
    rigidShape.setMass(0);  // ensures no movements!
    rigidShape.setDrawBounds(true);
    rigidShape.setColor([1, 1, 1, 1]);
    this.setPhysicsComponent(rigidShape);
}
gEngine.Core.inheritPrototype(Button, GameObject);


Button.prototype.buildSprite = function (atX, atY) {
    this.mButton.getXform().setPosition(atX, atY);
    this.mButton.getXform().setSize(this.kWidth, this.kHeight);
    this.mButton.getXform().setZPos(2);
    this.mButton.setElementPixelPositions(180, 360, 0, 155);
};

Button.prototype.pressButton = function () {
    this.mButton.setElementPixelPositions(0, 180, 0, 155);
    this.mIsUnlocked = true;
};

Button.prototype.resetButton = function () {
    this.mButton.setElementPixelPositions(180, 360, 0, 155);
    this.mIsUnlocked = false;
};

Button.prototype.getButtonState = function () {
    return this.mIsUnlocked;
};
Button.prototype.draw = function (aCamera) {
    if (this.isVisible()) {
        this.mRenderComponent.draw(aCamera);
    }
    if (this.mPhysicsComponent !== null) {
        this.mPhysicsComponent.draw(aCamera);
    }
};