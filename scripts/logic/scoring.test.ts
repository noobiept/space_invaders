import { describe, expect, it } from "vitest";
import {
    BULLET_COST,
    MYSTERY_SHIP_SCORE,
    TIME_DECAY_PER_SECOND,
    nextLevelSpeed,
    timeDecay,
} from "./scoring";
import { ShipType, shipTypeInfo } from "./ship_types";

describe("score values", () => {
    it("charges for firing and for time passing", () => {
        expect(BULLET_COST).toBeLessThan(0);
        expect(TIME_DECAY_PER_SECOND).toBeLessThan(0);
    });

    it("makes the mystery ship worth more than any regular ship", () => {
        const best = Math.max(
            shipTypeInfo(ShipType.one).score,
            shipTypeInfo(ShipType.two).score,
            shipTypeInfo(ShipType.three).score,
        );

        expect(MYSTERY_SHIP_SCORE).toBeGreaterThan(best);
    });

    it("leaves a destroyed ship worth more than the bullet that killed it", () => {
        const worst = shipTypeInfo(ShipType.three).score;

        expect(worst + BULLET_COST).toBeGreaterThan(0);
    });
});

describe("nextLevelSpeed()", () => {
    it("speeds the fleet up by the per level increase", () => {
        expect(nextLevelSpeed(1000, 100)).toBe(1100);
    });

    it("compounds across levels", () => {
        let speed = 1000;

        for (let level = 0; level < 3; level++) {
            speed = nextLevelSpeed(speed, 100);
        }

        expect(speed).toBe(1300);
    });
});

describe("timeDecay()", () => {
    it("takes the decay once per second on the timer", () => {
        expect(timeDecay(0, 1000)).toBe(TIME_DECAY_PER_SECOND);
        expect(timeDecay(4000, 5000)).toBe(TIME_DECAY_PER_SECOND);
    });

    it("counts every second when a tick covers several", () => {
        expect(timeDecay(10000, 13000)).toBe(3 * TIME_DECAY_PER_SECOND);
    });

    // (`toBeCloseTo(0)`, since no change is `-0`)
    it("only counts whole seconds", () => {
        expect(timeDecay(1000, 1999)).toBeCloseTo(0);
        expect(timeDecay(1999, 2000)).toBe(TIME_DECAY_PER_SECOND);
    });

    it("doesn't change the score when no time passed", () => {
        expect(timeDecay(7000, 7000)).toBeCloseTo(0);
    });
});
