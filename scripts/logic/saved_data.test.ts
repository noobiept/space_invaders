import { describe, expect, it } from "vitest";
import { parseHighScore, parseOptions } from "./saved_data";

describe("parseOptions()", () => {
    it("keeps valid saved options", () => {
        expect(parseOptions({ muted: true })).toEqual({ muted: true });
        expect(parseOptions({ muted: false })).toEqual({ muted: false });
    });

    it("uses the defaults when nothing was saved", () => {
        expect(parseOptions(null)).toEqual({ muted: false });
    });

    it("ignores saved data that isn't an object", () => {
        for (const data of ["muted", 1, true, [true]]) {
            expect(parseOptions(data)).toEqual({ muted: false });
        }
    });

    it("uses the default for an option of the wrong type", () => {
        expect(parseOptions({ muted: "yes" })).toEqual({ muted: false });
        expect(parseOptions({})).toEqual({ muted: false });
    });

    it("drops unknown options", () => {
        expect(parseOptions({ muted: true, volume: 3 })).toEqual({ muted: true });
    });
});

describe("parseHighScore()", () => {
    it("keeps a saved score", () => {
        expect(parseHighScore(1151)).toBe(1151);
        expect(parseHighScore(0)).toBe(0);
    });

    it("starts from 0 when nothing valid was saved", () => {
        for (const data of [null, "1151", {}, [], Infinity, true]) {
            expect(parseHighScore(data)).toBe(0);
        }
    });
});
