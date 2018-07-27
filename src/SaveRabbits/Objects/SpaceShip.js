
"use strict";

function SpaceShip(atX,atY,PropellerTexture,DefenderTexture) {
    this.SpaceShipMap = null;

    var CircleRender = new CircleRenderable(16,50,atX,atY);
    CircleRender.setColor([209/256,120/256,226/256,1]);

    this.OnWork = null;
    this.mMapRender = new Renderable();
    this.mMapRender.getXform().setSize(1,1);
    this.mMapRender.getXform().setRotationInDegree(0);

    GameObject.call(this,CircleRender);

    var rigidShape = new RigidCircle(CircleRender.getXform(),16);
    rigidShape.setMass(1);
    rigidShape.setColor([1,1,1,1]);
    rigidShape.setDrawBounds(true);
    rigidShape.mSides.setPointSize(10);
    GameObject.prototype.setPhysicsComponent.call(this,rigidShape);

    this.mDefender = null;
    this.mPropeller = null;
    this.ShipWeapons = [];

    this.mPropeller = new Propeller(this,45,PropellerTexture);
    this.mDefender = new Defender(this,135,DefenderTexture);
    for (var i = 0,Weapon;i < 4 ; i++)
    {
        Weapon = new ShipWeapon(this,i*90);
        this.ShipWeapons.push(Weapon);
    }
}

gEngine.Core.inheritPrototype(SpaceShip,GameObject);

SpaceShip.prototype.draw = function (aCamera,Cheat) {

    this.mPropeller.draw(aCamera);
    this.mDefender.draw(aCamera);
    for (var i = 0;i < 4 ; i++)
    {
        this.ShipWeapons[i].draw(aCamera);
    }

    Cheat.draw(aCamera);

    var height = this.SpaceShipMap.length;
    var width = this.SpaceShipMap[0].length;
    var Pos = this.mRenderComponent.getpos();
    for (var i=0;i<height;i++)
        for (var j=0;j<width;j++)
        {
            if (!this.SpaceShipMap[i][j])
                continue;

            this.mMapRender.getXform().setPosition(Pos[0]-width/2+j+0.5,Pos[1]+height/2-i-0.5);
            switch (this.SpaceShipMap[i][j])
            {
                case 0:break;
                case 1:this.mMapRender.setColor([123/256,76/256,192/256,1]);break;
                case 2:this.mMapRender.setColor([0,0,1,1]);break;
                case 3:this.mMapRender.setColor([1,0,0,1]);break;
                case 4:this.mMapRender.setColor([0,1,0,1]);break;
                case 5:this.mMapRender.setColor([1,1,0,1]);break;
                default:break;
            }
            this.mMapRender.draw(aCamera);
        }
};

SpaceShip.prototype.update = function (Rabbit_1,Rabbit_2,Cheat) {

    var i = null,j = null;

    switch (Rabbit_1.mState)
    {
        case Rabbit.eHeroState.eAttack: i = this.judge(Rabbit_1);
                                        if (this.ShipWeapons[i].OnWork == null)
                                            this.ShipWeapons[i].OnWork = Rabbit_1;
                                        break;
        case Rabbit.eHeroState.eAdvance:if (this.mPropeller.OnWork == null)
                                        this.mPropeller.OnWork = Rabbit_1;
                                        break;
        case Rabbit.eHeroState.eDefend: if(this.mDefender.OnWork == null)
                                        this.mDefender.OnWork =Rabbit_1;
                                        break;
        default:break;
    }

    switch (Rabbit_2.mState)
    {
        case Rabbit.eHeroState.eAttack: j = this.judge(Rabbit_2);
                                        if (this.ShipWeapons[j].OnWork == null)
                                            this.ShipWeapons[j].OnWork = Rabbit_2;
                                        break;
        case Rabbit.eHeroState.eAdvance:if (this.mPropeller.OnWork == null)
                                        this.mPropeller.OnWork = Rabbit_2;
                                        break;
        case Rabbit.eHeroState.eDefend: if(this.mDefender.OnWork == null)
                                        this.mDefender.OnWork = Rabbit_2;
                                        break;
        default:break;
    }

    Cheat.update();

    var temp = Cheat.getXform().getPosition();

    this.mPropeller.update(Cheat);
    this.mDefender.update(Cheat);
    this.mRenderComponent.setpos(temp);

    for (var k = 0;k<4;k++)
        this.ShipWeapons[k].update();

};

SpaceShip.prototype.judge= function(aRabbit){
    if (aRabbit.mState == Rabbit.eHeroState.eAttack)
    {
        if (aRabbit.RelaPos[0]>aRabbit.RelaPos[1])
        {
            if (-aRabbit.RelaPos[0]<aRabbit.RelaPos[1])
                return 0;
            else return 3;
        }
        else
        {
            if (-aRabbit.RelaPos[0]<aRabbit.RelaPos[1])
                return  1;
            else return  2;
        }
    }
};



SpaceShip.prototype.getShipWeapon= function(){      //NEW
    return this.ShipWeapons;
};
