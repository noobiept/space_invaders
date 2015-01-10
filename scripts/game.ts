module Game
{
    // tells if we need to move the player to the left or right (if the key is being pressed)
var MOVE_LEFT = false;
var MOVE_RIGHT = false;

var PLAYER: Player;
var SCORE: number;

    // the tempo of the song/game (the movement of the enemies follow the tempo as well)
    // the ships move every 'TEMPO_LIMIT' milliseconds
var TEMPO_COUNT = 0;
var TEMPO_LIMIT = 0;
var INITIAL_TEMPO = 100; // initial tempo of the game (before any ship is destroyed)
var CURRENT_TEMPO = 0;

    // when to spawn a mystery ship, the count is a random value assigned later
var MYSTERY_COUNT = 0;

    // time until a random ship fires a bullet
var FIRE_COUNT = 0; // its assigned randomly


/*
    Starts a new game.

    The score/lives of a previously played game can be pass on to the next game (in case the previous one was won).
    Otherwise, start from 0 score.
 */

export function start( initialScore?: number, initialLives?: number, initialTime?: number )
    {
        // :::: add the enemy ships :::: //
    var numberOfLines = 5;
    var numberOfColumns = 11;
    var spaceBetween = 10;
    var canvasWidth = G.CANVAS_WIDTH;
    var enemiesSpace = numberOfColumns * Ship.highest_width + (numberOfColumns - 1) * spaceBetween;

        // start position
    var startX = canvasWidth / 2 - enemiesSpace / 2;
    var x = startX;
    var y = MysteryShip.height * 3;

    for (var line = 0 ; line < numberOfLines ; line++)
        {
        var type;

        if ( line === 0 )
            {
            type = ShipType.one;
            }

        else if ( line <= 2 )
            {
            type = ShipType.two;
            }

        else
            {
            type = ShipType.three;
            }

        var typeInfo = Ship.types[ ShipType[ type ] ];

        for (var column = 0 ; column < numberOfColumns ; column++)
            {
            new Ship( x + (Ship.highest_width - typeInfo.width) / 2, y, type );

            x += Ship.highest_width + spaceBetween;
            }

        x = startX;
        y += Ship.height + spaceBetween;
        }

    Ship.findLeftRight();


        // :::: add the bunkers :::: //

        // 4 groups of bunkers
    var groupLength = 4;
    var margin = 50;    // margin between the extremes of the canvas, and the nearby bunker
    var availableWidth = canvasWidth - 2 * margin;
    var groupWidth = 4 * Bunker.width;  // 4 columns per bunker group
    var spaceBetweenBunkers = Math.round( (availableWidth - 4 * groupWidth) / 3 );
    var startingHeight = G.CANVAS_HEIGHT - 70;


    var addBunkerColumn = function( x, y, length )
        {
        for (var b = 0 ; b < length ; b++)
            {
            new Bunker( x, y + b * Bunker.height );
            }
        };

    for (var a = 0 ; a < groupLength ; a++)
        {
        var currentX = margin + a * (groupWidth + spaceBetweenBunkers);

            // each bunker group has this format (each 1 is an individual Bunker)
            // 1111
            // 1111
            // 1  1
        addBunkerColumn( currentX, startingHeight, 3 );
        addBunkerColumn( currentX + Bunker.width, startingHeight, 2 );
        addBunkerColumn( currentX + 2 * Bunker.width, startingHeight, 2 );
        addBunkerColumn( currentX + 3 * Bunker.width, startingHeight, 3 );
        }


        // :::: add the player :::: //

    PLAYER = new Player();

    if ( typeof initialLives !== 'undefined' )
        {
        PLAYER.lives = initialLives;
        }

    GameMenu.updateLives( PLAYER.lives );


        // :::: other configuration :::: //

    if ( typeof initialScore !== 'undefined' )
        {
        SCORE = initialScore;
        }

    else
        {
        SCORE = 0;
        }

    GameMenu.updateScore( SCORE );


    if ( typeof initialTime === 'undefined' )
        {
        initialTime = 0;
        }

    GameMenu.startTimer( initialTime );

    setTempo( INITIAL_TEMPO );

    setTempoLimit();
    setMysteryLimit();
    setFireLimit();

    GameAudio.playSong( INITIAL_TEMPO );

        // set the events
    document.body.addEventListener( 'keydown', keyDownEvent );
    document.body.addEventListener( 'keyup', keyUpEvent );
    document.body.addEventListener( 'click', clickEvent );
    createjs.Ticker.addEventListener( 'tick', Game.tick );
    }


export function restart()
    {
    clear();
    start();
    }


export function victory()
    {
    var previousScore = SCORE;
    var previousLives = PLAYER.lives;
    var previousTime = GameMenu.getCurrentTime();

    clear();
    HighScore.add( previousScore );

    Message.show( 'Victory!\nScore: ' + previousScore, 2000, function()
        {
        start( previousScore, previousLives, previousTime );
        });
    }


export function defeat()
    {
    clear();
    HighScore.add( SCORE );

    Message.show( 'Defeat!\nScore: ' + SCORE, 2000, function()
        {
        start();
        });
    }


function clear()
    {
    createjs.Ticker.removeEventListener( 'tick', Game.tick );
    document.body.removeEventListener( 'keydown', keyDownEvent );
    document.body.removeEventListener( 'keyup', keyUpEvent );
    document.body.removeEventListener( 'click', clickEvent );

    Ship.clear();
    MysteryShip.clear();
    PLAYER.remove();
    Bullet.clear();
    Bunker.clear();
    Message.hide();
    GameMenu.stopTimer();

    GameAudio.stop();
    MOVE_LEFT = false;
    MOVE_RIGHT = false;
    }


function keyDownEvent( event )
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
    }


