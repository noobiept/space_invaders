class Bullet
{
static width = 2;
static height = 6;
static _container: createjs.Container;
static all_bullets: Bullet[] = [];
static movement_speed = 100;

shape: createjs.Shape;

static init( stage )
    {
    Bullet._container = new createjs.Container();

    stage.addChild( Bullet._container );
    }

constructor( x: number, y: number )
    {
    var shape = new createjs.Shape();

    var g = shape.graphics;

    g.beginFill( 'blue' );
    g.drawRect( 0, 0, Bullet.width, Bullet.height );
    g.endFill();

    shape.x = x;
    shape.y = y;

    this.shape = shape;

    Bullet._container.addChild( shape );

    Bullet.all_bullets.push( this );
    }

remove()
    {
    var index = Bullet.all_bullets.indexOf( this );

    Bullet.all_bullets.splice( index, 1 );

    Bullet._container.removeChild( this.shape );
    }

tick( tickMove )
    {
    this.shape.y -= tickMove;

    if ( this.shape.y < 0 )
        {
        this.remove();
        }
    }

static tick( event )
    {
        // how much each bullet moves per tick
    var tickMove = Bullet.movement_speed * event.delta / 1000;

    for (var a = Bullet.all_bullets.length - 1 ; a >= 0 ; a--)
        {
        Bullet.all_bullets[ a ].tick( tickMove );
        }
    }
}