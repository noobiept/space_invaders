class Bunker
{
static width = 12;
static height = 12;
static _container: createjs.Container;
static all: Bunker[] = [];

shape: createjs.Bitmap;
health: number;


static init( stage )
    {
    Bunker._container = new createjs.Container();

    stage.addChild( Bunker._container );
    }


constructor( x, y )
    {
    this.health = 4;

    var shape = new createjs.Bitmap( G.PRELOAD.getResult( 'bunker_' + this.health ) );

    shape.x = x;
    shape.y = y;

    this.shape = shape;

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

    else
        {
        this.shape.image = G.PRELOAD.getResult( 'bunker_' + this.health );
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


getWidth()
    {
    return Bunker.width;
    }


getHeight()
    {
    return Bunker.height;
    }


static clear()
    {
    for (var a = Bunker.all.length - 1 ; a >= 0 ; a--)
        {
        Bunker.all[ a ].remove();
        }
    }
}