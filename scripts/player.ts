import * as Engine from "@drk4/game-engine";
import { Bullet } from "./bullet";
import * as Game from "./game";
import * as GameMenu from "./game_menu";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./globals";
import { clampPlayerX, travel } from "./logic/movement";
import * as Message from "./message";

export class Player {
    static width = 30;
    static height = 16;
    static movement_speed = 100;
    private static _container: Engine.Container;

    shape: Engine.Bitmap;
    lives: number;

    static init() {
        Player._container = new Engine.Container();

        Engine.addElement(Player._container);
    }

    constructor() {
        // the engine positions the elements by their center
        const shape = new Engine.Bitmap({
            x: CANVAS_WIDTH / 2,
            y: CANVAS_HEIGHT - Player.height / 2,
            image: Engine.Preload.get("cannon"),
        });

        Player._container.addChild(shape);

        this.shape = shape;
        this.lives = 3;
    }

    tookDamage() {
        this.lives--;

        GameMenu.updateLives(this.lives);

        if (this.lives <= 0) {
            Game.defeat();
        } else {
            Message.show("Took damage!", 1000);
        }
    }

    remove() {
        Player._container.removeChild(this.shape);
    }

    fire() {
        new Bullet(this.getCenterX(), this.getCenterY(), true);
    }

    moveLeft(deltaTime: number) {
        const nextX = this.shape.x - travel(Player.movement_speed, deltaTime);

        this.shape.x = clampPlayerX(nextX, Player.width, CANVAS_WIDTH);
    }

    moveRight(deltaTime: number) {
        const nextX = this.shape.x + travel(Player.movement_speed, deltaTime);

        this.shape.x = clampPlayerX(nextX, Player.width, CANVAS_WIDTH);
    }

    /*
    top/left origin
 */

    getX() {
        return this.shape.left;
    }

    /*
    top/left origin
 */

    getY() {
        return this.shape.top;
    }

    getCenterX() {
        return this.shape.x;
    }

    getCenterY() {
        return this.shape.y;
    }
}
