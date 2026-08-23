import * as Engine from "@drk4/game-engine";
import { MouseButton, boxBoxCollision, getRandomInt } from "@drk4/utilities";
import { Bullet } from "./bullet";
import { Bunker } from "./bunker";
import * as GameAudio from "./game_audio";
import * as GameMenu from "./game_menu";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./globals";
import * as HighScore from "./high_score";
import * as Message from "./message";
import { MysteryShip } from "./mystery_ship";
import { Player } from "./player";
import { Ship, ShipType } from "./ship";

/**
 * Anything that can collide with something else.
 */
interface Collidable {
    getX(): number;
    getY(): number;
    getWidth(): number;
    getHeight(): number;
    tookDamage(): void;
}

// tells if we need to move the player to the left or right (if the key is being pressed)
let MOVE_LEFT = false;
let MOVE_RIGHT = false;

let PLAYER!: Player;
let SCORE = 0;

// the tempo of the song/game (the movement of the enemies follow the tempo as well)
// the ships move every 'TEMPO_LIMIT' milliseconds
let TEMPO_COUNT = 0;
let TEMPO_LIMIT = 0;
const INITIAL_TEMPO = 100; // initial tempo of the game (before any ship is destroyed)
let CURRENT_TEMPO = 0;

// when to spawn a mystery ship, the count is a random value assigned later
let MYSTERY_COUNT = 0;

// time until a random ship fires a bullet
let FIRE_COUNT = 0; // its assigned randomly

/*
    Starts a new game.

    The score/lives of a previously played game can be pass on to the next game (in case the previous one was won).
    Otherwise, start from 0 score.
 */

export function start(
    initialScore?: number,
    initialLives?: number,
    initialTime?: number,
    maxShipSpeed?: number,
) {
    // :::: add the enemy ships :::: //
    const numberOfLines = 5;
    const numberOfColumns = 11;
    const spaceBetween = 10;
    const canvasWidth = CANVAS_WIDTH;
    const enemiesSpace =
        numberOfColumns * Ship.highest_width + (numberOfColumns - 1) * spaceBetween;

    // start position (top/left of the enemies block)
    const startX = canvasWidth / 2 - enemiesSpace / 2;
    let x = startX;
    let y = MysteryShip.height * 3;

    if (typeof maxShipSpeed === "undefined") {
        Ship.current_max_speed = Ship.initial_max_speed;
    } else {
        Ship.current_max_speed = maxShipSpeed;
    }

    for (let line = 0; line < numberOfLines; line++) {
        let type: ShipType;

        if (line === 0) {
            type = ShipType.one;
        } else if (line <= 2) {
            type = ShipType.two;
        } else {
            type = ShipType.three;
        }

        for (let column = 0; column < numberOfColumns; column++) {
            // the ships are centered within the widest ship's width
            new Ship(x + Ship.highest_width / 2, y + Ship.height / 2, type);

            x += Ship.highest_width + spaceBetween;
        }

        x = startX;
        y += Ship.height + spaceBetween;
    }

    Ship.findLeftRight();

    // :::: add the bunkers :::: //

    // 4 groups of bunkers
    const groupLength = 4;
    const margin = 50; // margin between the extremes of the canvas, and the nearby bunker
    const availableWidth = canvasWidth - 2 * margin;
    const groupWidth = 4 * Bunker.width; // 4 columns per bunker group
    const spaceBetweenBunkers = Math.round((availableWidth - 4 * groupWidth) / 3);
    const startingHeight = CANVAS_HEIGHT - 70;

    const addBunkerColumn = function (columnX: number, columnY: number, length: number) {
        for (let b = 0; b < length; b++) {
            new Bunker(columnX + Bunker.width / 2, columnY + b * Bunker.height + Bunker.height / 2);
        }
    };

    for (let a = 0; a < groupLength; a++) {
        const currentX = margin + a * (groupWidth + spaceBetweenBunkers);

        // each bunker group has this format (each 1 is an individual Bunker)
        // 1111
        // 1111
        // 1  1
        addBunkerColumn(currentX, startingHeight, 3);
        addBunkerColumn(currentX + Bunker.width, startingHeight, 2);
        addBunkerColumn(currentX + 2 * Bunker.width, startingHeight, 2);
        addBunkerColumn(currentX + 3 * Bunker.width, startingHeight, 3);
    }

    // :::: add the player :::: //

    PLAYER = new Player();

    if (typeof initialLives !== "undefined") {
        PLAYER.lives = initialLives;
    }

    GameMenu.updateLives(PLAYER.lives);

    // :::: other configuration :::: //

    if (typeof initialScore !== "undefined") {
        SCORE = initialScore;
    } else {
        SCORE = 0;
    }

    GameMenu.updateScore(SCORE);

    if (typeof initialTime === "undefined") {
        initialTime = 0;
    }

    GameMenu.startTimer(initialTime);

    setTempo(INITIAL_TEMPO);

    setTempoLimit();
    setMysteryLimit();
    setFireLimit();

    GameAudio.playSong(INITIAL_TEMPO);

    // set the events
    document.body.addEventListener("keydown", keyDownEvent);
    document.body.addEventListener("keyup", keyUpEvent);
    document.body.addEventListener("click", clickEvent);
    Engine.addToGameLoop(tick);
}

export function restart() {
    clear();
    start();
}

export function victory() {
    const previousScore = SCORE;
    const previousLives = PLAYER.lives;
    const previousTime = GameMenu.getCurrentTime();

    clear();
    HighScore.add(previousScore);

    Message.show("Victory!\nScore: " + previousScore, 2000, function () {
        start(
            previousScore,
            previousLives,
            previousTime,
            Ship.current_max_speed + Ship.speed_increase_per_level,
        );
    });
}

