import { Timer } from "@drk4/utilities";
import * as Game from "./game";
import * as GameAudio from "./game_audio";
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
        event.stopPropagation();
    });

    let muted = Options.get("muted");

    MUTE = GAME_MENU.querySelector<HTMLElement>("#Mute")!;
    MUTE.addEventListener("click", function (event) {
        muted = !muted;
        setMuted(muted);

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
            Game.addScore(-1);
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
