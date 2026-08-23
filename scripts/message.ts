import * as Engine from "@drk4/game-engine";
import { Timeout, isNumber } from "@drk4/utilities";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./globals";

let TEXT: Engine.Text;
let TIMEOUT: Timeout;


export function init()
    {
    TIMEOUT = new Timeout();

    TEXT = new Engine.Text({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT / 2,
            text: "",
            fontFamily: "monospace",
            fontSize: 30,
            color: "white",
            textAlign: "center",
            textBaseline: "middle",
        });
    TEXT.visible = false;

    Engine.addElement( TEXT );
    }


export function show( text: string, timeout?: number, callback?: () => void )
    {
    TEXT.text = text;
    TEXT.visible = true;

    if ( isNumber( timeout ) )
        {
        TIMEOUT.start( function()
            {
            TEXT.visible = false;

            if ( callback )
                {
                callback();
                }

            }, timeout );
        }
    }


export function hide()
    {
    TIMEOUT.clear();
    TEXT.visible = false;
    }
