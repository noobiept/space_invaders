class Player
{
static width = 30;
static height = 16;
static _container: createjs.Container;
static movement_speed = 80;

shape: createjs.Bitmap;
lives: number;


static init( stage )
    {
    Player._container = new createjs.Container();

    stage.addChild( Player._container );
    }


constructor()
    {
    var shape = new createjs.Bitmap( G.PRELOAD.getResult( 'cannon' ) );

    shape.x = G.CANVAS_WIDTH / 2 - Player.width / 2;
    shape.y = G.CANVAS_HEIGHT - Player.height;

    Player._container.addChild( shape );

    this.shape = shape;
    this.lives = 3;
    }


tookDamage()
    {
    this.lives--;

    GameMenu.updateLives( this.lives );

    if ( this.lives <= 0 )
        {
        Game.defeat();
        }

    else
        {
        Message.show( 'Took damage!', 1000 );
        }
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