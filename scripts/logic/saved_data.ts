/**
 * Reading what was saved in `localStorage`. It can be anything (saved by an older version of
 * the game, or changed by hand), so only the values of the right type are used.
 *
 * Pure logic -- no engine or dom access, so it can be unit tested directly.
 */

export interface OptionsData {
    muted: boolean;
}

const DEFAULT_OPTIONS: OptionsData = {
    muted: false,
};

/**
 * The saved options, with the default for the ones that are missing or of the wrong type.
 *
 * @param data What was saved (`null` when nothing was).
 */
export function parseOptions(data: unknown): OptionsData {
    const saved: Record<string, unknown> = isRecord(data) ? data : {};

    return {
        muted: typeof saved.muted === "boolean" ? saved.muted : DEFAULT_OPTIONS.muted,
    };
}

/**
 * The saved high score, or `0` when it's missing or isn't a finite number.
 *
 * @param data What was saved (`null` when nothing was).
 */
export function parseHighScore(data: unknown): number {
    return typeof data === "number" && Number.isFinite(data) ? data : 0;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}
