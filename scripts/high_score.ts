import * as AppStorage from "./app_storage";
import { parseHighScore } from "./logic/saved_data";

export const STORAGE_KEY = "space_invaders_high_score";

let HTML_ELEMENT: HTMLElement;
let BEST_SCORE: number;

/**
 * @param data What was saved (it can be anything, only a valid score is used).
 */
export function init(data: unknown) {
    HTML_ELEMENT = document.querySelector<HTMLElement>("#HighScore")!;
    BEST_SCORE = parseHighScore(data);

    updateHtmlElement();
}

export function add(score: number) {
    if (score > BEST_SCORE) {
        BEST_SCORE = score;
    }

    save();
    updateHtmlElement();
}

function save() {
    AppStorage.setData(STORAGE_KEY, BEST_SCORE);
}

function updateHtmlElement() {
    HTML_ELEMENT.innerHTML = BEST_SCORE.toString();
}
