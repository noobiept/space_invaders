module GameMenu
{
    // reference to html elements
var GAME_MENU;
var SCORE;
var LIVES;

export function init()
    {
    GAME_MENU = document.querySelector( '#GameMenu' );

    var restart = GAME_MENU.querySelector( '#Restart' );

    restart.onclick = function()
        {
        Game.restart();
        };

    SCORE = GAME_MENU.querySelector( '#Score' );
    LIVES = GAME_MENU.querySelector( '#Lives' );
    }


export function updateScore( score )
    {
    SCORE.innerHTML = score;
    }


export function updateLives( lives )
    {
    LIVES.innerHTML = lives;
    }


export function show()
    {
    GAME_MENU.style.visibility = 'visible';
    }


export function hide()
    {
    GAME_MENU.style.visibility = 'hidden';
    }
}