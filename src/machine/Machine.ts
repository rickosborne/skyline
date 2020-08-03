export interface StatScoreBonus {
	bonus: string;
	score: number;
}

export interface BasedOn {
	href: string;
	title: string;
}

export interface CypherAdapter {
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
}

export interface ActionOnHit {
	average: number;
	roll: string;
	type: string;
}

export interface DND5EAction {
	description?: string;
	melee?: boolean;
	minRangeFeet?: number;
	onHit?: ActionOnHit[];
	ranged?: boolean;
	reachFeet?: number;
	save?: {
		attribute: string;
		difficulty: number;
		half: boolean;
	};
	target?: number | 'all';
	toHit?: string;
};

export interface DND5EAdapter {
	action: Record<string, DND5EAction>;
	armor: {
		num: number;
		type: string;
	};
	attr: {
		STR: StatScoreBonus;
		DEX: StatScoreBonus;
		CON: StatScoreBonus;
		INT: StatScoreBonus;
		WIS: StatScoreBonus;
		CHA: StatScoreBonus;
	};
	basedOn?: BasedOn;
	challenge: {
		rating: number;
		xp: number;
	};
	hitDie: number;
	hp: {
		average: number;
		roll: string;
	};
	passive?: Record<string, number>;
	speedFeet: number;
}

export interface MachineAdapters {
	cypher: CypherAdapter;
	dnd5e: DND5EAdapter;
}

export interface MachineAction {
	description: string;
	effect: boolean;
	id: string;
	title: string;
}

export interface LootItem {
	id: string;
	percent: number;
	quantity: number | {
		min: number;
		max: number;
	};
	title: string;
}

export interface MachineComponent {
	damage: Record<string, number>;
	damagePercent: number;
	explode: {
		rangeFeet: number;
		element: string;
	};
	loot: LootItem[];
	remove: boolean;
	targetDifficulty: string;
	title: string;
}

export interface Variant {
	challengeLevel: number;
	hp: number;
}

export interface Machine {
	action: MachineAction[];
	adapter: MachineAdapters;
	component: Record<string, MachineComponent>;
	id: string;
	lang: string;
	link: Record<string, string>;
	overrideSource?: string;
	plural: string;
	role: string;
	size: string;
	title: string;
	variant: Record<string, Variant>;
}
