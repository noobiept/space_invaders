/// <reference path="../typings/browser.d.ts" />
/// <reference path="../typings/utilities.1.8.0.d.ts" />
/// <reference path="game.ts" />
/// <reference path="player.ts" />
/// <reference path="bullet.ts" />
/// <reference path="ship.ts" />
/// <reference path="mystery_ship.ts" />
/// <reference path="bunker.ts" />
/// <reference path="game_menu.ts" />
/// <reference path="message.ts" />
/// <reference path="high_score.ts" />
/// <reference path="game_audio.ts" />
var G = {
    CANVAS_WIDTH: 0,
    CANVAS_HEIGHT: 0,
    STAGE: null,
    PRELOAD: null
};
var BASE_URL = '';
window.onload = function () {
    var canvas = document.querySelector('#MainCanvas');
    canvas.width = G.CANVAS_WIDTH = 430;
    canvas.height = G.CANVAS_HEIGHT = 400;
    G.STAGE = new createjs.Stage(canvas);
    createjs.Ticker.framerate = 50;
    GameMenu.init();
    HighScore.init();
    // the order matters for the z-index (player is going to appear on top of the bullets for example)
    Bullet.init(G.STAGE);
    Ship.init(G.STAGE);
    MysteryShip.init(G.STAGE);
    Bunker.init(G.STAGE);
    Player.init(G.STAGE);
    Message.init(G.STAGE);
    var manifest = {
        path: BASE_URL,
        manifest: [
            { id: 'ship_one_1', src: 'images/ship_one_1.png' },
            { id: 'ship_one_2', src: 'images/ship_one_2.png' },
            { id: 'ship_two_1', src: 'images/ship_two_1.png' },
            { id: 'ship_two_2', src: 'images/ship_two_2.png' },
            { id: 'ship_three_1', src: 'images/ship_three_1.png' },
            { id: 'ship_three_2', src: 'images/ship_three_2.png' },
            { id: 'mystery_ship', src: 'images/mystery_ship.png' },
            { id: 'cannon', src: 'images/cannon.png' },
            { id: 'bunker_1', src: 'images/bunker_1.png' },
            { id: 'bunker_2', src: 'images/bunker_2.png' },
            { id: 'bunker_3', src: 'images/bunker_3.png' },
            { id: 'bunker_4', src: 'images/bunker_4.png' },
            { id: 'music', src: 'audio/space_invaders.ogg' }
        ]
    };
    G.PRELOAD = new createjs.LoadQueue();
    G.PRELOAD.installPlugin(createjs.Sound);
    G.PRELOAD.on('progress', function (event) {
        Message.show('Loading.. ' + (event.progress * 100 | 0) + '%');
        G.STAGE.update();
    });
    G.PRELOAD.on('complete', function () {
        Message.hide();
        GameMenu.show();
        GameAudio.init();
        Game.start();
    });
    G.PRELOAD.loadManifest(manifest);
};
