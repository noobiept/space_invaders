/**
 * Where the ships and bunkers are positioned when a level starts.
 *
 * Every position returned is the *center* of the element, matching the engine's
 * convention.
 *
 * Pure logic -- no engine or dom access, so it can be unit tested directly.
 */

import { ShipType } from "./ship_types";

export interface Placement {
    x: number;
    y: number;
}

export interface ShipPlacement extends Placement {
    type: ShipType;
}

/**
 * Which ship type occupies a given row (row 0 is the top one).
 */
export function shipTypeForRow(row: number): ShipType {
    if (row === 0) {
        return ShipType.one;
    }

    if (row <= 2) {
        return ShipType.two;
    }

    return ShipType.three;
}

export interface ShipGridArgs {
    lines: number;
    columns: number;
    /** Gap between neighbouring ships. */
    spaceBetween: number;
    canvasWidth: number;
    /** The widest ship's width -- every ship is centered within a cell this wide. */
    shipWidth: number;
    shipHeight: number;
    /** The `top` of the first row. */
    startY: number;
}

/**
 * The center position (and type) of every ship of a new level, ordered row by row.
 */
export function shipGrid(args: ShipGridArgs): ShipPlacement[] {
    const { lines, columns, spaceBetween, canvasWidth, shipWidth, shipHeight, startY } = args;

    const occupiedWidth = columns * shipWidth + (columns - 1) * spaceBetween;
    const startX = canvasWidth / 2 - occupiedWidth / 2;

    const placements: ShipPlacement[] = [];
    let y = startY;

    for (let line = 0; line < lines; line++) {
        const type = shipTypeForRow(line);
        let x = startX;

        for (let column = 0; column < columns; column++) {
            placements.push({
                x: x + shipWidth / 2,
                y: y + shipHeight / 2,
                type: type,
            });

            x += shipWidth + spaceBetween;
        }

        y += shipHeight + spaceBetween;
    }

    return placements;
}

export interface BunkerGroupsArgs {
    /** How many bunker groups to spread across the canvas. */
    groups: number;
    /** Gap between the canvas edges and the nearest bunker group. */
    margin: number;
    canvasWidth: number;
    bunkerWidth: number;
    bunkerHeight: number;
    /** The `top` of the first bunker row. */
    startY: number;
    /** How many bunkers tall each column of a group is, e.g. `[3, 2, 2, 3]`. */
    columnHeights: readonly number[];
}

/**
 * The center position of every bunker, ordered group by group and then column by column.
 */
export function bunkerGroups(args: BunkerGroupsArgs): Placement[] {
    const { groups, margin, canvasWidth, bunkerWidth, bunkerHeight, startY, columnHeights } = args;

    const groupWidth = columnHeights.length * bunkerWidth;
    const availableWidth = canvasWidth - 2 * margin;

    // Distance between the start of one group and the start of the next. It is
    // deliberately kept fractional and only rounded per group below -- rounding the
    // gap itself would accumulate the error into the last group, leaving the block
    // a pixel short and the margins uneven.
    const step = groups > 1 ? (availableWidth - groupWidth) / (groups - 1) : 0;

    const placements: Placement[] = [];

    for (let group = 0; group < groups; group++) {
        const groupX = margin + Math.round(group * step);

        for (let column = 0; column < columnHeights.length; column++) {
            const columnX = groupX + column * bunkerWidth;

            for (let row = 0; row < columnHeights[column]!; row++) {
                placements.push({
                    x: columnX + bunkerWidth / 2,
                    y: startY + row * bunkerHeight + bunkerHeight / 2,
                });
            }
        }
    }

    return placements;
}
