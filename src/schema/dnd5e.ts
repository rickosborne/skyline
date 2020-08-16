/* tslint:disable */
/**
 * DO NOT MODIFY THIS FILE BY HAND.
 * Original source: data/schema/dnd5e.schema.json
 */

export type ArmorClassAC = number;
/**
 * Armor Type (i.e. Light, Plate, etc.)
 */
export type ArmorType = string;
/**
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "bonus".
 */
export type Bonus = string;
export type EffectiveScore = number;
export type Rating = number | string;
export type XP = number;
/**
 * D&D 5E Class Name
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "className".
 */
export type DD5EClassName =
  | 'Artificer'
  | 'Barbarian'
  | 'Bard'
  | 'Cleric'
  | 'Druid'
  | 'Fighter'
  | 'Monk'
  | 'Paladin'
  | 'Ranger'
  | 'Rogue'
  | 'Sorcerer'
  | 'Warlock'
  | 'Wizard';
export type ExactNumber = number;
export type DiceRoll = string;
/**
 * Damage Type
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "damageType".
 */
export type DamageType = 'Acid' | 'Bludgeoning' | 'Piercing' | 'Slashing';
/**
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "flyFeet".
 */
export type FlySpeedFt = number;
/**
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "hitDie".
 */
export type HitDie = 4 | 6 | 8 | 10 | 12 | 20;
/**
 * Level
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "level".
 */
export type Level = number;
/**
 * Race
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "race".
 */
export type Race = 'Human' | 'Variant Human';
/**
 * Range (feet)
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "rangeFeet".
 */
export type RangeFeet = number;
/**
 * Reach (feet)
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "reachFeet".
 */
export type ReachFeet = number;
/**
 * Skill Name
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "skillName".
 */
export type SkillName =
  | 'Acrobatics'
  | 'Animal Handling'
  | 'Arcana'
  | 'Athletics'
  | 'Deception'
  | 'History'
  | 'Insight'
  | 'Intimidation'
  | 'Investigation'
  | 'Medicine'
  | 'Nature'
  | 'Perception'
  | 'Performance'
  | 'Persuasion'
  | 'Religion'
  | 'Sleight of Hand'
  | 'Stealth'
  | 'Survival';
/**
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "speedFeet".
 */
export type WalkSpeedFt = number;
/**
 * Abbreviated Stat
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "statAbbr".
 */
export type AbbreviatedStat = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
/**
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "swimFeet".
 */
export type SwimSpeedFt = number;

export interface Dnd5E {
  [k: string]: unknown;
}
/**
 * Area Effect
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "areaEffect".
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
 * Armor Class
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "armor".
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
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "attr".
 */
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
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "complexScore".
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
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "challenge".
 */
export interface Challenge {
  rating: Rating;
  xp?: XP;
}
/**
 * Damage
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "damage".
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
  type: 'Acid' | 'Bludgeoning' | 'Piercing' | 'Slashing';
}
/**
 * Roll
 */
export interface Roll {
  [k: string]: unknown;
}
/**
 * External Links
 *
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "link".
 */
export interface Link {
  [k: string]: Link1;
}
/**
 * This interface was referenced by `Link`'s JSON-Schema definition
 * via the `patternProperty` ".*".
 */
export interface Link1 {
  /**
   * URL
   */
  href: string;
  /**
   * Title
   */
  title: string;
}
/**
 * This interface was referenced by `Dnd5E`'s JSON-Schema
 * via the `definition` "passive".
 */
export interface Passive {
  /**
   * This interface was referenced by `Passive`'s JSON-Schema definition
   * via the `patternProperty` ".*".
   */
  [k: string]: number;
}
