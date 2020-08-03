import * as path from 'path';
import * as fs from 'fs';
import * as console from 'console';
import * as YAML from 'yaml';
import {ActionOnHit, DND5EAction, DND5EAdapter, Machine, MachineAction, MachineAdapters, Variant} from "./Machine";

const dataMachinePath = path.join(__dirname, '..', '..', 'data', 'machine');
const attacksFilePath = path.join(dataMachinePath, 'hzd-machines-attacks.tsv');
const summaryFilePath = path.join(dataMachinePath, 'hzd-machines.tsv');

const makeChanges = true;

interface TsvRecord {
	lineNumber: number;

	opt(name: string): string | undefined;

	optNum(name: string): number | undefined;

	req(name: string): string;

	reqNum(name: string): number;
}

class TsvFile {
	private readonly columns: Record<string, number>;
	private readonly lines: string[][];

	constructor(
		readonly filePath: string
	) {
		this.lines = fs.readFileSync(filePath, {encoding: 'utf8'})
			.split(/\r?\n/g)
			.map(line => line.split('\t'));
		this.columns = (this.lines.shift() || []).reduce((p, c, i) => {
			p[c.toLowerCase()] = i;
			return p;
		}, {} as Record<string, number>);
	}

	public eachLine<T>(block: (record: TsvRecord) => T): T[] {
		return this.lines.map((line, lineNumber0) => {
			const lineNumber = lineNumber0 + 1;
			const opt = (name: string): string | undefined => {
				const colNum = this.columns[name.toLowerCase()];
				if (colNum == null) {
					throw new Error(`Unknown column '${name}' at line ${lineNumber}`);
				}
				const value = line[colNum];
				return value != null && !(value.trim() === '') ? value : undefined;
			};
			const req = (name: string): string => {
				const value = opt(name);
				if (value == null) {
					throw new Error(`Missing value '${name}' at line ${lineNumber}`);
				}
				return value.trim();
			};
			const optNum = (name: string): number | undefined => {
				const value = opt(name);
				if (value == null) {
					return undefined;
				}
				if (!isNaN(value as unknown as number)) {
					return Number(value);
				}
				throw new Error(`Not a number for '${name}' at line ${lineNumber}: ${value}`);
			};
			const reqNum = (name: string, throwIfMissing: boolean = false): typeof throwIfMissing extends boolean ? number : (number | undefined) => {
				const value = optNum(name);
				if (value == null) {
					throw new Error(`Missing number ${name} at line ${lineNumber}`);
				}
				return value;
			};
			try {
				return block({
					lineNumber,
					req,
					opt,
					reqNum,
					optNum,
				});
			} catch (e) {
				console.error(`Error at line ${lineNumber}:`, e);
				throw e;
			}
		});
	}
}

interface DND5EStats {
	coldAvg: number | undefined;
	coldRoll: string | undefined;
	fireAvg: number | undefined;
	fireRoll: string | undefined;
	forceAvg: number | undefined;
	forceRoll: string | undefined;
	hitDie: number;
	lightningAvg: number | undefined;
	lightningRoll: string | undefined;
	normalAvg: number | undefined;
	normalRoll: string | undefined;
	tickAvg: number | undefined;
	tickRoll: string | undefined;
}

interface MachineAttack {
	cleave: string | undefined;
	cooldown: number | undefined;
	dnd5e: DND5EStats;
	lineNumber: number;
	machineName: string;
	multiAttack: number | undefined;
	otherStatus: string | undefined;
	rangeMax: number | undefined;
	rangeMin: number | undefined;
	tickCount: number | undefined;
	tickType: string | undefined;
	timesPerFight: 'A' | number;
	title: string;
}

const attacksTsv = new TsvFile(attacksFilePath);
const attacks = attacksTsv.eachLine(record => {
	const timesPerFight = record.req('Times per Fight');
	const attack: MachineAttack = {
		lineNumber: record.lineNumber,
		machineName: record.req('Machine'),
		title: record.req('Action'),
		timesPerFight: timesPerFight === 'A' ? 'A' : Number(timesPerFight),
		rangeMin: record.optNum('Range Min (m)'),
		rangeMax: record.optNum('Range Max (m)'),
		multiAttack: record.optNum('Multi-Attack'),
		tickCount: record.optNum('Tick Count'),
		tickType: record.opt('Tick Type'),
		cleave: record.opt('Cleave'),
		otherStatus: record.opt('Status'),
		cooldown: record.optNum('Cooldown Turns'),
		dnd5e: {
			hitDie: record.reqNum('5E Hit Die'),
			normalAvg: record.optNum('5E Normal Avg'),
			normalRoll: record.opt('5E Normal Roll'),
			lightningAvg: record.optNum('5E Lightning Avg'),
			lightningRoll: record.opt('5E Lightning Roll'),
			coldAvg: record.optNum('5E Cold Avg'),
			coldRoll: record.opt('5E Cold Roll'),
			fireAvg: record.optNum('5E Fire Avg'),
			fireRoll: record.opt('5E Fire Roll'),
			forceAvg: record.optNum('5E Force Avg'),
			forceRoll: record.opt('5E Force Roll'),
			tickAvg: record.optNum('5E Tick Avg'),
			tickRoll: record.opt('5E Tick Roll'),
		}
	};
	return attack;
});

