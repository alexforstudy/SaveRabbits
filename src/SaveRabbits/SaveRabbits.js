

/* global gEngine, Scene, MyScene, vec2, gManager */

function SaveRabbits(){

    this.kSpaceShipXML = "assets/SpaceShip.xml";
    this.kMapXML = "assets/Map.xml";
    this.mapBackground ="assets/mapRigidTexture.png";
    this.mapRigidtexture = "assets/mapRigidTexture.png";
    this.cheattexture = "assets/wingMan1.png";
    this.kParticle = "assets/jetpack.png";
    this.kPropellerTexture = "assets/Propeller.png";
    this.kDefenderTexture = "assets/defender.png";
    this.rabTexture1 = "assets/bunny1_stand.png";
    this.rabTexture2 = "assets/bunny2_stand.png";
    this.kCircleTexture = "assets/ball.png";
    this.kCarrots = "assets/carrot.png";

    this.court = 20;
    this.kDoorTop = "assets/DoorInterior_Top.png";
    this.kDoorBot = "assets/DoorInterior_Bottom.png";
    this.kDoorSleeve = "assets/DoorFrame_AnimSheet.png";
    this.kButton = "assets/DoorFrame_Button_180x100.png";
    
    this.AllWalls = new GameObjectSet();
    this.mAllMinions = new GameObjectSet();
    this.mAllParticles = new ParticleGameObjectSet();
    
    this.mAllDoors = new GameObjectSet();
    this.mAllButtons = new GameObjectSet();
    this.bloodcourt = 75;
    this.mCamera = null;
    this.mMiniCamera = null;
    this.mBarCamera = null;
    this.mHPCamera = null;
    
    this.bloodBar = null;
    this.Cheat = null;
    this.SpaceShip = null;
    this.mRabbit1 = null;
    this.mRabbit2 = null;
    this.map = null;
    
    //场景切换
    this.win = false;
    this.lose = false;
}

gEngine.Core.inheritPrototype(SaveRabbits, Scene);

SaveRabbits.prototype.initialize = function(){
    Scene.prototype.initialize.call(this);
    gEngine.AudioClips.stopBackgroundAudio();

    var sceneParser = new SceneFileParser(this.kMapXML);
    //this.mCamera = sceneParser.parseCamera();
    [this.mCamera,this.mMiniCamera,this.mBarCamera]=sceneParser.parseCamera();
    this.Cheat = new Cheatobject(85, 500,this.kCircleTexture, 32,32);
    
    this.bloodBar = new Renderable();
    this.bloodBar.getXform().setXPos(100);
    this.bloodBar.getXform().setYPos(284);
    this.bloodBar.barLen = 148;
    this.bloodBar.getXform().setSize(20,this.bloodBar.barLen);
    this.bloodBar.setColor([1,0,0,1]);
    
    
    
    this.bloodBarCarrot = new TextureRenderable(this.kCarrots);
    this.bloodBarCarrot.getXform().setXPos(100);
    this.bloodBarCarrot.getXform().setYPos(374);
    this.bloodBarCarrot.getXform().setSize(12,12);

    var m = sceneParser.parseMinions(this.cheattexture);
    var i;
    for (i = 0; i < m.length; i++) {
        this.mAllMinions.addToSet(m[i]);
    }
    
    var d = sceneParser.parseDoors(this.kDoorTop, this.kDoorBot, this.kDoorSleeve);
    for (i = 0; i < d.length; i++) {
        this.mAllDoors.addToSet(d[i]);
    }
    
    var b = sceneParser.parseButtons(this.kButton, this.mGlobalLightSet);
    for (i = 0; i < b.length; i++) {
        this.mAllButtons.addToSet(b[i]);
    }


    var mapWallSquares = [];
    sceneParser.parseWallSquares(this.mapRigidtexture,mapWallSquares);
    for (var i=0;i<mapWallSquares.length;i++)
    {
        this.AllWalls.addToSet(mapWallSquares[i]);
    }

    this.map = sceneParser.parseMapBackground(this.mapBackground);

    sceneParser = new SceneFileParser(this.kSpaceShipXML);
    this.SpaceShip = new SpaceShip(100,400,this.kPropellerTexture,this.kDefenderTexture);
    this.SpaceShip.SpaceShipMap = sceneParser.parseSpaceShipMap();

    this.mRabbit1 = new Rabbit(this.SpaceShip,this.rabTexture1,-1,0);
    this.mRabbit2 = new Rabbit(this.SpaceShip,this.rabTexture2,1,0);


    [this.mRabbit1.Control,this.mRabbit2.Control] = sceneParser.parseRabbits();
};

