import * as Engine from "@drk4/game-engine";
import { MouseButton, boxBoxCollision, getRandomInt } from "@drk4/utilities";
import { Bullet } from "./bullet";
import { Bunker } from "./bunker";
import * as GameAudio from "./game_audio";
import * as GameMenu from "./game_menu";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./globals";
import * as HighScore from "./high_score";
import * as Message from "./message";
import { bunkerGroups, shipGrid } from "./logic/layout";
import { nextLevelSpeed } from "./logic/scoring";
import { INITIAL_TEMPO, beatInterval, nextTempo } from "./logic/tempo";
import { MysteryShip } from "./mystery_ship";
import { Player } from "./player";
import { Ship } from "./ship";

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

// if a game is being played (it ends with `clear()`, which can happen in the middle of a `tick()`)
let PLAYING = false;

// the tempo of the song/game (the movement of the enemies follow the tempo as well)
// the ships move on every beat (the cooldown's interval)
let BEAT!: Engine.Cooldown;
let CURRENT_TEMPO = 0;

// when to spawn a mystery ship (a new random interval after each one)
let MYSTERY_SPAWN!: Engine.Cooldown;

// when a random ship fires a bullet (a new random interval after each one)
let SHIP_FIRE!: Engine.Cooldown;

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

    if (typeof maxShipSpeed === "undefined") {
        Ship.current_max_speed = Ship.initial_max_speed;
    } else {
        Ship.current_max_speed = maxShipSpeed;
    }

    const ships = shipGrid({
        lines: 5,
        columns: 11,
        spaceBetween: 10,
        canvasWidth: CANVAS_WIDTH,
        shipWidth: Ship.highest_width,
        shipHeight: Ship.height,
        startY: MysteryShip.height * 3,
    });

    for (const placement of ships) {
        new Ship(placement.x, placement.y, placement.type);
    }

    Ship.findLeftRight();

    // :::: add the bunkers :::: //

    const bunkers = bunkerGroups({
        groups: 4,
        margin: 50, // margin between the extremes of the canvas, and the nearby bunker
        canvasWidth: CANVAS_WIDTH,
        bunkerWidth: Bunker.width,
        bunkerHeight: Bunker.height,
        startY: CANVAS_HEIGHT - 70,

        // each bunker group has this format (each 1 is an individual Bunker)
        // 1111
        // 1111
        // 1  1
        columnHeights: [3, 2, 2, 3],
    });

    for (const placement of bunkers) {
        new Bunker(placement.x, placement.y);
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

    // they all wait their interval before the first time
    BEAT = new Engine.Cooldown(beatInterval(INITIAL_TEMPO), { ready: false });
    MYSTERY_SPAWN = new Engine.Cooldown(mysteryInterval(), { ready: false });
    SHIP_FIRE = new Engine.Cooldown(fireInterval(), { ready: false });

    setTempo(INITIAL_TEMPO);

    GameAudio.playSong(INITIAL_TEMPO);

    // set the events
    document.body.addEventListener("keydown", keyDownEvent);
    document.body.addEventListener("keyup", keyUpEvent);
    document.body.addEventListener("click", clickEvent);
    Engine.addToGameLoop(tick);
    PLAYING = true;
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
            nextLevelSpeed(Ship.current_max_speed, Ship.speed_increase_per_level),
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
    PLAYING = false;
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
    } else if (code === "Space" && !isMenuFocused()) {
        PLAYER.fire();
    }
}

/**
 * Whether one of the menu buttons currently has the keyboard focus. `space` activates
 * a focused button, so the player shouldn't fire off the same key press.
 */
function isMenuFocused(): boolean {
    const active = document.activeElement;

    return active instanceof HTMLElement && active.closest("#GameMenu") !== null;
}

function clickEvent(event: MouseEvent) {
    if (event.button === MouseButton.left) {
        PLAYER.fire();
    }
}

/**
 * Time until the next mystery ship (in seconds).
 */
function mysteryInterval() {
    return getRandomInt(8000, 15000) / 1000;
}

/**
 * Time until a ship fires the next bullet (in seconds).
 */
function fireInterval() {
    return getRandomInt(1000, 2500) / 1000;
}

export function setTempo(tempo: number) {
    CURRENT_TEMPO = tempo;

    // applies to the current beat as well, like the song's playback rate
    BEAT.interval = beatInterval(CURRENT_TEMPO);
}

export function increaseTempo() {
    setTempo(nextTempo(CURRENT_TEMPO));
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

            // the last life ends the game, which clears the bullets
            if (!PLAYING) {
                return;
            }
        }
    }
}

/**
 * @param deltaTime Seconds since the last update (from the engine's game loop).
 */
export function tick(deltaTime: number) {
    // update the timers
    BEAT.update(deltaTime);
    MYSTERY_SPAWN.update(deltaTime);
    SHIP_FIRE.update(deltaTime);

    // deal with the movement of the player
    if (MOVE_LEFT) {
        PLAYER.moveLeft(deltaTime);
    } else if (MOVE_RIGHT) {
        PLAYER.moveRight(deltaTime);
    }

    // move the enemy ships according to the current tempo
    if (BEAT.isReady()) {
        BEAT.restart();

        Ship.tick();

        // the ships may have reached the player, which ends the game (and clears everything)
        if (!PLAYING) {
            return;
        }
    }

    // the mystery ship is moved normally every tick
    MysteryShip.tick(deltaTime);

    // spawn a new mystery ship
    if (MYSTERY_SPAWN.isReady()) {
        new MysteryShip();

        MYSTERY_SPAWN.restart(mysteryInterval());
    }

    // a random ship fires a bullet
    if (SHIP_FIRE.isReady() && Ship.all.length > 0) {
        const position = getRandomInt(0, Ship.all.length - 1);

        Ship.all[position]!.fire();

        SHIP_FIRE.restart(fireInterval());
    }

    Bullet.tick(deltaTime);

    // collision detection after all the rest of the state has been updated
    collisionDetection();
}