const machines = attacks.reduce((p, c) => {
	const machineName = c.machineName.toLowerCase();
	if (!Array.isArray(p[machineName])) {
		p[machineName] = [];
	}
	p[machineName].push(c);
	return p;
}, {} as Record<string, MachineAttack[]>);

// Cypher Level	Cypher Target Num	Cypher Health	Cypher Damage

interface MachineSummary {
	machineName: string;
	wikiLink: string;
	hzdSize: string;
	hzdClass: string;
	overrides: string | undefined;
	hzdChallenge: number;
	hp: number;
	weak: string | undefined;
	strong: string | undefined;
	difficulty: number;
	hpScale: number;
	dmgPerTurn: number;
	dmgPerTurnScale: number;
	impact: number;
	impactScale: number;
	dnd5e: {
		hitDie: number,
		cr: number | string,
		hp: number,
		dmgPerRound: number,
		dmgDivisor: number,
	},
	cypher: {
		level: number,
		target: number,
		health: number,
		damage: number,
	},
}

const summaryTsv = new TsvFile(summaryFilePath);
const summaries = summaryTsv.eachLine(r => {
	const reqStr = r.req('5E CR');
	const cr: number | string = isNaN(reqStr as unknown as number) ? reqStr : Number(reqStr);
	const summary: MachineSummary = {
		machineName: r.req('Machine'),
		wikiLink: r.req('Link'),
		hzdSize: r.req('Size'),
		hzdClass: r.req('Class'),
		overrides: r.opt('Override'),
		hzdChallenge: r.reqNum('Challenge'),
		hp: r.reqNum('HP'),
		weak: r.opt('Weakness'),
		strong: r.opt('Strength'),
		difficulty: r.reqNum('Difficulty'),
		hpScale: r.reqNum('HP Scale'),
		dmgPerTurn: r.reqNum('Damage/Turn'),
		dmgPerTurnScale: r.reqNum('Damage/Turn Scale'),
		impact: r.reqNum('Impact'),
		impactScale: r.reqNum('Impact Scale'),
		dnd5e: {
			hitDie: r.reqNum('5E Hit Dice'),
			cr,
			hp: r.reqNum('5E HP'),
			dmgPerRound: r.reqNum('5E Dmg/Round'),
			dmgDivisor: r.reqNum('Damage Divisor')
		},
		cypher: {
			level: r.reqNum('Cypher Level'),
			health: r.reqNum('Cypher Health'),
			damage: r.reqNum('Cypher Damage'),
			target: r.reqNum('Cypher Target Number'),
		}
	};
	return summary;
});

function logUpdate<T extends Record<string, any>, K extends string & keyof T, U extends T[K]>(target: T, key: K, updatedValue: U, path: string): void {
	const existing = target[key] as U;
	if (existing == null) {
		console.log(`\tAdding ${path}.${key}: ${updatedValue}`);
		if (makeChanges) {
			target[key] = updatedValue;
		}
	} else if (existing !== updatedValue) {
		console.log(`\tUpdating ${path}.${key}: ${existing} => ${updatedValue}`);
		if (makeChanges) {
			target[key] = updatedValue;
		}
	} else {
		// console.log(`\tUnchanged: ${path}.${key}: ${updatedValue}`);
	}
}

function traverse<T extends Record<string, any>, K extends string & keyof T, U extends T[K]>(target: T, key: K, defaultValue: () => U, parentPath: string, block: (value: U, childPath: string) => U | undefined | void = v => v): void {
	const existing = target[key] as U;
	const replacement = block(existing || defaultValue(), parentPath + '.' + key);
	if (replacement != null && replacement !== existing && makeChanges) {
		console.log(`\tTraverse updating ${parentPath}.${key}`);
		target[key] = replacement;
	}
}

function like<T>(target: T[], predicate: (item: T) => boolean, defaultValue: () => T | undefined, parentPath: string, block: (value: T, childPath: string) => T | undefined | void = v => v): void {
	const existingIndex = target.findIndex(predicate);
	const value = existingIndex < 0 ? defaultValue() : target[existingIndex];
	if (value == null) {
		return;
	}
	const replacement = block(value, parentPath + '[' + existingIndex + ']');
	if (replacement != null && (existingIndex < 0 || replacement !== value) && makeChanges) {
		if (existingIndex < 0) {
			console.log(`\tPushing to ${parentPath}`);
			target.push(replacement);
		} else {
			console.log(`\tUpdating ${parentPath}[${existingIndex}]`);
			target[existingIndex] = replacement;
		}
	}
}

