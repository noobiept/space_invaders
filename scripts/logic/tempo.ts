/**
 * The tempo drives both the song's playback rate and how often the enemy ships move.
 *
 * Pure logic -- no engine or dom access, so it can be unit tested directly.
 */

/** Tempo of the game before any ship is destroyed. */
export const INITIAL_TEMPO = 100;

/** How much the tempo goes up for each ship destroyed. */
export const TEMPO_INCREASE_PER_SHIP = 2;

/**
 * How long to wait between ship movements, in milliseconds, for a given tempo.
 *
 * @param tempo Beats per minute.
 */
export function tempoLimitMs(tempo: number): number {
    return (60 / tempo) * 1000;
}

/**
 * The tempo after destroying one more ship.
 */
export function nextTempo(tempo: number): number {
    return tempo + TEMPO_INCREASE_PER_SHIP;
}