SaveRabbits.prototype.loadScene = function () {
    // 加载场景

    gEngine.TextFileLoader.loadTextFile(this.kMapXML,gEngine.TextFileLoader.eTextFileType.eXMLFile);
    gEngine.TextFileLoader.loadTextFile(this.kSpaceShipXML,gEngine.TextFileLoader.eTextFileType.eXMLFile);

    gEngine.Textures.loadTexture(this.rabTexture1);
    gEngine.Textures.loadTexture(this.rabTexture2);

    gEngine.Textures.loadTexture(this.kCircleTexture);

    gEngine.Textures.loadTexture(this.mapBackground);
    gEngine.Textures.loadTexture(this.cheattexture);
    gEngine.Textures.loadTexture(this.kParticle);
    gEngine.Textures.loadTexture(this.kPropellerTexture);
    gEngine.Textures.loadTexture(this.kDefenderTexture);
    //gEngine.Textures.loadTexture(this.mapRigidtexture);
    
    gEngine.Textures.loadTexture(this.kDoorTop);
    gEngine.Textures.loadTexture(this.kDoorBot);
    gEngine.Textures.loadTexture(this.kDoorSleeve);
    
    gEngine.Textures.loadTexture(this.kButton);
    gEngine.Textures.loadTexture(this.kCarrots);
    
};

SaveRabbits.prototype.unloadScene = function () {
    // 卸载场景
        gEngine.LayerManager.cleanUp();
    
    gEngine.TextFileLoader.unloadTextFile(this.kSpaceShipXML);
    gEngine.TextFileLoader.unloadTextFile(this.kMapXML);
    gEngine.Textures.unloadTexture(this.rabTexture1);
    gEngine.Textures.unloadTexture(this.rabTexture2);
    gEngine.Textures.unloadTexture(this.kCircleTexture);
    gEngine.Textures.unloadTexture(this.mapBackground);
    gEngine.Textures.unloadTexture(this.cheattexture);
    gEngine.Textures.unloadTexture(this.kParticle);
    gEngine.Textures.unloadTexture(this.kPropellerTexture);
    gEngine.Textures.unloadTexture(this.kDefenderTexture);
    
    gEngine.Textures.unloadTexture(this.kDoorTop);
    gEngine.Textures.unloadTexture(this.kDoorBot);
    gEngine.Textures.unloadTexture(this.kDoorSleeve);
    
    gEngine.Textures.unloadTexture(this.kButton);
    gEngine.Textures.loadTexture(this.kCarrots);
    
     if(this.win === true){
        var nextLevel = new winLevel();  // next level to be loaded
        gEngine.Core.startScene(nextLevel);
    }
    if(this.lose ===true){
        var nextLevel = new loseLevel();  // next level to be loaded
        gEngine.Core.startScene(nextLevel);
    }
};

