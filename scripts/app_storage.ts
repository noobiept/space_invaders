import { getObject, saveObject } from "@drk4/utilities";

/**
 * Get a previously saved value from `localStorage`.
 *
 * @param key The key it was saved with.
 * @return The parsed value, or `null` if there's nothing saved for that key.
 */
export function getData<T>(key: string): T | null {
    return (getObject(key) as T | null) ?? null;
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
