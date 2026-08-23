import { describe, expect, it } from "vitest";
import {
    INVASION_DEPTH,
    SHIP_EDGE_LIMIT,
    clampPlayerX,
    hasReachedPlayer,
    isAboveCanvas,
    isBelowCanvas,
    isPastRightEdge,
    shipTickMove,
    shouldReverse,
    travel,
} from "./movement";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;
const PLAYER_WIDTH = 30;
const SHIP_WIDTH = 24;

describe("travel()", () => {
    it("covers speed * time", () => {
        expect(travel(100, 1)).toBe(100);
        expect(travel(100, 0.5)).toBe(50);
        expect(travel(200, 1 / 60)).toBeCloseTo(3.333, 3);
    });

    it("does not move at all with no elapsed time", () => {
        expect(travel(100, 0)).toBe(0);
    });
});

describe("clampPlayerX()", () => {
    it("leaves a position in the middle alone", () => {
        expect(clampPlayerX(250, PLAYER_WIDTH, CANVAS_WIDTH)).toBe(250);
    });

    it("stops the player's left edge at the canvas edge", () => {
        const x = clampPlayerX(-40, PLAYER_WIDTH, CANVAS_WIDTH);

        expect(x).toBe(PLAYER_WIDTH / 2);
        expect(x - PLAYER_WIDTH / 2).toBe(0);
    });

    it("stops the player's right edge at the canvas edge", () => {
        const x = clampPlayerX(9999, PLAYER_WIDTH, CANVAS_WIDTH);

        expect(x).toBe(CANVAS_WIDTH - PLAYER_WIDTH / 2);
        expect(x + PLAYER_WIDTH / 2).toBe(CANVAS_WIDTH);
    });

    it("keeps the player fully on screen from either extreme", () => {
        for (const candidate of [-1000, -1, 0, 15, 250, 485, 501, 1000]) {
            const x = clampPlayerX(candidate, PLAYER_WIDTH, CANVAS_WIDTH);

            expect(x - PLAYER_WIDTH / 2).toBeGreaterThanOrEqual(0);
            expect(x + PLAYER_WIDTH / 2).toBeLessThanOrEqual(CANVAS_WIDTH);
        }
    });
});

describe("shipTickMove()", () => {
    it("speeds the fleet up as it is thinned out", () => {
        const full = shipTickMove(1000, 55, 15, 1 / 60);
        const half = shipTickMove(1000, 27, 15, 1 / 60);
        const last = shipTickMove(1000, 1, 15, 1 / 60);

        expect(full).toBeLessThan(half);
        expect(half).toBeLessThan(last);
    });

    it("matches the speed formula for a full fleet", () => {
        // (1000 - 55 * 15) / 60
        expect(shipTickMove(1000, 55, 15, 1 / 60)).toBeCloseTo(175 / 60, 6);
    });

    it("scales with the level's max speed", () => {
        const level1 = shipTickMove(1000, 55, 15, 1 / 60);
        const level2 = shipTickMove(1100, 55, 15, 1 / 60);

        expect(level2).toBeGreaterThan(level1);
    });
});

describe("shouldReverse()", () => {
    const base = {
        furthestLeft: 100,
        furthestRight: 300,
        canvasWidth: CANVAS_WIDTH,
        shipWidth: SHIP_WIDTH,
    };

    it("keeps going while the fleet is clear of both edges", () => {
        expect(shouldReverse({ ...base, movingRight: true })).toBe(false);
        expect(shouldReverse({ ...base, movingRight: false })).toBe(false);
    });

    it("turns around at the right edge", () => {
        // the limit is canvasWidth - shipWidth - SHIP_EDGE_LIMIT === 466
        const limit = CANVAS_WIDTH - SHIP_WIDTH - SHIP_EDGE_LIMIT;

        expect(shouldReverse({ ...base, movingRight: true, furthestRight: limit })).toBe(false);
        expect(shouldReverse({ ...base, movingRight: true, furthestRight: limit + 1 })).toBe(true);
    });

    it("turns around at the left edge", () => {
        expect(shouldReverse({ ...base, movingRight: false, furthestLeft: SHIP_EDGE_LIMIT })).toBe(
            false,
        );
        expect(shouldReverse({ ...base, movingRight: false, furthestLeft: 9 })).toBe(true);
    });

    it("only looks at the edge it is heading towards", () => {
        // hard against the left edge, but travelling right
        expect(shouldReverse({ ...base, movingRight: true, furthestLeft: 0 })).toBe(false);

        // hard against the right edge, but travelling left
        expect(shouldReverse({ ...base, movingRight: false, furthestRight: 490 })).toBe(false);
    });

    it("honours a custom limit", () => {
        expect(shouldReverse({ ...base, movingRight: false, furthestLeft: 20, limit: 50 })).toBe(
            true,
        );
    });
});

describe("hasReachedPlayer()", () => {
    it("is false while the fleet is still high up", () => {
        expect(hasReachedPlayer(100, CANVAS_HEIGHT)).toBe(false);
    });

    it("becomes true once the fleet is within the invasion depth", () => {
        const threshold = CANVAS_HEIGHT - INVASION_DEPTH;

        expect(hasReachedPlayer(threshold, CANVAS_HEIGHT)).toBe(false);
        expect(hasReachedPlayer(threshold + 1, CANVAS_HEIGHT)).toBe(true);
    });
});

describe("bounds checks", () => {
    it("detects leaving the top", () => {
        expect(isAboveCanvas(0)).toBe(false);
        expect(isAboveCanvas(-1)).toBe(true);
    });

    it("detects leaving the bottom", () => {
        expect(isBelowCanvas(CANVAS_HEIGHT, CANVAS_HEIGHT)).toBe(false);
        expect(isBelowCanvas(CANVAS_HEIGHT + 1, CANVAS_HEIGHT)).toBe(true);
    });

    it("detects leaving the right side", () => {
        expect(isPastRightEdge(CANVAS_WIDTH, CANVAS_WIDTH)).toBe(false);
        expect(isPastRightEdge(CANVAS_WIDTH + 1, CANVAS_WIDTH)).toBe(true);
    });
});