function keyUpEvent( event )
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
    }


function clickEvent( event )
    {
    var button = event.button;

    if ( button === Utilities.MOUSE_CODE.left )
        {
        PLAYER.fire();
        }
    }


function setMysteryLimit()
    {
    MYSTERY_COUNT = Utilities.getRandomInt( 8000, 15000 );
    }


function setFireLimit()
    {
    FIRE_COUNT = Utilities.getRandomInt( 1000, 3000 );
    }

function setTempoLimit()
    {
    TEMPO_COUNT = TEMPO_LIMIT;
    }


export function setTempo( tempo )
    {
    CURRENT_TEMPO = tempo;

    TEMPO_LIMIT = 60 / CURRENT_TEMPO * 1000;
    }


export function increaseTempo()
    {
    CURRENT_TEMPO += 2;

    setTempo( CURRENT_TEMPO );
    GameAudio.setTempo( CURRENT_TEMPO );
    }


export function addScore( score )
    {
    SCORE += score;

    GameMenu.updateScore( SCORE );
    }


/*
    player bullets can collide with:
        - ships
        - mystery ships
        - bunkers

    ships bullets can collide with:
        - player
        - bunkers
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
            oneWidth = one.getWidth();
            oneHeight = one.getHeight();

            for (b = groupTwo.length - 1 ; b >= 0 ; b--)
                {
                two = groupTwo[ b ];

                if ( Utilities.boxBoxCollision(
                    oneX,       oneY,       oneWidth,       oneHeight,
                    two.getX(), two.getY(), two.getWidth(), two.getHeight()
                        ))
                    {
                    one.tookDamage();
                    two.tookDamage();
                    return true;
                    }
                }
            }

        return false;
        };

    detectCollisions( Bullet.all_player, Ship.all );
    detectCollisions( Bullet.all_player, MysteryShip.all );
    detectCollisions( Bullet.all_player, Bunker.all );
    detectCollisions( Bullet.all_ship, Bunker.all );


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
            bullet.tookDamage();
            PLAYER.tookDamage();
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