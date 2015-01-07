enum BulletDirection { top, bottom }

class Bullet
{
static width = 2;
static height = 6;
static _container: createjs.Container;
static all_player: Bullet[] = [];   // all the bullets fired by the player
static all_ship: Bullet[] = [];     // all the bullets fired by an enemy ship
static movement_speed = 150;

shape: createjs.Shape;
direction: BulletDirection;
from_player: boolean;

static init( stage )
    {
    Bullet._container = new createjs.Container();

    stage.addChild( Bullet._container );
    }

constructor( x: number, y: number, fromPlayer: boolean )
    {
    var shape = new createjs.Shape();

    var g = shape.graphics;

    g.beginFill( 'blue' );
    g.drawRect( 0, 0, Bullet.width, Bullet.height );
    g.endFill();

    shape.x = x;
    shape.y = y;

    this.shape = shape;
    this.from_player = fromPlayer;

    Bullet._container.addChild( shape );

    if ( fromPlayer === true )
        {
        this.direction = BulletDirection.top;

        Bullet.all_player.push( this );
        }

    else
        {
        this.direction = BulletDirection.bottom;

        Bullet.all_ship.push( this );
        }
    }

remove()
    {
    var all;

    if ( this.from_player === true )
        {
        all = Bullet.all_player;
        }

    else
        {
        all = Bullet.all_ship;
        }

    var index = all.indexOf( this );

    all.splice( index, 1 );

    Bullet._container.removeChild( this.shape );
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
    var a;

    for (a = Bullet.all_player.length - 1 ; a >= 0 ; a--)
        {
        Bullet.all_player[ a ].tick( tickMove );
        }

    for (a = Bullet.all_ship.length - 1 ; a >= 0 ; a--)
        {
        Bullet.all_ship[ a ].tick( tickMove );
        }
    }


static clear()
    {
    var a;

    for (a = Bullet.all_player.length - 1 ; a >= 0 ; a--)
        {
        Bullet.all_player[ a ].remove();
        }

    for (a = Bullet.all_ship.length - 1 ; a >= 0 ; a--)
        {
        Bullet.all_ship[ a ].remove();
        }
    }
}