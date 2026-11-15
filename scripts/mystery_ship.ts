import * as Engine from "@drk4/game-engine";
import * as Game from "./game";
import { CANVAS_WIDTH } from "./globals";
import { isPastRightEdge, travel } from "./logic/movement";
import { MYSTERY_SHIP_SCORE } from "./logic/scoring";

export class MysteryShip {
    static width = 32;
    static height = 14;
    static all: MysteryShip[] = [];
    static movement_speed = 70;
    private static _container: Engine.Container;

    shape: Engine.Bitmap;
    score: number;

    static init() {
        MysteryShip._container = new Engine.Container();

        Engine.addElement(MysteryShip._container);
    }

    constructor() {
        // starts outside the left side of the canvas, and moves towards the right side
        const shape = new Engine.Bitmap({
            x: -MysteryShip.width / 2,
            y: MysteryShip.height + MysteryShip.height / 2,
            image: Engine.Preload.get("mystery_ship"),
        });

        this.shape = shape;
        this.score = MYSTERY_SHIP_SCORE;

        MysteryShip._container.addChild(shape);

        MysteryShip.all.push(this);
    }

    tookDamage() {
        this.remove();

        Game.addScore(this.score);
    }

    remove() {
        const index = MysteryShip.all.indexOf(this);

        MysteryShip.all.splice(index, 1);

        this.shape.destroy();
    }

    getX() {
        return this.shape.left;
    }

    getY() {
        return this.shape.top;
    }

    getWidth() {
        return MysteryShip.width;
    }

    getHeight() {
        return MysteryShip.height;
    }

    tick(tickMove: number) {
        this.shape.x += tickMove;

        if (isPastRightEdge(this.shape.left, CANVAS_WIDTH)) {
            this.remove();
        }
    }

    static tick(deltaTime: number) {
        const tickMove = travel(MysteryShip.movement_speed, deltaTime);

        for (let a = MysteryShip.all.length - 1; a >= 0; a--) {
            MysteryShip.all[a]!.tick(tickMove);
        }
    }

    static clear() {
        for (let a = MysteryShip.all.length - 1; a >= 0; a--) {
            MysteryShip.all[a]!.remove();
        }
    }
}