function camelCase(s: string): string {
	return s.split(/\W+/g)
		.map((t, i) => {
			const lc = t.toLowerCase();
			if (i === 0) {
				return lc;
			}
			return t.length < 2 ? t.toUpperCase() : (t[0].toUpperCase() + t.substr(1));
		})
		.join('');
}

YAML.scalarOptions.str.fold.lineWidth = 0;

interface OnHitMapper {
	prefix: string;
	pred: (oh: ActionOnHit) => boolean;
	type?: string;
	getAvg: (s: DND5EStats) => number;
	getRoll: (s: DND5EStats) => string;
}

const onHitMappers = [{
	prefix: 'normal',
	pred: oh => ['bludgeoning', 'piercing', 'slashing', 'TODO'].includes(oh.type),
	type: 'TODO',
	getAvg: s => s.normalAvg,
	getRoll: s => s.normalRoll,
}, {
	prefix: 'fire',
	pred: oh => oh.type === 'fire',
	getAvg: s => s.fireAvg,
	getRoll: s => s.fireRoll,
}, {
	prefix: 'lightning',
	pred: oh => oh.type === 'lightning',
	getAvg: s => s.lightningAvg,
	getRoll: s => s.lightningRoll,
}, {
	prefix: 'cold',
	pred: oh => oh.type === 'cold',
	getAvg: s => s.coldAvg,
	getRoll: s => s.coldRoll,
}, {
	prefix: 'force',
	pred: oh => oh.type === 'force',
	getAvg: s => s.forceAvg,
	getRoll: s => s.forceRoll,
}] as OnHitMapper[];

