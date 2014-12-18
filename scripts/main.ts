/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../typings/utilities-1.4.d.ts" />
/// <reference path="game.ts" />
/// <reference path="player.ts" />

var G = {
    STAGE: null
};

window.onload = function()
{
var canvas = <HTMLCanvasElement> document.querySelector( '#MainCanvas' );

canvas.width = 600;
canvas.height = 400;

G.STAGE = new createjs.Stage( canvas );

Game.start();
};