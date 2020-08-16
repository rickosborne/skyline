/* tslint:disable */
/**
 * DO NOT MODIFY THIS FILE BY HAND.
 * Original source: data/schema/book.schema.json
 */

export type CypherAbilityCostValue = number;
export type CypherStatAbbr = 'Intellect' | 'Might' | 'Speed';
/**
 * A generic title, which is short, human-readable, and generally Title Cased.
 */
export type Title = string;
export type CypherAbilityList = CypherAbility[];
export type CharacterName = string;
export type CypherCompanionAccompanies = CharacterName[];
export type CypherArmor = number;
export type CypherHealth = number;
export type CypherCharacterInteractionLevel = number;
export type IsInability = boolean;
export type IsSpecialized = boolean;
export type IsTrained = boolean;
export type CypherSkillList = CypherSkillListItem[];
/**
 * This is the Adjective part of the character summary.
 */
export type CypherSummaryAdjective = string;
/**
 * This is the Noun part of the character summary.
 */
export type CypherSummaryNoun = string;
/**
 * This is the Verb part of the character summary.
 */
export type CypherSummaryVerb = string;
export type CypherCompanions = CypherCompanion[];
export type CypherAttackDamage = number;
export type CypherAttackModifier = string;
export type CypherAttacks = CypherAttack[];
export type CypherCompanionName = string;
export type CypherCurrency = number;
export type CypherCypherLevel = number;
export type CypherCyphers = CypherCypher[];
export type CypherCypherLimit = number;
export type CypherEffort = number;
export type CypherEquipmentList = CypherEquipment[];
export type ExactNumber = number;
export type DiceRoll = string;
export type CypherStatEdge = number;
export type CypherStatPool = number;
export type CypherTier = number;
export type CypherPlayerCharacters = CypherPlayerCharacter[];
/**
 * Other Actions
 */
export type DD5EOtherActions = {
  note?: Notes & (string | string[]);
  title?: Title;
}[];
export type ArmorClassAC = number;
/**
 * Armor Type (i.e. Light, Plate, etc.)
 */
export type ArmorType = string;
/**
 * Hands
 */
export type HandCount = number;
/**
 * Range (feet)
 */
export type RangeFeet = number;
export type RangeMultiplier = number;
/**
 * Reach (feet)
 */
export type ReachFeet = number;
export type Bonus = string;
export type DCNumber = number;
/**
 * Abbreviated Stat
 */
export type AbbreviatedStat = 'STR' | 'DEX' | 'CON' | 'INT' | 'WIS' | 'CHA';
/**
 * Attacks
 */
export type DD5EAttacks = DD5EAttack[];
export type EffectiveScore = number;
/**
 * D&D 5E Class Name
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
export type FlySpeedFt = number;
export type HitDie = 4 | 6 | 8 | 10 | 12 | 20;
export type HitPoints = number;
/**
 * Proficiencies
 */
export type Proficiencies = ProficiencyGroup[];
export type ProficiencyForSavingThrows = AbbreviatedStat[];
/**
 * Expertise?
 */
export type IsExpert = boolean;
/**
 * Proficient?
 */
export type IsProficient = boolean;
/**
 * Skill Name
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
 * Skills
 */
export type DD5ESkills = DD5ESkill[];
export type WalkSpeedFt = number;
export type SwimSpeedFt = number;
/**
 * Player Characters
 */
export type DND5EPlayerCharacters = Dnd5EPlayerCharacter[];
/**
 * Tribe
 */
export type TribeName = 'Banuk' | 'Carja' | 'Nora' | 'Oseram' | 'Shadow Carja' | 'Tenakth' | 'Utaru';
/**
 * Player Characters
 */
export type PlayerCharacters = PlayerCharacter[];

/**
 * Book
 */
export interface Book {
  $id: string;
  $schema: string;
  adapter: AdapterData;
  playerCharacter?: PlayerCharacters;
  title: Title;
}
/**
 * Adapter-specific data
 */
export interface AdapterData {
  cypher: CypherAdapter;
  dnd5e: DD5EAdapter;
}
/**
 * Cypher System specifics
 */
export interface CypherAdapter {
  companion?: CypherCompanions;
  playerCharacter: CypherPlayerCharacters;
}
export interface CypherCompanion {
  ability?: CypherAbilityList;
  accompany?: CypherCompanionAccompanies;
  armor?: CypherArmor;
  benefit?: CypherCompanionCharacterBenefit & (string | string[]);
  health?: CypherHealth;
  interactionLevel?: CypherCharacterInteractionLevel;
  name: CharacterName;
  skill?: CypherSkillList;
  summary: CypherCharacterSummary;
}
export interface CypherAbility {
  cost?: CypherAbilityCost;
  note?: Notes & (string | string[]);
  title: Title;
}
export interface CypherAbilityCost {
  num: CypherAbilityCostValue;
  pool: CypherStatAbbr;
}
/**
 * Notes
 */
