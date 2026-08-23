import { describe, expect, it } from "vitest";
import { INITIAL_TEMPO, TEMPO_INCREASE_PER_SHIP, nextTempo, tempoLimitMs } from "./tempo";

describe("tempoLimitMs()", () => {
    it("converts beats per minute into milliseconds per beat", () => {
        expect(tempoLimitMs(60)).toBe(1000);
        expect(tempoLimitMs(100)).toBe(600);
        expect(tempoLimitMs(120)).toBe(500);
    });

    it("shortens the gap as the tempo rises", () => {
        expect(tempoLimitMs(INITIAL_TEMPO + 50)).toBeLessThan(tempoLimitMs(INITIAL_TEMPO));
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
        expect(tempoLimitMs(tempo)).toBeCloseTo(tempoLimitMs(INITIAL_TEMPO) / 2.1, 0);
    });
});
