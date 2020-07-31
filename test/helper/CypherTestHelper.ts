export enum TaskDifficulty {
	'Routine' = 0,
	'Simple' = 1,
	'Standard' = 2,
	'Demanding' = 3,
	'Difficult' = 4,
	'Challenging' = 5,
	'Intimidating' = 6,
	'Formidable' = 7,
	'Heroic' = 8,
	'Immortal' = 9,
	'Impossible' = 10,
}

export function taskDifficulty(td: TaskDifficulty): number {
	return td.valueOf();
}

export function taskTargetNumber(td: TaskDifficulty): number {
	return taskDifficulty(td) * 3;
}

export enum Hazard {
	Falling,
	MinorFire,
	MajorFire,
	AcidSplash,
	AcidBath,
	Cold,
	SevereCold,
	Shock,
	Electrocution,
	Crush,
	HugeCrush,
	Collision,
}
