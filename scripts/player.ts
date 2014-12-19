class Player
{
static width = 10;
static height = 10;
static _container: createjs.Container;
static movement_speed = 80;

shape: createjs.Shape;
width: number;
height: number;


static init( stage )
    {
    Player._container = new createjs.Container();

    stage.addChild( Player._container );
    }

constructor()
    {
    var shape = new createjs.Shape();

    var width = 10;
    var height = 10;

    var g = shape.graphics;

    g.beginFill( 'green' );
    g.drawRect( 0, 0, width, height );
    g.endFill();

    var canvas = G.STAGE.canvas;

    shape.x = canvas.width / 2 - width / 2;
    shape.y = canvas.height - height;

    Player._container.addChild( shape );

    this.shape = shape;
    this.width = width;
    this.height = height;
    }

remove()
    {
    Player._container.removeChild( this.shape );
    }

moveLeft( event )
    {
    var nextX = this.shape.x - Player.movement_speed * event.delta / 1000;

    if ( nextX < 0 )
        {
        nextX = 0;
        }

    this.shape.x = nextX;
    }

moveRight( event )
    {
    var nextX = this.shape.x + Player.movement_speed * event.delta / 1000;

    var canvasWidth = G.STAGE.canvas.width;
    var limit = canvasWidth - this.width;

    if ( nextX > limit )
        {
        nextX = limit;
        }

    this.shape.x = nextX;
    }

/*
    top/left origin
 */

getX()
    {
    return this.shape.x;
    }

/*
    top/left origin
 */

getY()
    {
    return this.shape.y;
    }

getCenterX()
    {
    return this.shape.x + this.width / 2;
    }

getCenterY()
    {
    return this.shape.y + this.height / 2;
    }

tick( event )
    {

    }
}