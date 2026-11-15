import * as Engine from "@drk4/game-engine";
import { Timer } from "@drk4/utilities";
import * as Game from "./game";
import * as GameAudio from "./game_audio";
import { timeDecay } from "./logic/scoring";
import * as Options from "./options";

// reference to html elements
let GAME_MENU: HTMLElement;
let SCORE: HTMLElement;
let LIVES: HTMLElement;
let TIMER: Timer;
let TIMER_STARTED = false; // between `startTimer()` and `stopTimer()` (the timer itself is stopped while the page is hidden)
let MUTE: HTMLElement;

export function init() {
    GAME_MENU = document.querySelector<HTMLElement>("#GameMenu")!;

    const restart = GAME_MENU.querySelector<HTMLElement>("#Restart")!;

    restart.addEventListener("click", function (event) {
        Game.restart();
        releaseAfterPointer(event);
        event.stopPropagation();
    });

    let muted = Options.get("muted");

    MUTE = GAME_MENU.querySelector<HTMLElement>("#Mute")!;
    MUTE.addEventListener("click", function (event) {
        muted = !muted;
        setMuted(muted);

        releaseAfterPointer(event);
        event.stopPropagation();
    });
    setMuted(muted, false);

    const timer = GAME_MENU.querySelector<HTMLElement>("#Timer")!;

    TIMER = new Timer({ updateElement: { element: timer } });
    Engine.addEventListener("pause", onGameLoopPause);
    Engine.addEventListener("resume", onGameLoopResume);

    SCORE = GAME_MENU.querySelector<HTMLElement>("#Score")!;
    LIVES = GAME_MENU.querySelector<HTMLElement>("#Lives")!;
}

export function startTimer(startTime = 0) {
    let lastTime = startTime;

    TIMER_STARTED = true;
    TIMER.start({
        startValue: startTime,
        onTick: function () {
            const time = TIMER.getTimeMilliseconds();
            const decay = timeDecay(lastTime, time);

            lastTime = time;

            if (decay !== 0) {
                Game.addScore(decay);
            }
        },
    });

    // a new level can start while the game loop is paused (from the victory message's timeout,
    // with the page hidden)
    if (!Engine.isGameLoopRunning()) {
        TIMER.stop();
    }
}

export function stopTimer() {
    TIMER_STARTED = false;
    TIMER.stop();
}

/**
 * The timer goes along with the game loop, which the engine pauses while the page is hidden
 * (otherwise the time and its score decay keep going while the game is frozen).
 */
function onGameLoopPause() {
    if (TIMER_STARTED) {
        TIMER.stop();
    }
}

function onGameLoopResume() {
    if (TIMER_STARTED) {
        TIMER.resume();
    }
}

export function getCurrentTime() {
    return TIMER.getTimeMilliseconds();
}

export function updateScore(score: number) {
    SCORE.innerHTML = score.toString();
}

export function updateLives(lives: number) {
    LIVES.innerHTML = lives.toString();
}

export function show() {
    GAME_MENU.style.visibility = "visible";
}

export function hide() {
    GAME_MENU.style.visibility = "hidden";
}

/**
 * Give the focus back after a mouse click, so that `space` keeps firing instead of
 * re-triggering the button that was just clicked. A keyboard activation (`detail`
 * of 0) keeps the focus where it is, so tabbing through the menu still works.
 */
function releaseAfterPointer(event: MouseEvent) {
    if (event.detail > 0) {
        (event.currentTarget as HTMLElement).blur();
    }
}

function setMuted(muted: boolean, save = true) {
    if (muted === true) {
        GameAudio.setGain(0);
        MUTE.innerHTML = "Un-mute";
    } else {
        GameAudio.setGain(1);
        MUTE.innerHTML = "Mute";
    }

    if (save !== false) {
        Options.set("muted", muted);
    }
}