export interface Notes {
  [k: string]: unknown;
}
export interface CypherCompanionCharacterBenefit {
  [k: string]: unknown;
}
export interface CypherSkillListItem {
  inability?: IsInability;
  pool: CypherStatAbbr;
  specialized?: IsSpecialized;
  title: Title;
  trained?: IsTrained;
}
export interface CypherCharacterSummary {
  adjective: CypherSummaryAdjective;
  noun: CypherSummaryNoun;
  verb: CypherSummaryVerb;
}
export interface CypherPlayerCharacter {
  ability?: CypherAbilityList;
  armor?: CypherArmor;
  attack?: CypherAttacks;
  companion?: CypherCompanionName;
  currency?: CypherCurrency;
  cypher?: CypherCyphers;
  cypherLimit?: CypherCypherLimit;
  effort: CypherEffort;
  equipment?: CypherEquipmentList;
  name: CharacterName;
  recovery?: CypherRecovery;
  skill: CypherSkillList;
  stat: CypherStat;
  summary: CypherCharacterSummary;
  tier: CypherTier;
}
export interface CypherAttack {
  damage: CypherAttackDamage;
  modifier?: CypherAttackModifier;
  title: Title;
}
export interface CypherCypher {
  level: CypherCypherLevel;
  note: Notes & (string | string[]);
  title: Title;
}
export interface CypherEquipment {
  note?: Notes & (string | string[]);
  title: Title;
}
export interface CypherRecovery {
  roll: Roll & (ExactNumber | DiceRoll);
}
/**
 * Roll
 */
export interface Roll {
  [k: string]: unknown;
}
export interface CypherStat {
  Intellect: CypherStatSummary;
  Might: CypherStatSummary;
  Speed: CypherStatSummary;
}
export interface CypherStatSummary {
  edge?: CypherStatEdge;
  pool: CypherStatPool;
}
/**
 * D&D 5E specifics
 */
export interface DD5EAdapter {
  playerCharacter: DND5EPlayerCharacters;
}
/**
 * Player Character
 */
export interface Dnd5EPlayerCharacter {
  action?: DD5EOtherActions;
  armor: ArmorClass;
  attack?: DD5EAttacks;
  attr: AttributeStats;
  class: LinkedClass;
  defense?: Defenses & (string | string[]);
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
  name: CharacterName;
  passive: Passive;
  proficiency?: Proficiencies;
  proficiencyBonus: ProficiencyBonus & Bonus;
  /**
   * Race
   */
  race: 'Human' | 'Variant Human';
  savingThrow?: SavingThrow;
  skill?: DD5ESkills;
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
 * Attack
 */
export interface DD5EAttack {
  area?: AreaEffect;
  damage: Damage;
  hands: HandCount;
  /**
   * Melee?
   */
  melee?: boolean;
  note?: Notes & (string | string[]);
  rangeFeet?: RangeFeet;
  rangeMultiplier?: RangeMultiplier;
  /**
   * Ranged?
   */
  ranged?: boolean;
  reachFeet?: ReachFeet;
  /**
   * Spell?
   */
  spell?: boolean;
  title: Title;
  toHit: {
    [k: string]: unknown;
  } & (Bonus | HitDC);
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
  type: 'Acid' | 'Bludgeoning' | 'Piercing' | 'Slashing';
}
export interface HitDC {
  num: DCNumber;
  stat: AbbreviatedStat;
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
  title: DD5EClassName;
}
export interface Defenses {
  [k: string]: unknown;
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
export interface ProficiencyGroup {
  item: ProficiencyTitle & (string | string[]);
  title: Title;
}
/**
 * Proficiency
 */
export interface ProficiencyTitle {
  [k: string]: unknown;
}
/**
 * Proficiency Bonus
 */
export interface ProficiencyBonus {
  [k: string]: unknown;
}
export interface SavingThrow {
  advantage?: AdvantageOnSavingThrows & (string | string[]);
  proficient: ProficiencyForSavingThrows;
}
export interface AdvantageOnSavingThrows {
  [k: string]: unknown;
}
/**
 * Skill
 */
export interface DD5ESkill {
  bonus?: Bonus;
  expertise?: IsExpert;
  proficient?: IsProficient;
  stat?: AbbreviatedStat;
  title: SkillName;
}
/**
 * Player Character
 */
export interface PlayerCharacter {
  /**
   * Name
   */
  name: string;
  tribe?: string | TribeName;
}
