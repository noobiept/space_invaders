import * as Engine from "@drk4/game-engine";
import { Bullet } from "./bullet";
import * as Game from "./game";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./globals";

export enum ShipType { one, two, three }

export type ShipTypeName = "one" | "two" | "three";

export interface ShipTypeInfo {
    score: number;
    width: number;
}

export class Ship
{
static all: Ship[] = [];
static initial_max_speed = 1000;
static speed_increase_per_level = 100;
static current_max_speed = Ship.initial_max_speed;    // the speed will increase the higher the game level
static speed_decrease = 15;     // per ship in the current level
static furthest_left: Ship;
static furthest_right: Ship;
static moving_right = true;
static types: Record<ShipTypeName, ShipTypeInfo> = {
        one: {
            score: 40,
            width: 16
        },
        two: {
            score: 20,
            width: 22
        },
        three: {
            score: 10,
            width: 24
        }
    };

static highest_width = 24;  // the width is different for all ship types, this has the highest
static height = 16; // height is the same for all the ships, but not width
private static _container: Engine.Container;

shape: Engine.Bitmap;
score: number;
images: HTMLImageElement[];
current_image: number;  // position in the images array
width: number;


static init()
    {
    Ship._container = new Engine.Container();

    Engine.addElement( Ship._container );
    }


/**
 * The `x`/`y` position refers to the center of the ship.
 */
constructor( x: number, y: number, type: ShipType )
    {
    const typeName = ShipType[ type ] as ShipTypeName;
    const typeInfo = Ship.types[ typeName ];

    this.width = typeInfo.width;
    this.score = typeInfo.score;
    this.images = [
        Engine.Preload.get( "ship_" + typeName + "_1" ),
        Engine.Preload.get( "ship_" + typeName + "_2" )
    ];

    this.current_image = 0;

    const shape = new Engine.Bitmap({
            x: x,
            y: y,
            image: this.images[ this.current_image ]!,
        });

    this.shape = shape;

    Ship._container.addChild( shape );

    Ship.all.push( this );
    }


tookDamage()
    {
    this.remove();

    Game.increaseTempo();
    Game.addScore( this.score );

    Ship.findLeftRight();

    if ( Ship.all.length === 0 )
        {
        Game.victory();
        }
    }


remove()
    {
    const index = Ship.all.indexOf( this );

    Ship.all.splice( index, 1 );

    Ship._container.removeChild( this.shape );
    }


fire()
    {
    new Bullet( this.shape.x, this.shape.y, false );
    }


getX()
    {
    return this.shape.left;
    }


getY()
    {
    return this.shape.top;
    }


getWidth()
    {
    return this.width;
    }


getHeight()
    {
    return Ship.height;
    }


tick( tickMove: number )
    {
    if ( Ship.moving_right )
        {
        this.shape.x += tickMove;
        }

    else
        {
        this.shape.x -= tickMove;
        }

    this.current_image++;

    if ( this.current_image >= this.images.length )
        {
        this.current_image = 0;
        }

    this.shape.image = this.images[ this.current_image ]!;
    }

/*
    Find the enemy that is most to the right, and the one that is most to the left
 */

static findLeftRight()
    {
    const all = Ship.all;

    if ( all.length === 0 )
        {
        return;
        }

    let furthestLeft = all[ 0 ]!;
    let furthestRight = furthestLeft;
    const length = all.length;

    for (let a = 1 ; a < length ; a++)
        {
        const enemy = all[ a ]!;

        if ( enemy.shape.left < furthestLeft.shape.left )
            {
            furthestLeft = enemy;
            }

        if ( enemy.shape.left > furthestRight.shape.left )
            {
            furthestRight = enemy;
            }
        }

    Ship.furthest_left = furthestLeft;
    Ship.furthest_right = furthestRight;
    }


/*
    Moves all ships one line down (called when we reach an extremity of the canvas)
 */

static moveOneLineDown()
    {
    let highestY = 0;

    for (let a = Ship.all.length - 1 ; a >= 0 ; a--)
        {
        const ship = Ship.all[ a ]!;

        ship.shape.y += Ship.height;

        if ( ship.shape.top > highestY )
            {
            highestY = ship.shape.top;
            }
        }

        // determine if the alien invasion is successful (reached the player)
    if ( highestY > CANVAS_HEIGHT - 90 )
        {
        Game.defeat();
        }
    }


static tick( deltaTime: number )
    {
        // determine if we reach the extremes of the canvas, and if so, need to change direction
    const limit = 10;

    if ( Ship.moving_right )
        {
        if ( Ship.furthest_right.shape.left > CANVAS_WIDTH - Ship.highest_width - limit )
            {
            Ship.moving_right = false;
            Ship.moveOneLineDown();
            return;
            }
        }

    else
        {
        if ( Ship.furthest_left.shape.left < limit )
            {
            Ship.moving_right = true;
            Ship.moveOneLineDown();
            return;
            }
        }

    const length = Ship.all.length;
    const tickMove = (Ship.current_max_speed - length * Ship.speed_decrease) * deltaTime;

    for (let a = length - 1 ; a >= 0 ; a--)
        {
        Ship.all[ a ]!.tick( tickMove );
        }
    }


static clear()
    {
    for (let a = Ship.all.length - 1 ; a >= 0 ; a--)
        {
        Ship.all[ a ]!.remove();
        }

    Ship.moving_right = true;
    }
}
