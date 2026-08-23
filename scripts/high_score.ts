import * as AppStorage from "./app_storage";

export const STORAGE_KEY = "space_invaders_high_score";

export type HighScoreData = number;

let HTML_ELEMENT: HTMLElement;
let BEST_SCORE: HighScoreData;


export function init( data: HighScoreData | null )
    {
    HTML_ELEMENT = document.querySelector<HTMLElement>( "#HighScore" )!;
    BEST_SCORE = data ?? 0;

    updateHtmlElement();
    }


export function add( score: number )
    {
    if ( score > BEST_SCORE )
        {
        BEST_SCORE = score;
        }

    save();
    updateHtmlElement();
    }


function save()
    {
    AppStorage.setData( STORAGE_KEY, BEST_SCORE );
    }


function updateHtmlElement()
    {
    HTML_ELEMENT.innerHTML = BEST_SCORE.toString();
    }


export function clear()
    {
    BEST_SCORE = 0;

    save();
    updateHtmlElement();
    }
