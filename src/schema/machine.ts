/* tslint:disable */
/**
 * DO NOT MODIFY THIS FILE BY HAND.
 * Original source: data/schema/machine.schema.json
 */

/**
 * It the action an attack which may be used in combat?
 */
export type IsAttack = boolean;
/**
 * Human-readable description of the action, without any adapter-specific language
 */
export type Description = string | string[];
/**
 * Is the action an effect which might combine with other actions?
 */
export type IsEffect = boolean;
/**
 * Programmatic identifier unique to this object
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "id".
 */
export type ID = string;
/**
 * Human-readable name for the action
 */
export type Title = string;
/**
 * Actions the machine may take
 */
export type Actions = Action[];
export type Armor = number;
export type URL = string;
export type Title1 = string;
export type DamageInflicted = number;
export type Health = number;
export type Level = number;
export type Movement = 'Long' | 'Short';
export type TargetNumber = number;
export type IsAMeleeWeaponAttack = boolean;
export type MinRangeFt = number;
export type AverageDamage = number;
export type DamageFormula = string;
export type Type = 'bludgeoning' | 'cold' | 'corruption' | 'fire' | 'force' | 'lightning' | 'piercing' | 'slashing';
/**
 * On-hit effects
 */
export type Hit1 = Hit[];
export type IsARangedWeaponAttack = boolean;
export type ReachFt = number;
export type DC = number;
export type HalfOnSuccess = boolean;
export type ToHitModifier = string;
export type ArmorClassAC = number;
/**
 * Armor Type (i.e. Light, Plate, etc.)
 */
export type ArmorType = string;
export type Bonus = string;
export type EffectiveScore = number;
export type Rating = number | string;
export type XP = number;
export type FlySpeedFt = number;
export type HitDie = 4 | 6 | 8 | 10 | 12 | 20;
export type AverageHP = number;
export type Roll = string;
/**
 * This interface was referenced by `SkillModifiers`'s JSON-Schema definition
 * via the `patternProperty` ".*".
 */
export type Modifier = string;
export type WalkSpeedFt = number;
export type SwimSpeedFt = number;
/**
 * % of overall machine health this component can take in damage before the component is destroyed
 */
export type Health1 = number;
/**
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "elementKey".
 */
export type Element1 = 'corruption' | 'explosion' | 'fire' | 'freeze' | 'shock';
export type RangeFt = number;
/**
 * Probability of undamaged recovery, in %
 */
export type Recovery = number;
export type ExactQuantity = number;
export type MaximumQuantity = number;
export type MinimumQuantity = number;
/**
 * Shards obtained by selling to a vendor
 */
export type ResaleValue = number;
/**
 * Human-readable title
 */
export type Title2 = string;
/**
 * Items present for potential removal
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "loot".
 */
export type Loot = Item[];
/**
 * Whether the component can be torn free
 */
export type Removable = boolean;
/**
 * Relative difficulty to hit
 */
export type DifficultyToTarget = 'Easy' | 'Normal' | 'Moderate' | 'Tricky' | 'Hard' | 'Epic';
/**
 * Human-readable name of the component
 */
export type Title3 = string;
/**
 * ISO 639-1 language code for human-readable text in this object
 */
export type LanguageCode = string;
/**
 * URL
 *
 * This interface was referenced by `Links`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z0-9]+$".
 */
export type URL1 = string;
export type OverrideSource = 'unknown' | 'none' | 'EPSILON' | 'PSI' | 'RHO' | 'SIGMA' | 'XI' | 'ZETA';
/**
 * Display name for multiple items
 */
export type Plural = string;
export type RoleClass = 'Acquisition' | 'Chariot' | 'Combat' | 'Reconnaissance' | 'Transport';
export type SizeClass = 'Large' | 'Medium' | 'Small';
/**
 * Display name appropriate for human readers
 */
export type Title4 = string;
export type ChallengeLevel = number;
/**
 * Hit Points
 */
export type HitPoints = number;

/**
 * Machine (NPC)
 */
export interface Machine {
  $schema?: string;
  action: Actions;
  adapter: AdapterData;
  component?: Components;
  id: ID;
  lang?: LanguageCode;
  link?: Links;
  overrideSource: OverrideSource;
  plural: Plural;
  role: RoleClass;
  size: SizeClass;
  strong?: Element2;
  title: Title4;
  variant: Variants;
  weak?: Element2;
}
/**
 * Action the machine may take
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "action".
 */
export interface Action {
  attack?: IsAttack;
  description?: Description;
  effect?: IsEffect;
  id: ID;
  title: Title;
}
/**
 * Adapter-specific data
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "adapter".
 */
export interface AdapterData {
  cypher: Cypher;
  dnd5e: DD5E;
}
/**
 * Cypher specifics
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "cypherAdapter".
 */