SaveRabbits.prototype.update = function(){
    this.mCamera.update();
    this.mMiniCamera.update();
    this.mBarCamera.update();
    Scene.prototype.update.call(this);
    //gEngine.Physics.processObjSet(this.SpaceShip, this.mAllWalls);

    this.mAllMinions.update();
    this.SpaceShip.update(this.mRabbit1,this.mRabbit2,this.Cheat);
    this.mRabbit1.update();
    this.mRabbit2.update();
    this.bloodBarCarrot.update();
//doors and button
    this.mAllDoors.update();
    if (gEngine.Input.isKeyClicked(gEngine.Input.keys.R))
    {       this.win = true;
         gEngine.GameLoop.stop();
    }
    if (this.bloodBar.barLen <=0)
    {       this.lose= true;
         gEngine.GameLoop.stop();
    }
    

    

    

            
            

           //collision detection
        var i,j,k,m;
    var collided = false;
    var collisionInfo = new CollisionInfo();

    if(this.court<=0){
        for (i = 0; i < this.mAllButtons.size(); i++){
        this.mAllButtons.getObjectAt(i).resetButton();
    }
    
        this.court = 20;
            }
            else{
                this.court--;
            }

            //spaceship bullet shoot the button
            for (i = 0; i < 4; i++) {
        var platBox = this.SpaceShip.getShipWeapon()[i].getProjectiles();
        
        for(j=0 ; j<platBox.size();j++){
        var pp = platBox.getObjectAt(j).getPhysicsComponent();
        for (m = 0; m < this.mAllButtons.size(); m++) {
                collided = this.mAllButtons.getObjectAt(m).getPhysicsComponent().collided(pp, collisionInfo);
                if (collided) {
                           this.mAllButtons.getObjectAt(m).pressButton(); 
                           platBox.removeFromSet(platBox.getObjectAt(j));
                           
                }
                
        
        }   
    }
            }
            //open the door
                           var allUnlocked = false;     
    for (i = 0; i < this.mAllButtons.size(); i++) {
        if (this.mAllButtons.getObjectAt(i).getButtonState() === true) {
            allUnlocked = true;
        } else {
            allUnlocked = false;
            break;
        }
    }
    if (allUnlocked) {
        this.mAllDoors.getObjectAt(0).unlockDoor();
    }
    //reset all


    
            
            
        //minion bullet touch spaceship ship weapon bullet
    for (i = 0; i < 4; i++) {
        var platBox = this.SpaceShip.getShipWeapon()[i].getProjectiles();
        for (j = 0; j < platBox.size(); j++) {
            var pBox = platBox.getObjectAt(j).getPhysicsComponent();
                    for (k = 0; k < this.mAllMinions.size(); k++) {
                    var p = this.mAllMinions.getObjectAt(k).getProjectiles();
                    
                    for (m = 0; m < p.size(); m++) {
                  var pp = p.getObjectAt(m).getPhysicsComponent();
                 collided = pBox.collided(pp, collisionInfo);
                             if (collided) {
                         platBox.removeFromSet(platBox.getObjectAt(j));
                         p.removeFromSet(p.getObjectAt(m));
                         //this.bloodBar.barLen -=10;
                         //this.bloodBar.getXform().setSize(20,this.bloodBar.barLen);
                         //this.bloodBar.getXform().incYPosBy(-5);
                         
                      }
                    }
                        }
        
        }   
    }
        
        
        //minion bullet shoot the spaceship 
        for(i=0 ; i<this.mAllMinions.size();i++){
        var platBox = this.mAllMinions.getObjectAt(i).getProjectiles();
        for (j = 0; j < platBox.size(); j++) {
            var pBox = platBox.getObjectAt(j).getPhysicsComponent();

                collided = this.Cheat.getPhysicsComponent().collided(pBox, collisionInfo);
                if (collided) {
                            platBox.removeFromSet(platBox.getObjectAt(j));
                            this.bloodBar.barLen -=10;
                            this.bloodBar.getXform().setSize(20,this.bloodBar.barLen);
                            this.bloodBar.getXform().incYPosBy(-5);
                }
                
        
        }   
    }
    
            //minion bullet shoot the Walls 
        for(i=0 ; i<this.mAllMinions.size();i++){
        var platBox = this.mAllMinions.getObjectAt(i).getProjectiles();
        for (j = 0; j < platBox.size(); j++) {
            var pBox = platBox.getObjectAt(j).getPhysicsComponent();
                for (m=0;m<this.AllWalls.size();m++)
                {
                collided = this.AllWalls.getObjectAt(m).getPhysicsComponent().collided(pBox, collisionInfo);
                if (collided) {
                            platBox.removeFromSet(platBox.getObjectAt(j));
                }
            }
        
        }   
    }
    
                //minion bullet shoot the doors 
        for(i=0 ; i<this.mAllMinions.size();i++){
        var platBox = this.mAllMinions.getObjectAt(i).getProjectiles();
        for (j = 0; j < platBox.size(); j++) {
            var pBox = platBox.getObjectAt(j).getPhysicsComponent();
                for (m=0;m<this.mAllDoors.size();m++)
                {
                collided = this.mAllDoors.getObjectAt(m).getPhysicsComponent().collided(pBox, collisionInfo);
                if (collided) {
                            platBox.removeFromSet(platBox.getObjectAt(j));
                }
            }
        
        }   
    }
    
                    //spaceship touch the walls 
        for(i=0 ; i<this.AllWalls.size();i++){
        var platBox = this.AllWalls.getObjectAt(i).getPhysicsComponent();
                collided = this.Cheat.getPhysicsComponent().collided(platBox, collisionInfo);
                if (collided) {
                            if(this.bloodcourt<=1){
                            this.bloodBar.barLen -=10;
                            this.bloodBar.getXform().setSize(20,this.bloodBar.barLen);
                            this.bloodBar.getXform().incYPosBy(-5);
                            this.bloodcourt = 75;
                      
                        }
                        else{
                            this.bloodcourt--;
                        }
                }
            }
        
         
   
    
    
        //spaceship bullet shoot the walls
            for (i = 0; i < 4; i++) {
        var platBox = this.SpaceShip.getShipWeapon()[i].getProjectiles();
        
        for(j=0 ; j<platBox.size();j++){
        var pp = platBox.getObjectAt(j).getPhysicsComponent();
        for (m = 0; m < this.AllWalls.size(); m++) {
                collided = this.AllWalls.getObjectAt(m).getPhysicsComponent().collided(pp, collisionInfo);
                if (collided) {
                            platBox.removeFromSet(platBox.getObjectAt(j));
                         
                }
                
        
        }   
    }
            }
            
            
          //spaceship bullet shoot the minions
            for (i = 0; i < 4; i++) {
        var platBox = this.SpaceShip.getShipWeapon()[i].getProjectiles();
        
        for(j=0 ; j<platBox.size();j++){
        var pp = platBox.getObjectAt(j).getPhysicsComponent();
        for (m = 0; m < this.mAllMinions.size(); m++) {
                collided = this.mAllMinions.getObjectAt(m).getPhysicsComponent().collided(pp, collisionInfo);
                if (collided) {
                            platBox.removeFromSet(platBox.getObjectAt(j));
                }
                
        
        }   
    }
            }
    
    
    
    
    var Pos = this.SpaceShip.mRenderComponent.getpos();
    this.mCamera.setWCCenter(Pos[0],Pos[1]);
    this.mMiniCamera.setWCCenter(Pos[0],Pos[1]);
};

