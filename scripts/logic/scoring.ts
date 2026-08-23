/**
 * How the score changes as the game is played.
 *
 * Pure logic -- no engine or dom access, so it can be unit tested directly.
 */

/** Firing costs score, to discourage spraying bullets. */
export const BULLET_COST = -5;

/** The score also drops as time passes, to reward finishing a level quickly. */
export const TIME_DECAY_PER_TICK = -1;

/** Score awarded for destroying the mystery ship. */
export const MYSTERY_SHIP_SCORE = 100;

/**
 * The enemy ships move faster on each level that is cleared.
 */
export function nextLevelSpeed(currentMaxSpeed: number, increasePerLevel: number): number {
    return currentMaxSpeed + increasePerLevel;
}
