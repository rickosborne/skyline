/* tslint:disable */
/**
 * DO NOT MODIFY THIS FILE BY HAND.
 * Original source: data/schema/cypher.schema.json
 */

export type AbilityIsAction = boolean;
export type CypherBook = 'CSR' | 'Predation';
export type CypherBookPageNumber = number;
export type CypherAbilityCostValue = number;
export type CypherAbilityCostPlus = boolean;
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "statAbbr".
 */
export type CypherStatAbbr = 'Intellect' | 'Might' | 'Speed';
export type AbilityIsEnabler = boolean;
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "familiarity".
 */
export type CypherFamiliarity = 'Inability' | 'Practiced' | 'Specialized' | 'Trained';
/**
 * A generic title, which is short, human-readable, and generally Title Cased.
 */
export type Title = string;
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "abilities".
 */
export type CypherAbilityList = CypherAbility[];
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "armor".
 */
export type CypherArmor = number;
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
export type CharacterName = string;
export type CypherCompanionAccompanies = CharacterName[];
export type CypherHealth = number;
export type CypherCharacterInteractionLevel = number;
export type IsInability = boolean;
export type IsSpecialized = boolean;
export type IsTrained = boolean;
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "skills".
 */
export type CypherSkillList = CypherSkillListItem[];
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

export interface Cypher {
  [k: string]: unknown;
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
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "bookRef".
 */
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
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "characterSummary".
 */
export interface CypherCharacterSummary {
  adjective: CypherSummaryAdjective;
  article?: CypherSummaryArticle;
  descriptorRef?: CypherBookReference;
  focusRef?: CypherBookReference;
  noun: CypherSummaryNoun;
  typeRef?: CypherBookReference;
  verb: CypherSummaryVerb;
}
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "companion".
 */
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
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "playerCharacter".
 */
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
/**
 * This interface was referenced by `Cypher`'s JSON-Schema
 * via the `definition` "statSummary".
 */
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
