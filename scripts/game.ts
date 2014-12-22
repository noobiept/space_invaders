module Game
{
    // tells if we need to move the player to the left or right (if the key is being pressed)
var MOVE_LEFT = false;
var MOVE_RIGHT = false;

var PLAYER: Player;

    // the tempo of the song/game (the movement of the enemies follow the tempo as well)
var TEMPO_COUNT = 0;
var TEMPO_LIMIT = 600;

    // when to spawn a mystery ship, the limit is a random value assigned later
var MYSTERY_COUNT = 0;
var MYSTERY_LIMIT = 0;

export function init()
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

    document.body.addEventListener( 'click', function( event )
        {
        var button = event.button;

        if ( button === Utilities.MOUSE_CODE.left )
            {
            var bulletX = PLAYER.getCenterX() - Bullet.width / 2;
            var bulletY = PLAYER.getCenterY() - Bullet.height / 2;

            new Bullet( bulletX, bulletY );
            }
        });


    PLAYER = new Player();

    createjs.Ticker.addEventListener( 'tick', Game.tick );
    }

export function start()
    {
    var numberOfLines = 5;
    var numberOfColumns = 11;
    var spaceBetween = 10;
    var canvasWidth = G.STAGE.canvas.width;
    var enemiesSpace = numberOfColumns * Enemy.width + (numberOfColumns - 1) * spaceBetween;

        // start position
    var startX = canvasWidth / 2 - enemiesSpace / 2;
    var x = startX;
    var y = MysteryShip.height * 3;

    for (var line = 0 ; line < numberOfLines ; line++)
        {
        for (var column = 0 ; column < numberOfColumns ; column++)
            {
            new Enemy( x, y );

            x += Enemy.width + spaceBetween;
            }

        x = startX;
        y += Enemy.height + spaceBetween;
        }

    Enemy.findLeftRight();

    setMysteryLimit();
    }


function setMysteryLimit()
    {
    MYSTERY_LIMIT = Utilities.getRandomInt( 8000, 15000 );
    }


export function tick( event )
    {
    TEMPO_COUNT += event.delta;
    MYSTERY_COUNT += event.delta;

        // deal with the movement of the player
    if ( MOVE_LEFT )
        {
        PLAYER.moveLeft( event );
        }

    else if ( MOVE_RIGHT )
        {
        PLAYER.moveRight( event );
        }

        // move the enemy ships according to the current tempo
    if ( TEMPO_COUNT > TEMPO_LIMIT )
        {
        TEMPO_COUNT = 0;

        Enemy.tick( event );
        }

        // the mystery ship is moved normally every tick
    MysteryShip.tick( event );

        // spawn a new mystery ship
    if ( MYSTERY_COUNT > MYSTERY_LIMIT )
        {
        MYSTERY_COUNT = 0;

        new MysteryShip();

            // new random limit for the next one
        setMysteryLimit();
        }

    PLAYER.tick( event );
    Bullet.tick( event );

    G.STAGE.update();
    }
}