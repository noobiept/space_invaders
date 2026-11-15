/**
 * The rules governing how things move around the canvas.
 *
 * All positions here follow the engine's convention: `x`/`y` is the center of an
 * element, while `left`/`top` is its top/left corner.
 *
 * Pure logic -- no engine or dom access, so it can be unit tested directly.
 */

/** How close to the canvas edge the ships get before turning around. */
export const SHIP_EDGE_LIMIT = 10;

/** The invasion succeeds once the ships get this close to the bottom. */
export const INVASION_DEPTH = 90;

/**
 * How far something moves in `deltaTime` seconds.
 *
 * @param speed Pixels per second.
 * @param deltaTime Seconds elapsed since the last update.
 */
export function travel(speed: number, deltaTime: number): number {
    return speed * deltaTime;
}

/**
 * Keep the player fully within the canvas.
 *
 * @param x The player's center x.
 * @returns The clamped center x.
 */
export function clampPlayerX(x: number, playerWidth: number, canvasWidth: number): number {
    const half = playerWidth / 2;

    if (x < half) {
        return half;
    }

    if (x > canvasWidth - half) {
        return canvasWidth - half;
    }

    return x;
}

/**
 * The ships take one step on each beat, as far as their speed covers in this time. It's a
 * constant so the step doesn't depend on the frame rate. The speeds were tuned with v3 of the
 * engine, whose `setFps(60)` ran at about 40 updates per second on a 60Hz display (it skipped
 * the frames it measured at 16ms), so this keeps that pace.
 */
export const SHIP_STEP_TIME = 1 / 40;

/**
 * The remaining ships move faster as their numbers dwindle.
 *
 * @param shipCount How many ships are still alive.
 * @returns How far each ship moves on a beat.
 */
export function shipTickMove(maxSpeed: number, shipCount: number, speedDecrease: number): number {
    return travel(maxSpeed - shipCount * speedDecrease, SHIP_STEP_TIME);
}

export interface ShouldReverseArgs {
    movingRight: boolean;
    /** The `left` of the ship furthest to the left. */
    furthestLeft: number;
    /** The `left` of the ship furthest to the right. */
    furthestRight: number;
    canvasWidth: number;
    /** The widest ship's width. */
    shipWidth: number;
    limit?: number;
}

/**
 * Whether the ships have reached an extreme of the canvas, and so need to
 * reverse direction and drop one line down.
 */
export function shouldReverse(args: ShouldReverseArgs): boolean {
    const { movingRight, furthestLeft, furthestRight, canvasWidth, shipWidth } = args;
    const limit = args.limit ?? SHIP_EDGE_LIMIT;

    if (movingRight) {
        return furthestRight > canvasWidth - shipWidth - limit;
    }

    return furthestLeft < limit;
}

/**
 * Whether the ships have descended far enough to reach the player.
 *
 * @param lowestTop The `top` of the lowest ship.
 */
export function hasReachedPlayer(lowestTop: number, canvasHeight: number): boolean {
    return lowestTop > canvasHeight - INVASION_DEPTH;
}

/**
 * Whether an element has travelled off the top of the canvas.
 */
export function isAboveCanvas(top: number): boolean {
    return top < 0;
}

/**
 * Whether an element has travelled off the bottom of the canvas.
 */
export function isBelowCanvas(top: number, canvasHeight: number): boolean {
    return top > canvasHeight;
}

/**
 * Whether an element has travelled off the right side of the canvas.
 */
export function isPastRightEdge(left: number, canvasWidth: number): boolean {
    return left > canvasWidth;
}
