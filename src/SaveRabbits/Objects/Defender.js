
"use strict";

function Defender(SpaceShip,direct,DefenderTexture)
{
    this.SpaceShip = SpaceShip;

    this.mDirect = direct;

    this.RelaPos = null;
    this.OnWork = null;
    var circle = this.SpaceShip.mRenderComponent;

    this.RelaPos = [circle.getRadius()*Math.cos(Math.PI * direct / 180)
                    ,circle.getRadius()*Math.sin(Math.PI * direct / 180)];

    this.DefenderBaseRender = new CircleRenderable(circle.getRadius()/16+0.1,20,
        circle.getposX()+this.RelaPos[0],circle.getposY()+this.RelaPos[1]);


    this.DefenderBaseRender.setColor([0,0.5,0.5,0]);

    this.DefenderRender = new TextureRenderable(DefenderTexture);
    this.DefenderRender.getXform().setSize(20,5); 
    this.DefenderRender.getXform().setPosition(circle.getposX()+(circle.getRadius())* Math.cos(this.mDirect*Math.PI/180)
                                                ,circle.getposY()+(circle.getRadius())* Math.sin(this.mDirect*Math.PI/180));
    this.DefenderRender.getXform().setRotationInDegree(90 + this.mDirect);
    GameObject.call(this,this.DefenderBaseRender);
}

gEngine.Core.inheritPrototype(Defender,GameObject);


Defender.prototype.update = function (Cheat)
{
    if (this.OnWork != null)
    {
        var theta = 1;
        if (gEngine.Input.isKeyPressed(this.OnWork.Control.Left))
        {
            this.mDirect+=theta;
        }
        if (gEngine.Input.isKeyPressed(this.OnWork.Control.Right))
        {
            this.mDirect-=theta;
        }
        if (gEngine.Input.isKeyClicked(this.OnWork.Control.Leave))
        {
            this.OnWork = null;
        }
        if (Cheat.getSpeed()-0.01>=0)
            Cheat.incSpeedBy(-0.01);
        Cheat.setCurrentFrontDir([Math.cos((this.mDirect+180)*Math.PI/180),Math.sin((this.mDirect+180)*Math.PI/180)]);
    }

    var circle = this.SpaceShip.mRenderComponent;
    this.RelaPos = [circle.getRadius()*Math.cos(Math.PI * this.mDirect / 180)
                    ,circle.getRadius()*Math.sin(Math.PI * this.mDirect / 180)];
    var temp = Cheat.getXform().getPosition();
    this.DefenderBaseRender.setpos([temp[0]+this.RelaPos[0],temp[1]+this.RelaPos[1]]);


    this.DefenderRender.getXform().setPosition(temp[0]+(circle.getRadius())* Math.cos(this.mDirect*Math.PI/180)
                                                ,temp[1]+(circle.getRadius())* Math.sin(this.mDirect*Math.PI/180));
    this.DefenderRender.getXform().setRotationInDegree(90 + this.mDirect);
};

Defender.prototype.draw = function (aCamera) {

    this.DefenderBaseRender.draw(aCamera);
    this.DefenderRender.draw(aCamera);
};
