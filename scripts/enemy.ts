class Enemy
{
static width = 20;
static height = 20;
static _container: createjs.Container;
static all_enemies: Enemy[] = [];
static movement_speed = 100;
static furthest_left: Enemy;
static furthest_right: Enemy;
static moving_right = true;

shape: createjs.Shape;

static init( stage )
    {
    Enemy._container = new createjs.Container();

    stage.addChild( Enemy._container );
    }

constructor( x: number, y: number )
    {
    var shape = new createjs.Shape();

    var g = shape.graphics;

    g.beginFill( 'red' );
    g.drawRect( 0, 0, Enemy.width, Enemy.height );
    g.endFill();

    shape.x = x;
    shape.y = y;

    this.shape = shape;

    Enemy._container.addChild( shape );

    Enemy.all_enemies.push( this );
    }

remove()
    {
    var index = Enemy.all_enemies.indexOf( this );

    Enemy.all_enemies.splice( index, 1 );

    Enemy._container.removeChild( this.shape );
    }


tick( tickMove )
    {
    if ( Enemy.moving_right )
        {
        this.shape.x += tickMove;
        }

    else
        {
        this.shape.x -= tickMove;
        }
    }

/*
    Find the enemy that is most to the right, and the one that is most to the left
 */

static findLeftRight()
    {
    var all = Enemy.all_enemies;
    var furthestLeft = all[ 0 ];
    var furthestRight = furthestLeft;
    var length = all.length;

    for (var a = 1 ; a < length ; a++)
        {
        var enemy = all[ a ];

        if ( enemy.shape.x < furthestLeft.shape.x )
            {
            furthestLeft = enemy;
            }

        if ( enemy.shape.x > furthestRight.shape.x )
            {
            furthestRight = enemy;
            }
        }

    Enemy.furthest_left = furthestLeft;
    Enemy.furthest_right = furthestRight
    }


/*
    Moves all ships one line down (called when we reach an extremity of the canvas)
 */

static moveOneLineDown()
    {
    for (var a = Enemy.all_enemies.length - 1 ; a >= 0 ; a--)
        {
        Enemy.all_enemies[ a ].shape.y += Enemy.height;
        }
    }


static tick( event )
    {
    var tickMove = Enemy.movement_speed * event.delta / 1000;

    for (var a = Enemy.all_enemies.length - 1 ; a >= 0 ; a--)
        {
        Enemy.all_enemies[ a ].tick( tickMove );
        }


        // determine if we reach the extremes of the canvas, and if so, need to change direction
    var limit = 10;

    if ( Enemy.moving_right )
        {
        if ( Enemy.furthest_right.shape.x > G.CANVAS_WIDTH - Enemy.width - limit )
            {
            Enemy.moving_right = false;
            Enemy.moveOneLineDown();
            }
        }

    else
        {
        if ( Enemy.furthest_left.shape.x < limit )
            {
            Enemy.moving_right = true;
            Enemy.moveOneLineDown();
            }
        }
    }
}