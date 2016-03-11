module HighScore
{
export type HighScoreData = number;

var HTML_ELEMENT: HTMLElement;
var BEST_SCORE: HighScoreData;

export function init( data: HighScoreData )
    {
    HTML_ELEMENT = <HTMLElement> document.querySelector( '#HighScore' );
    BEST_SCORE = 0;

    load( data );
    updateHtmlElement();
    }


export function add( score )
    {
    if ( score > BEST_SCORE )
        {
        BEST_SCORE = score;
        }

    save();
    updateHtmlElement();
    }


function load( score: HighScoreData )
    {
    if ( score )
        {
        BEST_SCORE = score;
        }
    }


function save()
    {
    AppStorage.setData({ space_invaders_high_score: BEST_SCORE });
    }


function updateHtmlElement()
    {
    HTML_ELEMENT.innerHTML = BEST_SCORE.toString();
    }


export function clear()
    {
    BEST_SCORE = 0;

    save();
    }
}