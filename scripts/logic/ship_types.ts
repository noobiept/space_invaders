/**
 * The enemy ship variants and their fixed attributes.
 *
 * Pure data/logic -- no engine or dom access, so it can be unit tested directly.
 */

export enum ShipType {
    one,
    two,
    three,
}

export type ShipTypeName = "one" | "two" | "three";

export interface ShipTypeInfo {
    /** Score awarded for destroying this ship. */
    score: number;
    /** The ships have different widths (but share the same height). */
    width: number;
}

/** Height is the same for every ship type. */
export const SHIP_HEIGHT = 16;

/** The width of the widest ship type, which the grid is laid out against. */
export const SHIP_HIGHEST_WIDTH = 24;

export const SHIP_TYPES: Record<ShipTypeName, ShipTypeInfo> = {
    one: {
        score: 40,
        width: 16,
    },
    two: {
        score: 20,
        width: 22,
    },
    three: {
        score: 10,
        width: 24,
    },
};

/**
 * The name of a ship type, which is also how its images are keyed in the preload.
 */
export function shipTypeName(type: ShipType): ShipTypeName {
    return ShipType[type] as ShipTypeName;
}

/**
 * The score/width of a ship type.
 */
export function shipTypeInfo(type: ShipType): ShipTypeInfo {
    return SHIP_TYPES[shipTypeName(type)];
}
