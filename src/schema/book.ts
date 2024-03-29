/* tslint:disable */
/**
 * DO NOT MODIFY THIS FILE BY HAND.
 * Original source: data/schema/book.schema.json
 */

export type AbilityIsAction = boolean;
export type CypherBook = 'CSR' | 'Predation';
export type CypherBookPageNumber = number;
export type CypherAbilityCostValue = number;
export type CypherAbilityCostPlus = boolean;
export type CypherStatAbbr = 'Intellect' | 'Might' | 'Speed';
export type AbilityIsEnabler = boolean;
export type CypherFamiliarity = 'Inability' | 'Practiced' | 'Specialized' | 'Trained';
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
 * The "a/an" part of the character summary
 */
export type CypherSummaryArticle = 'a' | 'an' | 'the';
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
/**
 * Count
 */
export type Count = number;
export type CypherEquipmentList = CypherEquipment[];
export type ExactNumber = number;
export type DiceRoll = string;
export type CypherStatBase = number;
export type CypherStatEdge = number;
export type CypherStatPool = number;
export type CypherTier = number;
export type CypherWeaponAbilityHindered = boolean;
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
 * URL
 */
export type ClassURL = string;
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
 *
 * This interface was referenced by `Book`'s JSON-Schema
 * via the `definition` "tribe".
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
 *
 * This interface was referenced by `Book`'s JSON-Schema
 * via the `definition` "adapter".
 */
export interface AdapterData {
  cypher: CypherAdapter;
  dnd5e: DD5EAdapter;
}
/**
 * Cypher System specifics
 *
 * This interface was referenced by `Book`'s JSON-Schema
 * via the `definition` "cypherAdapter".
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
  action?: AbilityIsAction;
  bookRef?: CypherBookReference;
  cost?: CypherAbilityCost;
  enabler?: AbilityIsEnabler;
  familiarity?: CypherFamiliarity;
  note?: Notes & (string | string[]);
  title: Title;
}
export interface CypherBookReference {
  book: CypherBook;
  page: CypherBookPageNumber;
}
export interface CypherAbilityCost {
  num: CypherAbilityCostValue;
  plus?: CypherAbilityCostPlus;
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
  article?: CypherSummaryArticle;
  descriptorRef?: CypherBookReference;
  focusRef?: CypherBookReference;
  noun: CypherSummaryNoun;
  typeRef?: CypherBookReference;
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
  weapon?: CypherWeaponAbilities;
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
  count?: Count;
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
  base?: CypherStatBase;
  edge?: CypherStatEdge;
  note?: Notes & (string | string[]);
  pool: CypherStatPool;
}
export interface CypherWeaponAbilities {
  [k: string]: CypherWeaponAbility;
}
/**
 * This interface was referenced by `CypherWeaponAbilities`'s JSON-Schema definition
 * via the `patternProperty` ".*".
 */
export interface CypherWeaponAbility {
  familiarity?: CypherFamiliarity;
  hindered?: CypherWeaponAbilityHindered;
}
/**
 * D&D 5E specifics
 *
 * This interface was referenced by `Book`'s JSON-Schema
 * via the `definition` "dnd5eAdapter".
 */
export interface DD5EAdapter {
  playerCharacter: DND5EPlayerCharacters;
}
/**
 * Player Character
 *
 * This interface was referenced by `Book`'s JSON-Schema
 * via the `definition` "dnd5ePlayerCharacter".
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
  href: ClassURL;
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
 *
 * This interface was referenced by `Book`'s JSON-Schema
 * via the `definition` "playerCharacter".
 */
export interface PlayerCharacter {
  /**
   * Name
   */
  name: string;
  tribe?: 'unknown' | TribeName;
}
