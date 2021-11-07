/* tslint:disable */
/**
 * DO NOT MODIFY THIS FILE BY HAND.
 * Original source: data/schema/skyline.schema.json
 */

/**
 * This interface was referenced by `Skyline`'s JSON-Schema
 * via the `definition` "characterName".
 */
export type CharacterName = string;
/**
 * Programmatic identifier unique to this object
 *
 * This interface was referenced by `Skyline`'s JSON-Schema
 * via the `definition` "id".
 */
export type ID = string;
/**
 * This interface was referenced by `Skyline`'s JSON-Schema
 * via the `definition` "note".
 */
export type Note = Notes & OneOrMoreStrings;
/**
 * This interface was referenced by `Skyline`'s JSON-Schema
 * via the `definition` "oneOrMoreStrings".
 */
export type OneOrMoreStrings = string | string[];
/**
 * This interface was referenced by `Skyline`'s JSON-Schema
 * via the `definition` "roll".
 */
export type Roll = Roll1 & (ExactNumber | DiceRoll);
export type ExactNumber = number;
export type DiceRoll = string;
/**
 * A generic title, which is short, human-readable, and generally Title Cased.
 *
 * This interface was referenced by `Skyline`'s JSON-Schema
 * via the `definition` "title".
 */
export type Title = string;

export interface Skyline {
  [k: string]: unknown;
}
/**
 * Notes
 */
export interface Notes {
  [k: string]: unknown;
}
/**
 * Roll
 */
export interface Roll1 {
  [k: string]: unknown;
}
