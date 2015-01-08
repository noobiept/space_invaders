module HighScore
{
var HTML_ELEMENT: HTMLElement;
var BEST_SCORE: number;

export function init()
    {
    HTML_ELEMENT = <HTMLElement> document.querySelector( '#HighScore' );
    BEST_SCORE = 0;

    load();
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


function load()
    {
    var score = Utilities.getObject( 'space_invaders_high_score' );

    if ( score !== null )
        {
        BEST_SCORE = score;
        }
    }


function save()
    {
    Utilities.saveObject( 'space_invaders_high_score', BEST_SCORE );
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