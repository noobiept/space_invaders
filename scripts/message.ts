module Message
{
var TEXT;
var TIMEOUT;

export function init( stage )
    {
    TIMEOUT = new Utilities.Timeout();

    TEXT = new createjs.Text( '', '30px monospace', 'white' );
    TEXT.textAlign = 'center';
    TEXT.textBaseline = 'middle';
    TEXT.x = G.CANVAS_WIDTH / 2;
    TEXT.y = G.CANVAS_HEIGHT / 2;
    TEXT.visible = false;

    stage.addChild( TEXT );
    }


export function show( text: string, timeout?: number, callback? )
    {
    TEXT.text = text;
    TEXT.visible = true;

    if ( Utilities.isNumber( timeout ) )
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
}