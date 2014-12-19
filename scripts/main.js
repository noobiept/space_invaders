/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/utilities-1.4.d.ts" />
/// <reference path="game.ts" />
/// <reference path="player.ts" />
/// <reference path="bullet.ts" />
var G = {
    STAGE: null
};
window.onload = function () {
    var canvas = document.querySelector('#MainCanvas');
    canvas.width = 600;
    canvas.height = 400;
    G.STAGE = new createjs.Stage(canvas);
    createjs.Ticker.framerate = 50;
    // the order matters for the z-index (player is going to appear on top of the bullets for example)
    Bullet.init(G.STAGE);
    Player.init(G.STAGE);
    Game.start();
};
