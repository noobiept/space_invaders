import * as AppStorage from "./app_storage";

export const STORAGE_KEY = "space_invaders_options";

export interface OptionsData {
    muted: boolean;
}

let OPTIONS: OptionsData = {
    muted: false,
};

export function init(options: OptionsData | null) {
    if (options) {
        OPTIONS = options;
    }
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
