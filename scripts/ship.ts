enum ShipType { one, two, three }

class Ship
{
static width = 20;
static height = 16;
static _container: createjs.Container;
static all: Ship[] = [];
static movement_speed = 100;
static furthest_left: Ship;
static furthest_right: Ship;
static moving_right = true;

shape: createjs.Bitmap;
score: number;
images: HTMLImageElement[];
current_image: number;  // position in the images array


static init( stage )
    {
    Ship._container = new createjs.Container();

    stage.addChild( Ship._container );
    }

constructor( x: number, y: number, type: ShipType )
    {
    var image1, image2;

    if ( type === ShipType.one )
        {
        this.score = 40;

        image1 = G.PRELOAD.getResult( 'ship_one_1' );
        image2 = G.PRELOAD.getResult( 'ship_one_2' );
        }

    else if ( type === ShipType.two )
        {
        this.score = 20;

        image1 = G.PRELOAD.getResult( 'ship_two_1' );
        image2 = G.PRELOAD.getResult( 'ship_two_2' );
        }

        // type three
    else
        {
        this.score = 10;

        image1 = G.PRELOAD.getResult( 'ship_three_1' );
        image2 = G.PRELOAD.getResult( 'ship_three_2' );
        }


    this.images = [ image1, image2 ];
    this.current_image = 0;

    var shape = new createjs.Bitmap( this.images[ this.current_image ] );

    shape.x = x;
    shape.y = y;

    this.shape = shape;

    Ship._container.addChild( shape );

    Ship.all.push( this );
    }


tookDamage()
    {
    this.remove();

    Game.increaseTempo();
    Game.addScore( this.score );

    Ship.findLeftRight();

    if ( Ship.all.length === 0 )
        {
        Game.victory();
        }
    }


remove()
    {
    var index = Ship.all.indexOf( this );

    Ship.all.splice( index, 1 );

    Ship._container.removeChild( this.shape );
    }


fire()
    {
    var bulletX = this.shape.x + Ship.width / 2 - Bullet.width / 2;
    var bulletY = this.shape.y + Ship.height / 2 - Bullet.height / 2;

    new Bullet( bulletX, bulletY, false );
    }


getX()
    {
    return this.shape.x;
    }


getY()
    {
    return this.shape.y;
    }


tick( tickMove )
    {
    if ( Ship.moving_right )
        {
        this.shape.x += tickMove;
        }

    else
        {
        this.shape.x -= tickMove;
        }

    this.current_image++;

    if ( this.current_image >= this.images.length )
        {
        this.current_image = 0;
        }

    this.shape.image = this.images[ this.current_image ];
    }

/*
    Find the enemy that is most to the right, and the one that is most to the left
 */

static findLeftRight()
    {
    var all = Ship.all;
    var furthestLeft = all[ 0 ];
    var furthestRight = furthestLeft;
    var length = all.length;

    for (var a = 1 ; a < length ; a++)
        {
        var enemy = all[ a ];

        if ( enemy.shape.x < furthestLeft.shape.x )
            {
            furthestLeft = enemy;
            }

        if ( enemy.shape.x > furthestRight.shape.x )
            {
            furthestRight = enemy;
            }
        }

    Ship.furthest_left = furthestLeft;
    Ship.furthest_right = furthestRight
    }


/*
    Moves all ships one line down (called when we reach an extremity of the canvas)
 */

static moveOneLineDown()
    {
    var highestY = 0;
    var y = 0;
    var ship;

    for (var a = Ship.all.length - 1 ; a >= 0 ; a--)
        {
        ship = Ship.all[ a ];

        y = ship.shape.y + Ship.height;

        ship.shape.y = y;

        if ( y > highestY )
            {
            highestY = y;
            }
        }

        // determine if the alien invasion is successful (reached the player)
    if ( highestY > G.CANVAS_HEIGHT - 100 )
        {
        Game.defeat();
        }
    }


static tick( event )
    {
        // determine if we reach the extremes of the canvas, and if so, need to change direction
    var limit = 10;

    if ( Ship.moving_right )
        {
        if ( Ship.furthest_right.shape.x > G.CANVAS_WIDTH - Ship.width - limit )
            {
            Ship.moving_right = false;
            Ship.moveOneLineDown();
            return;
            }
        }

    else
        {
        if ( Ship.furthest_left.shape.x < limit )
            {
            Ship.moving_right = true;
            Ship.moveOneLineDown();
            return;
            }
        }


     var tickMove = Ship.movement_speed * event.delta / 1000;

    for (var a = Ship.all.length - 1 ; a >= 0 ; a--)
        {
        Ship.all[ a ].tick( tickMove );
        }
    }


static clear()
    {
    for (var a = Ship.all.length - 1 ; a >= 0 ; a--)
        {
        Ship.all[ a ].remove();
        }

    Ship.moving_right = true;
    }
}