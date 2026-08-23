import * as Engine from "@drk4/game-engine";

export class Bunker {
    static width = 12;
    static height = 12;
    static all: Bunker[] = [];
    private static _container: Engine.Container;

    shape: Engine.Bitmap;
    health: number;

    static init() {
        Bunker._container = new Engine.Container();

        Engine.addElement(Bunker._container);
    }

    /**
     * The `x`/`y` position refers to the center of the bunker.
     */
    constructor(x: number, y: number) {
        this.health = 4;

        const shape = new Engine.Bitmap({
            x: x,
            y: y,
            image: Engine.Preload.get("bunker_" + this.health),
        });

        this.shape = shape;

        Bunker._container.addChild(shape);
        Bunker.all.push(this);
    }

    tookDamage() {
        this.health -= 1;

        if (this.health <= 0) {
            this.remove();
        } else {
            this.shape.image = Engine.Preload.get("bunker_" + this.health);
        }
    }

    remove() {
        const index = Bunker.all.indexOf(this);

        Bunker.all.splice(index, 1);
        Bunker._container.removeChild(this.shape);
    }

    getX() {
        return this.shape.left;
    }

    getY() {
        return this.shape.top;
    }

    getWidth() {
        return Bunker.width;
    }

    getHeight() {
        return Bunker.height;
    }

    static clear() {
        for (let a = Bunker.all.length - 1; a >= 0; a--) {
            Bunker.all[a]!.remove();
        }
    }
}
