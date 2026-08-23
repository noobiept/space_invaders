import { describe, expect, it } from "vitest";
import { bunkerGroups, shipGrid, shipTypeForRow } from "./layout";
import { SHIP_HEIGHT, SHIP_HIGHEST_WIDTH, ShipType, shipTypeInfo } from "./ship_types";

const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 400;

/** The arguments the game actually starts a level with. */
const SHIP_GRID_ARGS = {
    lines: 5,
    columns: 11,
    spaceBetween: 10,
    canvasWidth: CANVAS_WIDTH,
    shipWidth: SHIP_HIGHEST_WIDTH,
    shipHeight: SHIP_HEIGHT,
    startY: 42,
};

const BUNKER_ARGS = {
    groups: 4,
    margin: 50,
    canvasWidth: CANVAS_WIDTH,
    bunkerWidth: 12,
    bunkerHeight: 12,
    startY: CANVAS_HEIGHT - 70,
    columnHeights: [3, 2, 2, 3],
};

/** The `left` of a placed ship, which is what the original game positioned by. */
function leftOf(placement: { x: number; type: ShipType }): number {
    return placement.x - shipTypeInfo(placement.type).width / 2;
}

describe("shipTypeForRow()", () => {
    it("puts the highest scoring ship on the top row", () => {
        expect(shipTypeForRow(0)).toBe(ShipType.one);
    });

    it("puts the middle type on the next two rows", () => {
        expect(shipTypeForRow(1)).toBe(ShipType.two);
        expect(shipTypeForRow(2)).toBe(ShipType.two);
    });

    it("puts the widest type on the bottom rows", () => {
        expect(shipTypeForRow(3)).toBe(ShipType.three);
        expect(shipTypeForRow(4)).toBe(ShipType.three);
    });
});

describe("shipGrid()", () => {
    it("places 5 rows of 11 ships", () => {
        expect(shipGrid(SHIP_GRID_ARGS)).toHaveLength(55);
    });

    // these are the positions the original (pre-migration) game produced
    it("matches the original game's row positions", () => {
        const grid = shipGrid(SHIP_GRID_ARGS);
        const row = (index: number) => grid.slice(index * 11, index * 11 + 11);

        expect(row(0).map(leftOf)).toEqual([72, 106, 140, 174, 208, 242, 276, 310, 344, 378, 412]);
        expect(row(1).map(leftOf)).toEqual([69, 103, 137, 171, 205, 239, 273, 307, 341, 375, 409]);
        expect(row(3).map(leftOf)).toEqual([68, 102, 136, 170, 204, 238, 272, 306, 340, 374, 408]);
    });

    it("matches the original game's row heights", () => {
        const grid = shipGrid(SHIP_GRID_ARGS);
        const tops = grid.map((p) => p.y - SHIP_HEIGHT / 2);

        expect([...new Set(tops)]).toEqual([42, 68, 94, 120, 146]);
    });

    it("centers every ship within the widest ship's cell, whatever its own width", () => {
        const grid = shipGrid(SHIP_GRID_ARGS);
        const columnCenters = grid.slice(0, 11).map((p) => p.x);

        // each row uses the same centers, even though the rows have different widths
        for (let row = 1; row < 5; row++) {
            expect(grid.slice(row * 11, row * 11 + 11).map((p) => p.x)).toEqual(columnCenters);
        }
    });

    it("centers the whole block horizontally", () => {
        const grid = shipGrid(SHIP_GRID_ARGS);
        const lefts = grid.map((p) => p.x - SHIP_HIGHEST_WIDTH / 2);
        const rights = grid.map((p) => p.x + SHIP_HIGHEST_WIDTH / 2);

        const leftGap = Math.min(...lefts);
        const rightGap = CANVAS_WIDTH - Math.max(...rights);

        expect(leftGap).toBe(rightGap);
    });

    it("keeps the fleet inside the canvas", () => {
        for (const placement of shipGrid(SHIP_GRID_ARGS)) {
            expect(placement.x - SHIP_HIGHEST_WIDTH / 2).toBeGreaterThanOrEqual(0);
            expect(placement.x + SHIP_HIGHEST_WIDTH / 2).toBeLessThanOrEqual(CANVAS_WIDTH);
        }
    });
});

describe("bunkerGroups()", () => {
    it("places 4 groups of 10 bunkers", () => {
        expect(bunkerGroups(BUNKER_ARGS)).toHaveLength(40);
    });

    // these are the positions the original (pre-migration) game produced
    it("matches the original game's first group", () => {
        const bunkers = bunkerGroups(BUNKER_ARGS);
        const corners = bunkers.slice(0, 10).map((p) => [p.x - 6, p.y - 6]);

        expect(corners).toEqual([
            [50, 330],
            [50, 342],
            [50, 354],
            [62, 330],
            [62, 342],
            [74, 330],
            [74, 342],
            [86, 330],
            [86, 342],
            [86, 354],
        ]);
    });

    it("starts each group at the original game's offsets", () => {
        const bunkers = bunkerGroups(BUNKER_ARGS);
        const groupLefts = [0, 10, 20, 30].map((i) => bunkers[i]!.x - 6);

        expect(groupLefts).toEqual([50, 167, 284, 401]);
    });

    it("leaves the notch in the middle of each group", () => {
        const bunkers = bunkerGroups(BUNKER_ARGS);
        const firstGroup = bunkers.slice(0, 10);
        const bottomRow = firstGroup.filter((p) => p.y - 6 === 354);

        // only the outer columns reach the bottom row
        expect(bottomRow.map((p) => p.x - 6)).toEqual([50, 86]);
    });

    it("leaves the rounding remainder against the right margin", () => {
        const bunkers = bunkerGroups(BUNKER_ARGS);
        const lefts = bunkers.map((p) => p.x - 6);
        const rights = bunkers.map((p) => p.x + 6);

        // the gap between groups is rounded down (69 rather than 69.33), so the
        // four groups span 399px of the 400px available and the leftover pixel
        // ends up on the right. This asymmetry comes from the original game.
        expect(Math.min(...lefts)).toBe(BUNKER_ARGS.margin);
        expect(CANVAS_WIDTH - Math.max(...rights)).toBe(BUNKER_ARGS.margin + 1);
    });

    it("keeps the groups evenly spaced between themselves", () => {
        const bunkers = bunkerGroups(BUNKER_ARGS);
        const groupLefts = [0, 10, 20, 30].map((i) => bunkers[i]!.x - 6);
        const gaps = groupLefts.slice(1).map((left, i) => left - groupLefts[i]!);

        expect(new Set(gaps).size).toBe(1);
    });
});
