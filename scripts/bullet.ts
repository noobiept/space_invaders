import * as Engine from "@drk4/game-engine";
import * as Game from "./game";
import { CANVAS_HEIGHT } from "./globals";

export enum BulletDirection {
    top,
    bottom,
}

export class Bullet {
    static width = 2;
    static height = 6;
    static all_player: Bullet[] = []; // all the bullets fired by the player
    static all_ship: Bullet[] = []; // all the bullets fired by an enemy ship
    static movement_speed = 200;
    private static _container: Engine.Container;

    shape: Engine.Rectangle;
    direction: BulletDirection;
    from_player: boolean;

    static init() {
        Bullet._container = new Engine.Container();

        Engine.addElement(Bullet._container);
    }

    /**
     * The `x`/`y` position refers to the center of the bullet.
     */
    constructor(x: number, y: number, fromPlayer: boolean) {
        const shape = new Engine.Rectangle({
            x: x,
            y: y,
            width: Bullet.width,
            height: Bullet.height,
            color: "blue",
        });

        this.shape = shape;
        this.from_player = fromPlayer;

        Bullet._container.addChild(shape);

        if (fromPlayer === true) {
            this.direction = BulletDirection.top;

            Bullet.all_player.push(this);

            Game.addScore(-5);
        } else {
            this.direction = BulletDirection.bottom;

            Bullet.all_ship.push(this);
        }
    }

    tookDamage() {
        this.remove();
    }

    remove() {
        const all = this.from_player === true ? Bullet.all_player : Bullet.all_ship;
        const index = all.indexOf(this);

        all.splice(index, 1);

        Bullet._container.removeChild(this.shape);
    }

    getX() {
        return this.shape.left;
    }

    getY() {
        return this.shape.top;
    }

    getWidth() {
        return Bullet.width;
    }

    getHeight() {
        return Bullet.height;
    }

    tick(tickMove: number) {
        if (this.direction === BulletDirection.top) {
            this.shape.y -= tickMove;

            if (this.shape.top < 0) {
                this.remove();
            }
        }

        // bottom
        else {
            this.shape.y += tickMove;

            if (this.shape.top > CANVAS_HEIGHT) {
                this.remove();
            }
        }
    }

    static tick(deltaTime: number) {
        // how much each bullet moves per tick
        const tickMove = Bullet.movement_speed * deltaTime;
        let a;

        for (a = Bullet.all_player.length - 1; a >= 0; a--) {
            Bullet.all_player[a]!.tick(tickMove);
        }

        for (a = Bullet.all_ship.length - 1; a >= 0; a--) {
            Bullet.all_ship[a]!.tick(tickMove);
        }
    }

    static clear() {
        let a;

        for (a = Bullet.all_player.length - 1; a >= 0; a--) {
            Bullet.all_player[a]!.remove();
        }

        for (a = Bullet.all_ship.length - 1; a >= 0; a--) {
            Bullet.all_ship[a]!.remove();
        }
    }
}
