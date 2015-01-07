module Game
{
    // tells if we need to move the player to the left or right (if the key is being pressed)
var MOVE_LEFT = false;
var MOVE_RIGHT = false;

var PLAYER: Player;

    // the tempo of the song/game (the movement of the enemies follow the tempo as well)
var TEMPO_COUNT = 0;

    // when to spawn a mystery ship, the count is a random value assigned later
var MYSTERY_COUNT = 0;

    // time until a random ship fires a bullet
var FIRE_COUNT = 0; // its assigned randomly

export function init()
    {
    document.body.addEventListener( 'keydown', function( event: KeyboardEvent )
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

    document.body.addEventListener( 'keyup', function( event: KeyboardEvent )
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

            new Bullet( bulletX, bulletY, true );
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
    var enemiesSpace = numberOfColumns * Ship.width + (numberOfColumns - 1) * spaceBetween;

        // start position
    var startX = canvasWidth / 2 - enemiesSpace / 2;
    var x = startX;
    var y = MysteryShip.height * 3;

    for (var line = 0 ; line < numberOfLines ; line++)
        {
        for (var column = 0 ; column < numberOfColumns ; column++)
            {
            new Ship( x, y );

            x += Ship.width + spaceBetween;
            }

        x = startX;
        y += Ship.height + spaceBetween;
        }

    Ship.findLeftRight();

    setTempoLimit();
    setMysteryLimit();
    setFireLimit();
    }


function setMysteryLimit()
    {
    MYSTERY_COUNT = Utilities.getRandomInt( 8000, 15000 );
    }


function setFireLimit()
    {
    FIRE_COUNT = Utilities.getRandomInt( 1000, 5000 );
    }

function setTempoLimit()
    {
    TEMPO_COUNT = 600;
    }


/*
    player bullets can collide with:
        - ships
        - mystery ships

    ships bullets can collide with:
        - player
 */

function collisionDetection()
    {
    var detectCollisions = function( groupOne, groupTwo )
        {
        var a, b;
        var one, two;
        var oneX, oneY, oneWidth, oneHeight;

        for (a = groupOne.length - 1 ; a >= 0 ; a--)
            {
            one = groupOne[ a ];
            oneX = one.getX();
            oneY = one.getY();
            oneWidth = one.constructor.width;
            oneHeight = one.constructor.height;

            for (b = groupTwo.length - 1 ; b >= 0 ; b--)
                {
                two = groupTwo[ b ];

                if ( Utilities.boxBoxCollision(
                    oneX, oneY, oneWidth, oneHeight,
                    two.getX(), two.getY(), two.constructor.width, two.constructor.height
                        ))
                    {
                    one.remove();
                    two.remove();
                    return true;
                    }
                }
            }

        return false;
        };

    detectCollisions( Bullet.all_player, Ship.all );
    detectCollisions( Bullet.all_player, MysteryShip.all );

        // enemy bullets with the player
    for (var a = Bullet.all_ship.length - 1 ; a >= 0 ; a--)
        {
        var bullet = Bullet.all_ship[ a ];
        var playerX = PLAYER.getX();
        var playerY = PLAYER.getY();

        if ( Utilities.boxBoxCollision(
            playerX, playerY, Player.width, Player.height,
            bullet.getX(), bullet.getY(), Bullet.width, Bullet.height
                ))
            {
            bullet.remove();
            console.log( 'Took damage!' );
            }
        }
    }


export function tick( event )
    {
        // update the counters
    var delta = event.delta;

    TEMPO_COUNT -= delta;
    MYSTERY_COUNT -= delta;
    FIRE_COUNT -= delta;

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
    if ( TEMPO_COUNT < 0 )
        {
        setTempoLimit();

        Ship.tick( event );
        }

        // the mystery ship is moved normally every tick
    MysteryShip.tick( event );

        // spawn a new mystery ship
    if ( MYSTERY_COUNT < 0 )
        {
        new MysteryShip();

            // new random limit for the next one
        setMysteryLimit();
        }

        // a random ship fires a bullet
    if ( FIRE_COUNT < 0 )
        {
            // get a random ship
        var position = Utilities.getRandomInt( 0, Ship.all.length - 1 );

        Ship.all[ position ].fire();

        setFireLimit();
        }

    PLAYER.tick( event );
    Bullet.tick( event );

        // collision detection after all the rest of the state has been updated
    collisionDetection();

    G.STAGE.update();
    }
}