export interface Cypher {
  armor: Armor;
  basedOn?: BasedOn;
  combatNotes?: CombatNotes & (string | string[]);
  damage: DamageInflicted;
  health: Health;
  interaction?: Interaction & (string | string[]);
  intrusion?: GMIntrusion & (string | string[]);
  level: Level;
  lootNotes?: LootNotes & (string | string[]);
  modifications?: Modifications & (string | string[]);
  motive?: Motives & (string | string[]);
  movement: Movement;
  movementNotes?: MovementNotes & (string | string[]);
  target?: TargetNumber;
  use?: Use & (string | string[]);
}
/**
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "basedOn".
 */
export interface BasedOn {
  href?: URL;
  title?: Title1;
}
export interface CombatNotes {
  [k: string]: unknown;
}
export interface Interaction {
  [k: string]: unknown;
}
export interface GMIntrusion {
  [k: string]: unknown;
}
export interface LootNotes {
  [k: string]: unknown;
}
export interface Modifications {
  [k: string]: unknown;
}
export interface Motives {
  [k: string]: unknown;
}
export interface MovementNotes {
  [k: string]: unknown;
}
export interface Use {
  [k: string]: unknown;
}
/**
 * D&D 5E specifics
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "dnd5eAdapter".
 */
export interface DD5E {
  /**
   * Action specifics for D&D 5E
   */
  action?: {
    [k: string]: Action1;
  };
  armor: ArmorClass;
  attr: AttributeStats;
  basedOn?: BasedOn;
  challenge: Challenge;
  flyFeet?: FlySpeedFt;
  hitDie: HitDie;
  hp: HP;
  passive?: Passive;
  skill?: SkillModifiers;
  speedFeet: WalkSpeedFt;
  swimFeet?: SwimSpeedFt;
}
/**
 * This interface was referenced by `undefined`'s JSON-Schema definition
 * via the `patternProperty` "^[a-z]+([A-Z][a-z]+)*$".
 */
export interface Action1 {
  /**
   * Human-readable description of the action
   */
  description?: string | string[];
  melee?: IsAMeleeWeaponAttack;
  minRangeFeet?: MinRangeFt;
  onHit?: Hit1;
  ranged?: IsARangedWeaponAttack;
  reachFeet?: ReachFt;
  save?: Save;
  target?: number | string;
  toHit?: ToHitModifier;
}
/**
 * Damage upon hit
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "onHit".
 */
export interface Hit {
  average?: AverageDamage;
  roll?: DamageFormula;
  type?: Type;
}
export interface Save {
  attribute: 'Strength' | 'Dexterity' | 'Constitution' | 'Intelligence' | 'Wisdom' | 'Charisma';
  difficulty: DC;
  half?: HalfOnSuccess;
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
export interface Challenge {
  rating: Rating;
  xp?: XP;
}
export interface HP {
  average: AverageHP;
  roll?: Roll;
}
export interface Passive {
  /**
   * This interface was referenced by `Passive`'s JSON-Schema definition
   * via the `patternProperty` ".*".
   */
  [k: string]: number;
}
export interface SkillModifiers {
  [k: string]: Modifier;
}
/**
 * Targetable parts of the machine
 */
export interface Components {
  [k: string]: Component;
}
/**
 * Component
 *
 * This interface was referenced by `Components`'s JSON-Schema definition
 * via the `patternProperty` ".*".
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "component".
 */
export interface Component {
  damage?: Element;
  damagePercent: Health1;
  explode?: Explosion;
  loot?: Loot;
  remove: Removable;
  targetDifficulty?: DifficultyToTarget;
  /**
   * Targeting notes
   */
  targetNotes?: string | string[];
  title: Title3;
}
/**
 * Element
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "elementDecimal".
 */
export interface Element {
  /**
   * Multiplier for this damage type
   *
   * This interface was referenced by `Element`'s JSON-Schema definition
   * via the `patternProperty` ".*".
   */
  [k: string]: number;
}
export interface Explosion {
  element: Element1;
  rangeFeet: RangeFt;
}
/**
 * Loot item
 */
export interface Item {
  id: ID;
  percent?: Recovery;
  quantity?: ExactQuantity | RandomQuantity;
  sell?: ResaleValue;
  title?: Title2;
}
export interface RandomQuantity {
  max?: MaximumQuantity;
  min?: MinimumQuantity;
}
/**
 * Links to external resources
 */
export interface Links {
  [k: string]: URL1;
}
/**
 * Element
 *
 * This interface was referenced by `Machine`'s JSON-Schema
 * via the `definition` "elementBoolean".
 */
export interface Element2 {
  /**
   * This interface was referenced by `Element2`'s JSON-Schema definition
   * via the `patternProperty` ".*".
   */
  [k: string]: boolean;
}
/**
 * Known variant forms
 */
export interface Variants {
  /**
   * Machine Variant
   *
   * This interface was referenced by `Variants`'s JSON-Schema definition
   * via the `patternProperty` ".*".
   */
  [k: string]: {
    challengeLevel: ChallengeLevel;
    hp: HitPoints;
  };
}
