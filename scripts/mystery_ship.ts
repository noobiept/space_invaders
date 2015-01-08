class MysteryShip
{
static width = 32;
static height = 14;
static _container: createjs.Container;
static all: MysteryShip[] = [];
static movement_speed = 70;

shape: createjs.Bitmap;
score: number;

static init( stage )
    {
    MysteryShip._container = new createjs.Container();

    stage.addChild( MysteryShip._container );
    }

constructor()
    {
    var shape = new createjs.Bitmap( G.PRELOAD.getResult( 'mystery_ship' ) );

        // starts outside the left side of the canvas, and moves towards the right side
    shape.x = -MysteryShip.width;
    shape.y = MysteryShip.height;

    this.shape = shape;
    this.score = 100;

    MysteryShip._container.addChild( shape );

    MysteryShip.all.push( this );
    }


tookDamage()
    {
    this.remove();

    Game.addScore( this.score );
    }


remove()
    {
    var index = MysteryShip.all.indexOf( this );

    MysteryShip.all.splice( index, 1 );

    MysteryShip._container.removeChild( this.shape );
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
    var nextX = this.shape.x + tickMove;

    this.shape.x = nextX;

    if ( nextX > G.CANVAS_WIDTH )
        {
        this.remove();
        }
    }

static tick( event )
    {
    var tickMove = MysteryShip.movement_speed * event.delta / 1000;

    for (var a = MysteryShip.all.length - 1 ; a >= 0 ; a--)
        {
        MysteryShip.all[ a ].tick( tickMove );
        }
    }


static clear()
    {
    for (var a = MysteryShip.all.length - 1 ; a >= 0 ; a--)
        {
        MysteryShip.all[ a ].remove();
        }
    }
}