/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/utilities-1.5.d.ts" />
/// <reference path="game.ts" />
/// <reference path="player.ts" />
/// <reference path="bullet.ts" />
/// <reference path="ship.ts" />
/// <reference path="mystery_ship.ts" />
/// <reference path="bunker.ts" />
/// <reference path="game_menu.ts" />
/// <reference path="message.ts" />
/// <reference path="high_score.ts" />

var G = {
    CANVAS_WIDTH: 0,
    CANVAS_HEIGHT: 0,
    STAGE: null,
    PRELOAD: null
};

var BASE_URL = '';

window.onload = function()
{
var canvas = <HTMLCanvasElement> document.querySelector( '#MainCanvas' );

canvas.width = G.CANVAS_WIDTH = 400;
canvas.height = G.CANVAS_HEIGHT = 400;

G.STAGE = new createjs.Stage( canvas );

createjs.Ticker.framerate = 50;

GameMenu.init();
HighScore.init();

    // the order matters for the z-index (player is going to appear on top of the bullets for example)
Bullet.init( G.STAGE );
Ship.init( G.STAGE );
MysteryShip.init( G.STAGE );
Bunker.init( G.STAGE );
Player.init( G.STAGE );
Message.init( G.STAGE );


var manifest = {
        path: BASE_URL + 'images/',
        manifest: [
            { id: 'ship_one_1', src: 'ship_one_1.png' },
            { id: 'ship_one_2', src: 'ship_one_2.png' },
            { id: 'ship_two_1', src: 'ship_two_1.png' },
            { id: 'ship_two_2', src: 'ship_two_2.png' },
            { id: 'ship_three_1', src: 'ship_three_1.png' },
            { id: 'ship_three_2', src: 'ship_three_2.png' }
        ]
    };

G.PRELOAD = new createjs.LoadQueue();
G.PRELOAD.on( 'progress', function( event )
    {
    Message.show( 'Loading.. ' + (event.progress * 100 | 0) + '%' );
    G.STAGE.update();
    });
G.PRELOAD.on( 'complete', function()
    {
    Message.hide();
    GameMenu.show();
    Game.start();
    });
G.PRELOAD.loadManifest( manifest );
};