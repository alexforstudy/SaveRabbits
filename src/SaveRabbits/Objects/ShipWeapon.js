
"use strict";

function ShipWeapon(SpaceShip,direct)
{
    this.SpaceShip = SpaceShip;

    this.mDirect = direct;
    this.Angle = 0;
    this.RelaPos = null;
    this.OnWork = null;
    var circle = this.SpaceShip.mRenderComponent;

    this.mProjectiles = new ParticleGameObjectSet();



    this.RelaPos = [circle.getRadius()*Math.cos(Math.PI * direct / 180)
                    ,circle.getRadius()*Math.sin(Math.PI * direct / 180)];

    this.kShootTimer = 10;
    this.mNumCycles = 0;

    this.GunBaseRender = new CircleRenderable(circle.getRadius()/8,20,
        circle.getposX()+this.RelaPos[0],circle.getposY()+this.RelaPos[1]);


    this.GunBaseRender.setColor([1,0.5,0,1]);

    var temp = this.GunBaseRender.getpos();
    this.GunBarrelRender = new Renderable();
    this.GunBarrelRender.setColor([1,0,0,1]);
    this.GunBarrelRender.getXform().setSize(4,1);
    this.GunBarrelRender.getXform().setPosition(temp[0]+2 * Math.cos((this.Angle + this.mDirect)*Math.PI/180)
                                                ,temp[1] + 2 * Math.sin((this.Angle + this.mDirect)*Math.PI/180));
    this.GunBarrelRender.getXform().setRotationInDegree(this.Angle + this.mDirect);
    GameObject.call(this,this.GunBaseRender);
}

gEngine.Core.inheritPrototype(ShipWeapon,GameObject);


ShipWeapon.prototype.update = function ()
{
    if (this.OnWork != null)
    {
        var theta = 2;
        if (gEngine.Input.isKeyPressed(this.OnWork.Control.Left))
        {
            if (theta + this.Angle <= 90)
                this.Angle+=theta;
        }
        if (gEngine.Input.isKeyPressed(this.OnWork.Control.Right))
        {
            if (-theta + this.Angle >= -90)
                this.Angle-=theta;
        }
        if (gEngine.Input.isKeyPressed(this.OnWork.Control.Fire))
        {
            this.mNumCycles++;
            if(this.mNumCycles>this.kShootTimer)
            {
                var vx = Math.cos(Math.PI*(this.Angle+this.mDirect)/180);
                var vy = Math.sin(Math.PI*(this.Angle+this.mDirect)/180);
                var x = this.getXform().getXPos() + 4*vx;
                var y =this.getXform().getYPos() + 4*vy;
                var b = new Bullets(x , y, [ vx, vy], this.Angle+this.mDirect);
                this.mProjectiles.addToSet(b);
                this.mNumCycles = 0;
            }

        }
        if (gEngine.Input.isKeyClicked(this.OnWork.Control.Leave))
        {
            this.OnWork = null;
        }
    }

    var temp = this.SpaceShip.mRenderComponent.getpos();
    this.GunBaseRender.setpos([temp[0]+this.RelaPos[0],temp[1]+this.RelaPos[1]]);

    temp = this.GunBaseRender.getpos();
    this.GunBarrelRender.getXform().setPosition(temp[0]+ 2 * Math.cos((this.Angle + this.mDirect)*Math.PI/180)
                                                ,temp[1] + 2 * Math.sin((this.Angle + this.mDirect)*Math.PI/180));
    this.GunBarrelRender.getXform().setRotationInDegree(this.Angle + this.mDirect);

    this.mProjectiles.update();
};

ShipWeapon.prototype.draw = function (aCamera) {
    this.mProjectiles.draw(aCamera);
    this.GunBarrelRender.draw(aCamera);
    this.GunBaseRender.draw(aCamera);

}

ShipWeapon.prototype.getProjectiles = function () { //new
    return this.mProjectiles;
};
