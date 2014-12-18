class Bullet
{
static width = 2;
static height = 6;
static _container: createjs.Container;
static all_bullets: Bullet[] = [];

shape: createjs.Shape;
movement_speed: number;

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
    this.movement_speed = 20;   //HERE

    Bullet._container.addChild( shape );

    Bullet.all_bullets.push( this );
    }

remove()
    {
    var index = Bullet.all_bullets.indexOf( this );

    Bullet.all_bullets.splice( index, 1 );

    Bullet._container.removeChild( this.shape );
    }

tick( event )
    {
    this.shape.y -= this.movement_speed;

    if ( this.shape.y < 0 )
        {
        this.remove();
        }
    }

static tick( event )
    {
    for (var a = Bullet.all_bullets.length - 1 ; a >= 0 ; a--)
        {
        Bullet.all_bullets[ a ].tick( event );
        }
    }
}