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
export type ExactNumber = number;
export type DiceRoll = string;
/**
 * Hands
 */
export type HandCount = number;
/**
 * Range (feet)
 */
export type RangeFeet = number;
/**
 * Reach (feet)
 */
export type ReachFeet = number;
export type Bonus = string;
export type EffectiveScore = number;
export type FlySpeedFt = number;
export type HitDie = 4 | 6 | 8 | 10 | 12 | 20;
export type HitPoints = number;
/**
 * Proficiencies
 */
export type Proficiencies = Proficiency[];
export type WalkSpeedFt = number;
export type SwimSpeedFt = number;
/**
 * Tribe
 */
export type Tribe = 'Banuk' | 'Carja' | 'Nora' | 'Oseram' | 'Shadow Carja' | 'Tenakth' | 'Utaru';

/**
 * Book
 */
export interface Book {
  $id: string;
  $schema: string;
  adapter: AdapterData;
  /**
   * Player Characters
   */
  playerCharacter?: PlayerCharacter[];
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
    area?: AreaEffect;
    damage: Damage;
    hands: HandCount;
    /**
     * Melee?
     */
    melee?: boolean;
    note?: Notes & (string | string[]);
    rangeFeet?: RangeFeet;
    /**
     * Ranged?
     */
    ranged?: boolean;
    reachFeet?: ReachFeet;
    /**
     * Spell?
     */
    spell?: boolean;
    /**
     * Attack Title
     */
    title: string;
    toHit: {
      [k: string]: unknown;
    } & Bonus;
  }[];
  attr: AttributeStats;
  class: LinkedClass;
  flyFeet?: FlySpeedFt;
  hitDie: HitDie;
  hp?: HitPoints;
  initiativeBonus: InitiativeBonus & Bonus;
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
  proficiency?: Proficiencies;
  proficiencyBonus: ProficiencyBonus & Bonus;
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
  swimFeet?: SwimSpeedFt;
}
/**
 * Armor Class
 */
export interface ArmorClass {
  /**
   * Base AC
   */
  base?: number;
  note?: Notes & (string | string[]);
  num: ArmorClassAC;
  type?: ArmorType;
}
/**
 * Notes
 */
export interface Notes {
  [k: string]: unknown;
}
/**
 * Area Effect
 */
export interface AreaEffect {
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
}
/**
 * Damage
 */
export interface Damage {
  /**
   * Average
   */
  avg?: number;
  roll?: Roll & (ExactNumber | DiceRoll);
  /**
   * Damage Type
   */
  type: 'Bludgeoning' | 'Piercing' | 'Slashing';
}
/**
 * Roll
 */
export interface Roll {
  [k: string]: unknown;
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
  score: EffectiveScore | ComplexScore;
  scoreBase?: number;
}
/**
 * Complex Score
 */
export interface ComplexScore {
  /**
   * Base Score
   */
  base: number;
  /**
   * Effective Score
   */
  effective: number;
  note: Notes & (string | string[]);
}
/**
 * Linked Class
 */
export interface LinkedClass {
  /**
   * URL
   */
  href: string;
  /**
   * Class
   */
  title: 'Barbarian';
}
/**
 * Initiative Bonus
 */
export interface InitiativeBonus {
  [k: string]: unknown;
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
/**
 * Proficiency
 */
export interface Proficiency {
  item: Proficiency1 & (string | string[]);
  /**
   * Proficiency Group Title
   */
  title: string;
}
/**
 * Proficiency
 */
export interface Proficiency1 {
  [k: string]: unknown;
}
/**
 * Proficiency Bonus
 */
export interface ProficiencyBonus {
  [k: string]: unknown;
}
/**
 * Player Character
 */
export interface PlayerCharacter {
  /**
   * Name
   */
  name: string;
  tribe?: string | Tribe;
}
