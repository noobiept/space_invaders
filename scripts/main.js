/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/utilities-1.4.d.ts" />
/// <reference path="game.ts" />
/// <reference path="player.ts" />
/// <reference path="bullet.ts" />
/// <reference path="ship.ts" />
/// <reference path="mystery_ship.ts" />
/// <reference path="bunker.ts" />
/// <reference path="game_menu.ts" />
/// <reference path="message.ts" />
var G = {
    CANVAS_WIDTH: 0,
    CANVAS_HEIGHT: 0,
    STAGE: null
};
window.onload = function () {
    var canvas = document.querySelector('#MainCanvas');
    canvas.width = G.CANVAS_WIDTH = 400;
    canvas.height = G.CANVAS_HEIGHT = 400;
    G.STAGE = new createjs.Stage(canvas);
    createjs.Ticker.framerate = 50;
    GameMenu.init();
    // the order matters for the z-index (player is going to appear on top of the bullets for example)
    Bullet.init(G.STAGE);
    Ship.init(G.STAGE);
    MysteryShip.init(G.STAGE);
    Bunker.init(G.STAGE);
    Player.init(G.STAGE);
    Message.init(G.STAGE);
    GameMenu.show();
    Game.start();
};
