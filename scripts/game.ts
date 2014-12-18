module Game
{
    // tells if we need to move the player to the left or right (if the key is being pressed)
var MOVE_LEFT = false;
var MOVE_RIGHT = false;

export function start()
    {
    document.body.addEventListener( 'keydown', function( event )
        {
        var key = event.keyCode;

        if ( key === Utilities.KEY_CODE.leftArrow ||
             key === Utilities.KEY_CODE.a )
            {
            MOVE_LEFT = true;
            }

        else if ( key === Utilities.KEY_CODE.rightArrow ||
                  key === Utilities.KEY_CODE.d )
            {
            MOVE_RIGHT = true;
            }
        });
    document.body.addEventListener( 'keyup', function( event )
        {
        var key = event.keyCode;

        if ( key === Utilities.KEY_CODE.leftArrow ||
             key === Utilities.KEY_CODE.a )
            {
            MOVE_LEFT = false;
            }

        else if ( key === Utilities.KEY_CODE.rightArrow ||
                  key === Utilities.KEY_CODE.d )
            {
            MOVE_RIGHT = false;
            }
        });


    var player = new Player();

    createjs.Ticker.on( 'tick', function( event )
        {
        if ( MOVE_LEFT )
            {
            player.moveLeft();
            }

        else if ( MOVE_RIGHT )
            {
            player.moveRight();
            }

        player.tick( event );

        G.STAGE.update();
        });
    }
}