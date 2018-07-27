
"use strict";

function Propeller(SpaceShip,direct,PropellerTexture)
{
    this.SpaceShip = SpaceShip;

    this.mDirect = direct;

    this.RelaPos = null;
    this.OnWork = null;
    var circle = this.SpaceShip.mRenderComponent;

    this.RelaPos = [circle.getRadius()*Math.cos(Math.PI * direct / 180)
                    ,circle.getRadius()*Math.sin(Math.PI * direct / 180)];



    this.PropellerBaseRender = new CircleRenderable(circle.getRadius()/16+0.1,20,
        circle.getposX()+this.RelaPos[0],circle.getposY()+this.RelaPos[1]);


    this.PropellerBaseRender.setColor([1,0.5,0,1]);

    this.PropellerRender = new TextureRenderable(PropellerTexture);
    this.PropellerRender.getXform().setSize(16,4);
    this.PropellerRender.getXform().setPosition(circle.getposX()+(circle.getRadius()+ 2.8)* Math.cos(this.mDirect*Math.PI/180)
                                                ,circle.getposY()+(circle.getRadius()+ 2.8)* Math.sin(this.mDirect*Math.PI/180));
    this.PropellerRender.getXform().setRotationInDegree(90 + this.mDirect);
    GameObject.call(this,this.PropellerBaseRender);
}

gEngine.Core.inheritPrototype(Propeller,GameObject);


Propeller.prototype.update = function (Cheat)
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
        if (gEngine.Input.isKeyPressed(this.OnWork.Control.Fire))
        {
            if (Cheat.getSpeed()+0.02<=0.15)
                Cheat.incSpeedBy(0.02);
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
    this.PropellerBaseRender.setpos([temp[0]+this.RelaPos[0],temp[1]+this.RelaPos[1]]);


    this.PropellerRender.getXform().setPosition(temp[0]+(circle.getRadius()+ 2.8)* Math.cos(this.mDirect*Math.PI/180)
                                                ,temp[1]+(circle.getRadius()+ 2.8)* Math.sin(this.mDirect*Math.PI/180));
    this.PropellerRender.getXform().setRotationInDegree(90 + this.mDirect);
};

Propeller.prototype.draw = function (aCamera) {

    this.PropellerBaseRender.draw(aCamera);
    this.PropellerRender.draw(aCamera);
}
