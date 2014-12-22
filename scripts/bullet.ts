enum BulletDirection { top, bottom }

class Bullet
{
static width = 2;
static height = 6;
static _container: createjs.Container;
static all: Bullet[] = [];
static movement_speed = 100;

shape: createjs.Shape;
direction: BulletDirection;

static init( stage )
    {
    Bullet._container = new createjs.Container();

    stage.addChild( Bullet._container );
    }

constructor( x: number, y: number, direction: BulletDirection )
    {
    var shape = new createjs.Shape();

    var g = shape.graphics;

    g.beginFill( 'blue' );
    g.drawRect( 0, 0, Bullet.width, Bullet.height );
    g.endFill();

    shape.x = x;
    shape.y = y;

    this.direction = direction;
    this.shape = shape;

    Bullet._container.addChild( shape );

    Bullet.all.push( this );
    }

remove()
    {
    var index = Bullet.all.indexOf( this );

    Bullet.all.splice( index, 1 );

    Bullet._container.removeChild( this.shape );
    }

tick( tickMove )
    {
    if ( this.direction === BulletDirection.top )
        {
        this.shape.y -= tickMove;

        if ( this.shape.y < 0 )
            {
            this.remove();
            }
        }

        // bottom
    else
        {
        this.shape.y += tickMove;

        if ( this.shape.y > G.CANVAS_HEIGHT )
            {
            this.remove();
            }
        }
    }

static tick( event )
    {
        // how much each bullet moves per tick
    var tickMove = Bullet.movement_speed * event.delta / 1000;

    for (var a = Bullet.all.length - 1 ; a >= 0 ; a--)
        {
        Bullet.all[ a ].tick( tickMove );
        }
    }
}