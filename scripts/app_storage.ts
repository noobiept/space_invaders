import { getObject, saveObject } from "@drk4/utilities";

/**
 * Get a previously saved value from `localStorage`.
 *
 * @param key The key it was saved with.
 * @return The parsed value, or `null` if there's nothing saved for that key (or it isn't valid json).
 *         It can be anything (saved by an older version of the game, or changed by hand), so check
 *         it before using it.
 */
export function getData(key: string): unknown {
    return getObject(key) ?? null;
}

/**
 * Save a value in `localStorage` (converted to a json string).
 *
 * @param key The key to save it with.
 * @param value The value to save.
 */
export function setData(key: string, value: unknown) {
    saveObject(key, value);
}
