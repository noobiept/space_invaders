class Player
{
static width = 20;
static height = 10;
static _container: createjs.Container;
static movement_speed = 80;

shape: createjs.Shape;


static init( stage )
    {
    Player._container = new createjs.Container();

    stage.addChild( Player._container );
    }


constructor()
    {
    var shape = new createjs.Shape();

    var g = shape.graphics;

    g.beginFill( 'green' );
    g.drawRect( 0, 0, Player.width, Player.height );
    g.endFill();

    var canvas = G.STAGE.canvas;

    shape.x = canvas.width / 2 - Player.width / 2;
    shape.y = canvas.height - Player.height;

    Player._container.addChild( shape );

    this.shape = shape;
    }


tookDamage()
    {
    console.log( 'Took damage!' );
    }


remove()
    {
    Player._container.removeChild( this.shape );
    }


fire()
    {
    var bulletX = this.getCenterX() - Bullet.width / 2;
    var bulletY = this.getCenterY() - Bullet.height / 2;

    new Bullet( bulletX, bulletY, true );
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
    var limit = canvasWidth - Player.width;

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
    return this.shape.x + Player.width / 2;
    }

getCenterY()
    {
    return this.shape.y + Player.height / 2;
    }

tick( event )
    {

    }
}