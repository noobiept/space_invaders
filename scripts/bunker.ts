class Bunker
{
static width = 10;
static height = 10;
static _container: createjs.Container;
static all: Bunker[] = [];

shape: createjs.Shape;
health: number;


static init( stage )
    {
    Bunker._container = new createjs.Container();

    stage.addChild( Bunker._container );
    }


constructor( x, y )
    {
    var shape = new createjs.Shape();

    var g = shape.graphics;

    g.beginFill( 'green' );
    g.drawRect( 0, 0, Bunker.width, Bunker.height );
    g.endFill();

    shape.x = x;
    shape.y = y;

    this.shape = shape;
    this.health = 4;

    Bunker._container.addChild( shape );
    Bunker.all.push( this );
    }


tookDamage()
    {
    this.health -= 1;

    if ( this.health <= 0 )
        {
        this.remove();
        }
    }


remove()
    {
    var index = Bunker.all.indexOf( this );

    Bunker.all.splice( index, 1 );
    Bunker._container.removeChild( this.shape );
    }


getX()
    {
    return this.shape.x;
    }


getY()
    {
    return this.shape.y;
    }


static clear()
    {
    for (var a = Bunker.all.length - 1 ; a >= 0 ; a--)
        {
        Bunker.all[ a ].remove();
        }
    }
}