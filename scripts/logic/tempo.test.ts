import { describe, expect, it } from "vitest";
import { INITIAL_TEMPO, TEMPO_INCREASE_PER_SHIP, beatInterval, nextTempo } from "./tempo";

describe("beatInterval()", () => {
    it("converts beats per minute into seconds per beat", () => {
        expect(beatInterval(60)).toBe(1);
        expect(beatInterval(100)).toBe(0.6);
        expect(beatInterval(120)).toBe(0.5);
    });

    it("shortens the gap as the tempo rises", () => {
        expect(beatInterval(INITIAL_TEMPO + 50)).toBeLessThan(beatInterval(INITIAL_TEMPO));
    });
});

describe("nextTempo()", () => {
    it("steps up by a fixed amount per ship destroyed", () => {
        expect(nextTempo(100)).toBe(100 + TEMPO_INCREASE_PER_SHIP);
    });

    it("ramps up over a whole level of 55 ships", () => {
        let tempo = INITIAL_TEMPO;

        for (let a = 0; a < 55; a++) {
            tempo = nextTempo(tempo);
        }

        expect(tempo).toBe(INITIAL_TEMPO + 55 * TEMPO_INCREASE_PER_SHIP);

        // the ships end up moving roughly twice as often as they started
        expect(beatInterval(tempo)).toBeCloseTo(beatInterval(INITIAL_TEMPO) / 2.1, 6);
    });
});
