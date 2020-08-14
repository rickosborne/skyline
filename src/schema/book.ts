/* tslint:disable */
/**
 * DO NOT MODIFY THIS FILE BY HAND.
 * Original source: book.schema.json
 */

export type ArmorClassAC = number;
/**
 * Armor Type (i.e. Light, Plate, etc.)
 */
export type ArmorType = string;
export type Bonus = string;
export type Score = number;
export type HitDie = 4 | 6 | 8 | 10 | 12 | 20;
export type HitPoints = number;
export type WalkSpeedFt = number;

/**
 * Book
 */
export interface Book {
  $id: string;
  $schema: string;
  adapter: AdapterData;
  /**
   * Title
   */
  title: string;
}
/**
 * Adapter-specific data
 */
export interface AdapterData {
  dnd5e: Dnd5EAdapter;
}
/**
 * D&D 5E specifics
 */
export interface Dnd5EAdapter {
  /**
   * Player Characters
   */
  playerCharacter: Dnd5EPlayerCharacter[];
}
/**
 * Player Character
 */
export interface Dnd5EPlayerCharacter {
  /**
   * Other Actions
   */
  action?: {
    note?: {
      [k: string]: unknown;
    } & (string | string[]);
    /**
     * Title
     */
    title?: string;
  }[];
  armor: ArmorClass;
  /**
   * Attacks
   */
  attack?: {
    /**
     * Area
     */
    area?: {
      /**
       * Count of areas
       */
      count?: number;
      /**
       * Radius (feet)
       */
      radiusFeet?: number;
      /**
       * Shape
       */
      shape?: 'CUBE' | 'SPHERE';
      /**
       * Length Each Side (feed)
       */
      sideFeet?: number;
    };
    /**
     * Damage
     */
    damage?: {
      /**
       * Average
       */
      avg?: number;
      roll?: {
        [k: string]: unknown;
      } & (number | string);
      /**
       * Damage Type
       */
      type?: 'Bludgeoning' | 'Piercing' | 'Slashing';
    };
    /**
     * Hands
     */
    hands?: number;
    /**
     * Melee?
     */
    melee?: boolean;
    note?: {
      [k: string]: unknown;
    } & (string | string[]);
    /**
     * Range (feet)
     */
    rangeFeet?: number;
    /**
     * Ranged?
     */
    ranged?: boolean;
    /**
     * Reach (feet)
     */
    reachFeet?: number;
    /**
     * Spell?
     */
    spell?: boolean;
    /**
     * Attack Title
     */
    title?: string;
    toHit?: {
      [k: string]: unknown;
    } & Bonus;
  }[];
  attr: AttributeStats;
  /**
   * Class
   */
  class: {
    /**
     * URL
     */
    href?: string;
    /**
     * Class
     */
    title?: 'Barbarian';
  };
  hitDie: HitDie;
  hp?: HitPoints;
  initiativeBonus: {
    [k: string]: unknown;
  } & Bonus;
  /**
   * Level
   */
  level: number;
  /**
   * External Links
   */
  link?: {
    [k: string]: Link;
  };
  /**
   * Name
   */
  name: string;
  passive: Passive;
  /**
   * Proficiencies
   */
  proficiency?: unknown[];
  proficiencyBonus: {
    [k: string]: unknown;
  } & Bonus;
  /**
   * Race
   */
  race: 'Human' | 'Variant Human';
  /**
   * Skills
   */
  skill?: {
    bonus?: Bonus;
    /**
     * Proficient?
     */
    proficient?: boolean;
    stat?: {
      [k: string]: unknown;
    } & ('STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA');
    /**
     * Skill Name
     */
    title: string;
  }[];
  speedFeet: WalkSpeedFt;
}
/**
 * Armor Class
 */
export interface ArmorClass {
  /**
   * Base AC
   */
  base?: number;
  note?: {
    [k: string]: unknown;
  } & (string | string[]);
  num: ArmorClassAC;
  type?: ArmorType;
}
export interface AttributeStats {
  [k: string]: Attribute;
}
/**
 * This interface was referenced by `AttributeStats`'s JSON-Schema definition
 * via the `patternProperty` ".*".
 */
export interface Attribute {
  bonus: Bonus;
  score:
    | Score
    | {
        /**
         * Base Score
         */
        base?: number;
        /**
         * Effective Score
         */
        effective?: number;
        note?: {
          [k: string]: unknown;
        } & (string | string[]);
        [k: string]: unknown;
      };
  scoreBase?: number;
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` ".*".
 */
export interface Link {
  /**
   * URL
   */
  href: string;
  /**
   * Title
   */
  title: string;
}
export interface Passive {
  /**
   * This interface was referenced by `Passive`'s JSON-Schema definition
   * via the `patternProperty` ".*".
   */
  [k: string]: number;
}
