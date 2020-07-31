import * as fs from 'fs';
import * as path from 'path';
import 'mocha';
import * as yaml from 'yaml';

const dataMachinePath = path.join(__dirname, '..', '..', 'data', 'machine');

interface StatScoreBonus {
	bonus: string;
	score: number;
}

interface BasedOn {
	href: string;
	title: string;
}

export interface Machine {
	action: {
		id: string;
		title: string;
		description: string;
		effect: boolean;
	}[];
	adapter: {
		cypher: {
			armor: number;
			basedOn?: BasedOn;
			combatNotes?: string | string[];
			damage: number;
			health: number;
			interaction?: string | string[];
			level: number;
			lootNotes?: string | string[];
			modifications?: string | string[];
			motive?: string | string[];
			movement: 'Long' | 'Short';
			movementNotes?: string | string[];
			target: number;
			use?: string | string[];
		};
		dnd5e: {
			basedOn: BasedOn;
			hp: {
				average: number;
				roll: string;
			};
			speedFeet: number;
			passive: {
				[key: string]: number;
			};
			challenge: {
				rating: number;
				xp: number;
			};
			attr: {
				STR: StatScoreBonus;
				DEX: StatScoreBonus;
				CON: StatScoreBonus;
				INT: StatScoreBonus;
				WIS: StatScoreBonus;
				CHA: StatScoreBonus;
			};
			armor: {
				num: number;
				type: string;
			};
			action: {
				[key: string]: {
					description?: string;
					melee?: boolean;
					toHit?: string;
					reachFeet?: number;
					target?: number;
					save?: {
						attribute: string;
						difficulty: number;
						half: boolean;
					};
					onHit?: {
						average: number;
						roll: string;
						type: string;
					}[];
					minRangeFeet?: number;
					ranged?: boolean;
				};
			};
		};
	};
	component: {
		[key: string]: {
			remove: boolean;
			title: string;
			damagePercent: number;
			targetDifficulty: string;
			damage: {
				[key: string]: number;
			};
			explode: {
				rangeFeet: number;
				element: string;
			};
			loot: {
				id: string;
				title: string;
				percent: number;
				quantity: number | {
					min: number;
					max: number;
				};
			}[];
		};
	};
	id: string;
	lang: string;
	link: {
		[key: string]: string;
	};
	overrideSource: string;
	plural: string;
	role: string;
	size: string;
	title: string;
	variant: {
		[key: string]: {
			challengeLevel: number;
			hp: number;
		};
	};
}

export function eachMachine(eachMachineCallback: (machine: Machine, fileName: string) => void) {
	const machineYamlFileNames = fs.readdirSync(dataMachinePath, {withFileTypes: true, encoding: "utf8"})
		.filter(entry => entry.isFile() && entry.name.endsWith('.machine.yaml'))
		.map(entry => entry.name);

	for (let machineYamlFileName of machineYamlFileNames) {
		const machineYaml = fs.readFileSync(path.join(dataMachinePath, machineYamlFileName), {encoding: "utf8"});
		const machine = yaml.parse(machineYaml) as Machine;
		eachMachineCallback(machine, machineYamlFileName);
	}
}

