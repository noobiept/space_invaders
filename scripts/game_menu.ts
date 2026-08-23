import { Timer } from "@drk4/utilities";
import * as Game from "./game";
import * as GameAudio from "./game_audio";
import { TIME_DECAY_PER_TICK } from "./logic/scoring";
import * as Options from "./options";

// reference to html elements
let GAME_MENU: HTMLElement;
let SCORE: HTMLElement;
let LIVES: HTMLElement;
let TIMER: Timer;
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

    SCORE = GAME_MENU.querySelector<HTMLElement>("#Score")!;
    LIVES = GAME_MENU.querySelector<HTMLElement>("#Lives")!;
}

export function startTimer(startTime = 0) {
    TIMER.start({
        startValue: startTime,
        onTick: function () {
            Game.addScore(TIME_DECAY_PER_TICK);
        },
    });
}

export function stopTimer() {
    TIMER.stop();
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