export function defeat() {
    clear();
    HighScore.add(SCORE);

    Message.show("Defeat!\nScore: " + SCORE, 2000, function () {
        start();
    });
}

function clear() {
    Engine.removeFromGameLoop(tick);
    document.body.removeEventListener("keydown", keyDownEvent);
    document.body.removeEventListener("keyup", keyUpEvent);
    document.body.removeEventListener("click", clickEvent);

    Ship.clear();
    MysteryShip.clear();
    PLAYER.remove();
    Bullet.clear();
    Bunker.clear();
    Message.hide();
    GameMenu.stopTimer();

    GameAudio.stop();
    MOVE_LEFT = false;
    MOVE_RIGHT = false;
}

function keyDownEvent(event: KeyboardEvent) {
    const code = event.code;

    if (code === "ArrowLeft" || code === "KeyA") {
        MOVE_LEFT = true;
    } else if (code === "ArrowRight" || code === "KeyD") {
        MOVE_RIGHT = true;
    }
}

function keyUpEvent(event: KeyboardEvent) {
    const code = event.code;

    if (code === "ArrowLeft" || code === "KeyA") {
        MOVE_LEFT = false;
    } else if (code === "ArrowRight" || code === "KeyD") {
        MOVE_RIGHT = false;
    } else if (code === "Space") {
        PLAYER.fire();
    }
}

function clickEvent(event: MouseEvent) {
    if (event.button === MouseButton.left) {
        PLAYER.fire();
    }
}

function setMysteryLimit() {
    MYSTERY_COUNT = getRandomInt(8000, 15000);
}

function setFireLimit() {
    FIRE_COUNT = getRandomInt(1000, 2500);
}

function setTempoLimit() {
    TEMPO_COUNT = TEMPO_LIMIT;
}

export function setTempo(tempo: number) {
    CURRENT_TEMPO = tempo;

    TEMPO_LIMIT = (60 / CURRENT_TEMPO) * 1000;
}

export function increaseTempo() {
    CURRENT_TEMPO += 2;

    setTempo(CURRENT_TEMPO);
    GameAudio.setTempo(CURRENT_TEMPO);
}

export function addScore(score: number) {
    SCORE += score;

    GameMenu.updateScore(SCORE);
}

/*
    player bullets can collide with:
        - ships
        - mystery ships
        - bunkers

    ships bullets can collide with:
        - player
        - bunkers
 */

function collisionDetection() {
    const detectCollisions = function (groupOne: Collidable[], groupTwo: Collidable[]) {
        for (let a = groupOne.length - 1; a >= 0; a--) {
            const one = groupOne[a]!;
            const oneX = one.getX();
            const oneY = one.getY();
            const oneWidth = one.getWidth();
            const oneHeight = one.getHeight();

            for (let b = groupTwo.length - 1; b >= 0; b--) {
                const two = groupTwo[b]!;

                if (
                    boxBoxCollision(
                        oneX,
                        oneY,
                        oneWidth,
                        oneHeight,
                        two.getX(),
                        two.getY(),
                        two.getWidth(),
                        two.getHeight(),
                    )
                ) {
                    one.tookDamage();
                    two.tookDamage();
                    return true;
                }
            }
        }

        return false;
    };

    detectCollisions(Bullet.all_player, Ship.all);
    detectCollisions(Bullet.all_player, MysteryShip.all);
    detectCollisions(Bullet.all_player, Bunker.all);
    detectCollisions(Bullet.all_ship, Bunker.all);

    // enemy bullets with the player
    for (let a = Bullet.all_ship.length - 1; a >= 0; a--) {
        const bullet = Bullet.all_ship[a]!;
        const playerX = PLAYER.getX();
        const playerY = PLAYER.getY();

        if (
            boxBoxCollision(
                playerX,
                playerY,
                Player.width,
                Player.height,
                bullet.getX(),
                bullet.getY(),
                Bullet.width,
                Bullet.height,
            )
        ) {
            bullet.tookDamage();
            PLAYER.tookDamage();
        }
    }
}

/**
 * The engine's game loop gives the `deltaTime` in seconds, while the counters below are in milliseconds.
 */
export function tick(deltaTime: number) {
    // update the counters
    const delta = deltaTime * 1000;

    TEMPO_COUNT -= delta;
    MYSTERY_COUNT -= delta;
    FIRE_COUNT -= delta;

    // deal with the movement of the player
    if (MOVE_LEFT) {
        PLAYER.moveLeft(deltaTime);
    } else if (MOVE_RIGHT) {
        PLAYER.moveRight(deltaTime);
    }

    // move the enemy ships according to the current tempo
    if (TEMPO_COUNT < 0) {
        setTempoLimit();

        Ship.tick(deltaTime);
    }

    // the mystery ship is moved normally every tick
    MysteryShip.tick(deltaTime);

    // spawn a new mystery ship
    if (MYSTERY_COUNT < 0) {
        new MysteryShip();

        // new random limit for the next one
        setMysteryLimit();
    }

    // a random ship fires a bullet
    if (FIRE_COUNT < 0) {
        // get a random ship
        if (Ship.all.length > 0) {
            const position = getRandomInt(0, Ship.all.length - 1);

            Ship.all[position]!.fire();

            setFireLimit();
        }
    }

    PLAYER.tick(deltaTime);
    Bullet.tick(deltaTime);

    // collision detection after all the rest of the state has been updated
    collisionDetection();
}
