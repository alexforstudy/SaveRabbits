/*
 * File: SceneFile_Parse.js 
 */
/*jslint node: true, vars: true */
/*global gEngine: false, console: false, Camera: false, vec2: false, Renderable: false */
/* find out more about jslint: http://www.jslint.com/help.html */

"use strict";  // Operate in Strict mode such that variables must be declared before used!

function SceneFileParser(sceneFilePath) {
    this.mSceneXml = gEngine.ResourceMap.retrieveAsset(sceneFilePath);
}

SceneFileParser.prototype._getElm = function (tagElm) {
    var theElm = this.mSceneXml.getElementsByTagName(tagElm);
    if (theElm.length === 0) {
        console.error("Warning: Level element:[" + tagElm + "]: is not found!");
    }
    return theElm;
};

SceneFileParser.prototype.parseCamera = function () {
    var camElm = this._getElm("Camera");
    var i;
    var camera = [];
    for (i = 0; i < camElm.length; i++) {
        var cx = Number(camElm[i].getAttribute("CenterX"));
        var cy = Number(camElm[i].getAttribute("CenterY"));
        var w = Number(camElm[i].getAttribute("Width"));
        var viewport = camElm[i].getAttribute("Viewport").split(" ");
        var bgColor = camElm[i].getAttribute("BgColor").split(" ");
        // make sure viewport and color are number
        var j;
        for (j = 0; j < 4; j++) {
            bgColor[j] = Number(bgColor[j]);
            viewport[j] = Number(viewport[j]);
        }

        var cam = new Camera(
            vec2.fromValues(cx, cy),  // position of the camera
            w,                        // width of camera
            viewport                  // viewport (orgX, orgY, width, height)
        );
        cam.setBackgroundColor(bgColor);
        camera.push(cam);
    }
    return camera;
};

SceneFileParser.prototype.parseSquares = function (sqSet) {
    var elm = this._getElm("Square");
    var i, j, x, y, w, h, r, c, sq;
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(i).attributes.getNamedItem("Width").value);
        h = Number(elm.item(i).attributes.getNamedItem("Height").value);
        r = Number(elm.item(i).attributes.getNamedItem("Rotation").value);
        c = elm.item(i).attributes.getNamedItem("Color").value.split(" ");
        sq = new Renderable(gEngine.DefaultResources.getConstColorShader());
        // make sure color array contains numbers
        for (j = 0; j < 4; j++) {
            c[j] = Number(c[j]);
        }
        sq.setColor(c);
        sq.getXform().setPosition(x, y);
        sq.getXform().setRotationInDegree(r); // In Degree
        sq.getXform().setSize(w, h);
        sqSet.push(sq);
    }
};

SceneFileParser.prototype.parseWallSquares = function (newtexture,wallsqSet) {
    var elm = this._getElm("Wall");
    var i, j, x, y, w, h, sq;
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(i).attributes.getNamedItem("Width").value);
        h = Number(elm.item(i).attributes.getNamedItem("Height").value);
        sq = new Wall(x,y,w,h,newtexture);
        wallsqSet.push(sq);
    }
};

SceneFileParser.prototype.parseMapBackground = function (newtexture) {
    var elm = this._getElm("Map");
    var  x, y, w, h, sq;

        x = Number(elm.item(0).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(0).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(0).attributes.getNamedItem("Width").value);
        h = Number(elm.item(0).attributes.getNamedItem("Height").value);
        return sq = new Map(x,y,w,h,newtexture);


};

SceneFileParser.prototype.parseSpaceShipMap = function () {
    var elm = this._getElm("SpaceShipMap");
    var i,j,line,curline;
    var map = new Array();
    for (i = 0; i < elm.length; i++) {
        line = elm.item(i).attributes.getNamedItem("value").value.split(",");
        // make sure color array contains numbers
        for (j = 0; j < 32; j++) {
            line[j] = Number(line[j]);
        }
        curline = line;
        map.push(curline);
    }
    return map;
};

SceneFileParser.prototype.parseRabbits = function () {
    var elm = this._getElm("Rabbit");
    var i;
    var Control = [];
    for (i = 0; i < elm.length; i++) {
        var temp = new Object();
        temp.Up = Number(elm.item(i).attributes.getNamedItem("Up").value);
        temp.Down = Number(elm.item(i).attributes.getNamedItem("Down").value);
        temp.Left = Number(elm.item(i).attributes.getNamedItem("Left").value);
        temp.Right = Number(elm.item(i).attributes.getNamedItem("Right").value);
        temp.Fire = Number(elm.item(i).attributes.getNamedItem("Fire").value);
        temp.Leave = Number(elm.item(i).attributes.getNamedItem("Leave").value);

        Control.push(temp);
    }
    return Control;
};

SceneFileParser.prototype.parseMinions = function (texture) {
    var elm = this._getElm("Minion");
    var i, j, x, y, v, r, t, w, h, m;
    var allMinions = [];
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        w = Number(elm.item(i).attributes.getNamedItem("Width").value);
        h = Number(elm.item(i).attributes.getNamedItem("Height").value);

        // make sure color array contains numbers

        m = new FireMinion(x, y,  texture, w, h);

        gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, m);
        gEngine.LayerManager.addAsShadowCaster(m);

        allMinions.push(m);
    }

    return allMinions;
};
SceneFileParser.prototype.parseButtons = function (texture) {
    var elm = this._getElm("Button");
    var i, x, y, t, b;
    var allButtons = [];
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);
        t = Number(elm.item(i).attributes.getNamedItem("Type").value);

        b = new Button(x, y, texture, t);
        gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, b);
       gEngine.LayerManager.addAsShadowCaster(b);

        allButtons.push(b);
    }

    return allButtons;
};

SceneFileParser.prototype.parseDoors = function (texture0, texture1, texture2) {
    var elm = this._getElm("Door");
    var i, x, y, d;
    var allDoors = [];
    for (i = 0; i < elm.length; i++) {
        x = Number(elm.item(i).attributes.getNamedItem("PosX").value);
        y = Number(elm.item(i).attributes.getNamedItem("PosY").value);

        d = new Door(x, y, texture0, texture1, texture2);
        gEngine.LayerManager.addToLayer(gEngine.eLayer.eActors, d);
        gEngine.LayerManager.addAsShadowCaster(d);

        allDoors.push(d);
    }

    return allDoors;
};