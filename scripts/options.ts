import * as AppStorage from "./app_storage";
import { type OptionsData, parseOptions } from "./logic/saved_data";

export const STORAGE_KEY = "space_invaders_options";

let OPTIONS: OptionsData = parseOptions(null); // the defaults, until `init()`

/**
 * @param data What was saved (it can be anything, only the valid options are used).
 */
export function init(data: unknown) {
    OPTIONS = parseOptions(data);
}

export function get<K extends keyof OptionsData>(key: K): OptionsData[K] {
    return OPTIONS[key];
}

export function set<K extends keyof OptionsData>(key: K, value: OptionsData[K]) {
    OPTIONS[key] = value;

    save();
}

function save() {
    AppStorage.setData(STORAGE_KEY, OPTIONS);
}
