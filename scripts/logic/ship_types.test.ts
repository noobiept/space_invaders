import { describe, expect, it } from "vitest";
import {
    SHIP_HEIGHT,
    SHIP_HIGHEST_WIDTH,
    SHIP_TYPES,
    ShipType,
    shipTypeInfo,
    shipTypeName,
} from "./ship_types";

describe("shipTypeName()", () => {
    it("maps every type to the name its images are keyed by", () => {
        expect(shipTypeName(ShipType.one)).toBe("one");
        expect(shipTypeName(ShipType.two)).toBe("two");
        expect(shipTypeName(ShipType.three)).toBe("three");
    });
});

describe("shipTypeInfo()", () => {
    it("gives the score and width of each type", () => {
        expect(shipTypeInfo(ShipType.one)).toEqual({ score: 40, width: 16 });
        expect(shipTypeInfo(ShipType.two)).toEqual({ score: 20, width: 22 });
        expect(shipTypeInfo(ShipType.three)).toEqual({ score: 10, width: 24 });
    });

    it("scores the smaller ships higher, since they're harder to hit", () => {
        const one = shipTypeInfo(ShipType.one);
        const two = shipTypeInfo(ShipType.two);
        const three = shipTypeInfo(ShipType.three);

        expect(one.width).toBeLessThan(two.width);
        expect(two.width).toBeLessThan(three.width);

        expect(one.score).toBeGreaterThan(two.score);
        expect(two.score).toBeGreaterThan(three.score);
    });
});

describe("dimensions", () => {
    it("keeps SHIP_HIGHEST_WIDTH in step with the widest type", () => {
        const widest = Math.max(...Object.values(SHIP_TYPES).map((info) => info.width));

        expect(SHIP_HIGHEST_WIDTH).toBe(widest);
    });

    it("has a positive shared height", () => {
        expect(SHIP_HEIGHT).toBeGreaterThan(0);
    });
});
