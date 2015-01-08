module GameMenu
{
    // reference to html elements
var GAME_MENU;
var SCORE;
var LIVES;
var TIMER: Utilities.Timer;

export function init()
    {
    GAME_MENU = document.querySelector( '#GameMenu' );

    var restart = GAME_MENU.querySelector( '#Restart' );

    restart.onclick = function()
        {
        Game.restart();
        };

    var timer = GAME_MENU.querySelector( '#Timer' );

    TIMER = new Utilities.Timer( timer );

    SCORE = GAME_MENU.querySelector( '#Score' );
    LIVES = GAME_MENU.querySelector( '#Lives' );
    }


export function startTimer( startTime? )
    {
    if ( typeof startTime === 'undefined' )
        {
        startTime = 0;
        }

    TIMER.start({
            startValue: startTime,
            tickCallback: function()
                {
                Game.addScore( -1 );
                }
        });
    }


export function stopTimer()
    {
    TIMER.stop();
    }


export function getCurrentTime()
    {
    return TIMER.getTimeMilliseconds();
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