for (let attacks of Object.values(machines)) {
	const machineName = attacks[0].machineName;
	const hitDie = attacks[0].dnd5e.hitDie;
	const fileName = machineName.toLowerCase().replace(/[^a-z]+/g, '');
	const yamlPath = path.join(dataMachinePath, `${machineName.toLowerCase()}.machine.yaml`);
	const summary = summaries.find(s => s.machineName.toLowerCase() === machineName.toLowerCase());
	if (summary == null) {
		throw new Error(`Could not find summary for ${machineName}`);
	}
	const corrupted = summaries.find(s => s.machineName.toLowerCase() === machineName.toLowerCase() + ", corrupted");
	const daemonic = summaries.find(s => s.machineName.toLowerCase() === machineName.toLowerCase() + ", daemonic");
	if (fs.existsSync(yamlPath)) {
		console.log(`Machine: ${machineName} (${fileName})`);
		const originalYaml = fs.readFileSync(yamlPath, {encoding: 'utf8'});
		const def: Machine = YAML.parse(originalYaml);
		traverse(def, 'adapter', () => ({}) as MachineAdapters, '$', (adapter, adapterPath) => {
			traverse(adapter, 'dnd5e', () => ({}) as DND5EAdapter, adapterPath, (dnd5e, dnd5ePath) => {
				logUpdate(dnd5e, 'hitDie', hitDie, dnd5ePath);
				traverse(def, 'action', () => [] as MachineAction[], '$', (actions, actionsPath) => {
					for (let attack of attacks) {
						const stats5e = attack.dnd5e;
						like(actions, a => a.title === attack.title, () => ({
							title: attack.title,
							description: 'TODO',
							id: camelCase(attack.title),
						}) as MachineAction, actionsPath, (action) => {
							traverse(dnd5e, 'action', () => ({}) as Record<string, DND5EAction>, dnd5ePath, (dnd5eActions, dnd5eActionsPath) => {
								traverse(dnd5eActions, action.id, () => ({
									description: 'TODO',
									toHit: 'TODO',
									onHit: [],
								}) as DND5EAction, dnd5eActionsPath, (dnd5eAction, dnd5eActionPath) => {
									// logUpdate(dnd5eAction, 'target', attack.cleave === '*' ? 'all' : (attack.multiAttack || 1), dnd5eActionPath);
									// logUpdate(dnd5eAction, 'reachFeet', attack.rangeMax == null ? undefined : attack.rangeMax * 3, dnd5eActionPath);
									// logUpdate(dnd5eAction, 'melee', !(attack.rangeMin == null || attack.rangeMin >= 5), dnd5eActionPath);
									// logUpdate(dnd5eAction, 'ranged', !(attack.rangeMax == null || attack.rangeMax < 5), dnd5eActionPath);
									traverse(dnd5eAction, 'onHit', () => [] as ActionOnHit[], dnd5eActionPath, (onHits, onHitsPath) => {
										for (let part of onHitMappers) {
											const avg = part.getAvg(stats5e);
											const roll = part.getRoll(stats5e);
											if ((avg == null && roll != null) || (avg != null && roll == null)) {
												throw new Error(`Mismatched avg(${avg})/roll(${roll}) at ${onHitsPath}:${part.prefix} on line ${attack.lineNumber}`);
											} else if (avg == null) {
												continue;
											}
											like(onHits, part.pred, () => ({
												type: part.type || part.prefix,
											}) as ActionOnHit, onHitsPath, (onHit, onHitPath) => {
												logUpdate(onHit, 'average', avg, onHitPath);
												logUpdate(onHit, 'roll', roll, onHitPath);
												return onHit;
											});
										}
										return onHits.length > 0 ? onHits : undefined;
									});
									return dnd5eAction;
								});
								return dnd5eActions;
							});
							return action;
						});
					}
					return actions;
				});
				return dnd5e;
			});
			return adapter;
		});
		const updatedYaml = YAML.stringify(def, {
			sortMapEntries: false,
		});
		if (originalYaml !== updatedYaml) {
			fs.writeFileSync(yamlPath, updatedYaml, {encoding: "utf8"});
		}
	} else {
		const variant: Record<string, Variant> = {
			base: {
				hp: summary.hp,
				challengeLevel: summary.hzdChallenge
			}
		};
		if (corrupted != null) {
			variant.corrupted = {
				hp: corrupted.hp,
				challengeLevel: corrupted.hzdChallenge,
			};
		}
		if (daemonic != null) {
			variant.daemonic = {
				hp: daemonic.hp,
				challengeLevel: daemonic.hzdChallenge,
			};
		}
		const machine: Machine = {
			id: camelCase(machineName),
			title: machineName,
			plural: machineName,
			lang: 'en-US',
			overrideSource: summary.overrides,
			link: {
				horizonWiki: summary.wikiLink,
			},
			size: summary.hzdSize,
			role: summary.hzdClass,
			variant,
			action: attacks.map(attack => ({
				id: camelCase(attack.title),
				title: attack.title,
				description: 'TODO',
				effect: attack.timesPerFight !== 'A'
			}) as MachineAction),
			component: {},
			adapter: {
				cypher: {
					damage: summary.cypher.damage,
					level: summary.cypher.level,
					health: summary.cypher.health,
					target: summary.cypher.target,
					armor: 0,
					movement: 'Short',
				},
				dnd5e: {
					armor: {
						num: 0,
						type: 'TODO'
					},
					attr: {
						STR: {
							score: 0,
							bonus: 'TODO'
						},
						DEX: {
							score: 0,
							bonus: 'TODO'
						},
						CON: {
							score: 0,
							bonus: 'TODO'
						},
						INT: {
							score: 0,
							bonus: 'TODO'
						},
						WIS: {
							score: 0,
							bonus: 'TODO'
						},
						CHA: {
							score: 0,
							bonus: 'TODO'
						},
					},
					speedFeet: 0,
					hitDie: summary.dnd5e.hitDie,
					hp: {
						average: summary.dnd5e.hp,
						roll: 'TODO'
					},
					challenge: {
						rating: summary.dnd5e.cr === '1/2' ? 0.5 : Number(summary.dnd5e.cr),
						xp: -1,
					},
					action: attacks.reduce((action, attack) => {
						const id = camelCase(attack.title);
						const dnd5e = attack.dnd5e;
						action[id] = {
							description: 'TODO',
							target: attack.cleave === '*' ? 'all' : attack.multiAttack,
							onHit: onHitMappers.map(mapper => {
								const roll = mapper.getRoll(dnd5e);
								const avg = mapper.getAvg(dnd5e);
								if ((roll == null && avg != null) || (roll != null && avg == null)) {
									throw new Error(`Mismatched avg(${avg})/roll(${roll}) in ${id} for ${machineName}`);
								}
								return avg == null ? undefined : ({
									type: mapper.type || mapper.prefix,
									roll: roll,
									average: avg
								}) as ActionOnHit;
							}).filter(oh => oh != null) as ActionOnHit[],
						};
						return action;
					}, {} as Record<string, DND5EAction>),
				}
			},
		};
		const yaml = YAML.stringify(Object.assign({['$schema']: '../schema/machine.schema.json'}, machine), {sortMapEntries: false});
		const fileName = machineName.toLowerCase().replace(/[^a-z]+/g, '');
		fs.writeFileSync(path.join(dataMachinePath, `${fileName}.machine.yaml`), yaml, {encoding: "utf8"});
	}
}