SaveRabbits.prototype.draw = function(){
    //Scene.prototype.draw.call(this);

    gEngine.Core.clearCanvas([0, 0, 0, 1]);
    gEngine.Physics.processObjSet(this.Cheat,this.mAllButtons);
    gEngine.Physics.processObjSet(this.Cheat,this.mAllDoors);
    gEngine.Physics.processObjSet(this.Cheat,this.AllWalls);
    gEngine.Physics.processObjSet(this.Cheat,this.mAllMinions);
    gEngine.Physics.processSetSet(this.mAllMinions,this.AllWalls);
    gEngine.Physics.processSetSet(this.mAllParticles,this.AllWalls);


    gEngine.Core.clearCanvas([0, 0, 0, 1]);

    
    this.mCamera.setupViewProjection();
    this.mAllDoors.draw(this.mCamera);
    this.mAllButtons.draw(this.mCamera);
    this.AllWalls.draw(this.mCamera);
    this.mAllMinions.draw(this.mCamera);
    this.mAllParticles.draw(this.mCamera);
    this.SpaceShip.draw(this.mCamera,this.Cheat);
    this.mRabbit1.draw(this.mCamera);
    this.mRabbit2.draw(this.mCamera);
    
   // gEngine.LayerManager.drawAllLayers(this.mCamera);

    this.mMiniCamera.setupViewProjection();
    this.mAllButtons.draw(this.mMiniCamera);
    this.mAllDoors.draw(this.mMiniCamera);
    this.AllWalls.draw(this.mMiniCamera);
    this.mAllMinions.draw(this.mMiniCamera);
    this.mAllParticles.draw(this.mMiniCamera);
    this.SpaceShip.draw(this.mMiniCamera,this.Cheat);
    this.mRabbit1.draw(this.mMiniCamera);
    this.mRabbit2.draw(this.mMiniCamera);
    gEngine.LayerManager.drawAllLayers(this.mMiniCamera);
    
    this.mBarCamera.setupViewProjection();
    this.bloodBarCarrot.draw(this.mBarCamera);
    this.bloodBar.draw(this.mBarCamera);

};


