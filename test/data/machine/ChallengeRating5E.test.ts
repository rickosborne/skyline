import {expect} from 'chai';
import 'mocha';
import {eachMachine} from '../../helper/MachineTestHelper';

interface ChallengeRatingStat {
	ac: number;
	atk: number;
	cr: number | string;
	dmgMax: number;
	dmgMin: number;
	hpMax: number;
	hpMin: number;
	prof: number;
	save: number;
}

// PHB page 274
const ratings = `
# CR, Prof, AC, HPMin, HPMax, Atk, DmgMin, DmgMax, Save
0   2   13   1   6   3   0   1   13
1/8 2   13   7  35   3   2   3   13
1/4 2   13  36  49   3   4   5   13
1/2 2   13  50  70   3   6   8   13
1   2   13  71  85   3   9  14   13
2   2   13  86 100   3  15  20   13
`
	.trim()
	.split(/[\r\n]+/g)
	.filter(line => line != null && line.trim().length > 0 && !line.startsWith('#'))
	.map(line => line.split(/\s+/g))
	.map(stat => ({
		cr: stat[0].includes('/') ? stat[0] : Number(stat[0]),
		prof: Number(stat[1]),
		ac: Number(stat[2]),
		hpMin: Number(stat[3]),
		hpMax: Number(stat[4]),
		atk: Number(stat[5]),
		dmgMin: Number(stat[6]),
		dmgMax: Number(stat[7]),
		save: Number(stat[8]),
	} as ChallengeRatingStat));

eachMachine((machine, fileName) => {
	describe(fileName, () => {
		it('loads', () => expect(machine).is.not.null);

		it('has a CR', () => expect(machine.adapter.dnd5e.challenge.rating).is.not.null);

		it('has XP', () => expect(machine.adapter.dnd5e.challenge.xp).is.not.null);

		it('has stats in range of its CR', () => {
			const dnd5e = machine.adapter.dnd5e;
			const cr = dnd5e.challenge.rating;
			const maybeCR = ratings.find(stat => stat.cr == cr);
			expect(maybeCR, `No matching CR state found in table: ${cr}`).is.not.null;
			const crStat = maybeCR as ChallengeRatingStat;
			// TODO: Proficiency Bonus
			expect(dnd5e.armor.num, 'AC').is.at.most(crStat.ac);
			expect(dnd5e.hp.average, 'HP average at least').is.at.least(crStat.hpMin);
			expect(dnd5e.hp.average, 'HP average at most').is.at.most(crStat.hpMax);
			// TODO: Attack Bonus
			// TODO: Better Damage per Round
			for (let actionId of Object.keys(dnd5e.action)) {
				const action = dnd5e.action[actionId];
				if (Array.isArray(action.onHit)) {
					let damageMultiplier = 1.0;
					if (action.save != null) {
						expect(action.save.difficulty, `${actionId} save DC`).equals(crStat.save);
						damageMultiplier = (1 - ((action.save.difficulty - 4) / 20));
					}
					for (let attack of action.onHit) {
						const attackName = `${actionId}:${attack.type}`;
						expect(attack.average, attackName).is.at.least(Math.floor(crStat.dmgMin / damageMultiplier));
						expect(attack.average, attackName).is.at.most(Math.ceil(crStat.dmgMax / damageMultiplier));
					}
				}
			}
			// TODO: Save DC
		});
	});
});
