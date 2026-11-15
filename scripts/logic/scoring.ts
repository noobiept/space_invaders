/**
 * How the score changes as the game is played.
 *
 * Pure logic -- no engine or dom access, so it can be unit tested directly.
 */

/** Firing costs score, to discourage spraying bullets. */
export const BULLET_COST = -5;

/** The score also drops as time passes, to reward finishing a level quickly. */
export const TIME_DECAY_PER_SECOND = -1;

/**
 * How much the score changes as the timer goes from one time to another (once per whole second
 * on the timer, so it stays in step with it even when a timer tick counts several seconds).
 *
 * @param fromMs The timer's previous time, in milliseconds.
 * @param toMs The timer's current time, in milliseconds.
 */
export function timeDecay(fromMs: number, toMs: number): number {
    const seconds = Math.floor(toMs / 1000) - Math.floor(fromMs / 1000);

    return seconds * TIME_DECAY_PER_SECOND;
}

/** Score awarded for destroying the mystery ship. */
export const MYSTERY_SHIP_SCORE = 100;

/**
 * The enemy ships move faster on each level that is cleared.
 */
export function nextLevelSpeed(currentMaxSpeed: number, increasePerLevel: number): number {
    return currentMaxSpeed + increasePerLevel;
}
