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
0.125	2	13		7	35	21	3	2	3	13
0.25	2	13		36	49	42.5	3		4	5	13
0.5	2	13		50	70	60	3		6	8	13
1	2	13		71	85	78	3		9	14	13
2	2	13		86	100	93	3		15	20	13
3	2	13		101	115	108	4		21	26	13
4	2	14		116	130	123	5		27	32	14
5	3	15		131	145	138	6		33	38	15
6	3	15		146	160	153	6		39	44	15
7	3	15		161	175	168	6		45	50	15
8	3	16		176	190	183	7		51	56	16
9	4	16		191	205	198	7		57	62	16
10	4	17		206	220	213	7		63	68	16
11	4	17		221	235	228	8		69	74	17
12	4	17		236	250	243	8		75	80	17
13	5	18		251	265	258	8		81	86	18
14	5	18		266	280	273	8		87	92	18
15	5	18		281	295	288	8		93	98	18
16	5	18		296	310	303	9		99	104	18
17	6	19		311	325	318	10		105	110	19
18	6	19		326	340	333	10		111	116	19
19	6	19		341	355	348	10		117	122	19
20	6	19		356	400	378	10		123	140	19
21	7	19		401	445	423	11		141	158	20
22	7	19		446	490	468	11		159	176	20
23	7	19		491	535	513	11		177	194	20
24	7	19		536	580	558	12		195	212	21
25	8	19		581	625	603	12		213	230	21
26	8	19		626	670	648	12		231	248	21
27	8	19		671	715	693	13		249	266	22
28	8	19		716	760	738	13		267	284	22
29	9	19		761	805	783	13		285	302	22
30	9	19		806	850	828	14		303	320	23
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
	describe(`Machines: ${fileName}`, () => {
		it('loads', () => expect(machine).is.not.null);

		describe('5E', () => {
			const dnd5e = machine.adapter.dnd5e;

			it('has a CR', () => expect(dnd5e.challenge.rating).is.not.null);

			it('has XP', () => expect(dnd5e.challenge.xp).is.not.null);

			it('has stats in range of its CR', () => {
				const cr = dnd5e.challenge.rating;
				const maybeCR = ratings.find(stat => stat.cr == cr);
				expect(maybeCR, `No matching CR state found in table: ${cr}`).is.not.null;
				const crStat = maybeCR as ChallengeRatingStat;
				// TODO: Proficiency Bonus
				// expect(dnd5e.armor.num, 'AC').is.at.most(crStat.ac);
				// expect(dnd5e.hp.average, 'HP average at least').is.at.least(crStat.hpMin * 0.6);  // tuning
				// expect(dnd5e.hp.average, 'HP average at most').is.at.most(crStat.hpMax);
				// TODO: Attack Bonus
				// TODO: Better Damage per Round
				for (let actionId of Object.keys(dnd5e.action || {})) {
					const action = (dnd5e.action || {})[actionId];
					if (Array.isArray(action.onHit)) {
						let damageMultiplier = 1.0;
						if (action.save != null) {
							expect(action.save.difficulty, `${actionId} save DC`).equals(crStat.save);
							damageMultiplier = (1 - ((action.save.difficulty - 4) / 20));
						}
						for (let attack of action.onHit) {
							const attackName = `${actionId}:${attack.type}`;
							// expect(attack.average, attackName).is.at.least(Math.floor(crStat.dmgMin / damageMultiplier / 2));
							// expect(attack.average, attackName).is.at.most(Math.ceil(crStat.dmgMax / damageMultiplier));
						}
					}
				}
				// TODO: Save DC
			});
		});

		describe('Cypher', () => {
			const cypher = machine.adapter.cypher;

			it('has a Level', () => expect(cypher.level).is.not.null);

			it('has a Target Number', () => {
				expect(cypher.target).is.not.null;
				expect(cypher.target).equals(cypher.level * 3);
			});

			it('has an Armor', () => expect(cypher.armor).is.not.null);

			it('has a Damage', () => expect(cypher.damage).is.not.null);

			it('has a Movement', () => expect(cypher.movement).is.not.null);

			it('has a Health', () => {
				expect(cypher.health).is.not.null;
				// expect(cypher.health, 'health >= target').is.at.least(cypher.target);
				// expect(cypher.health, 'health <= target * 4').is.at.most(cypher.target * 4);
			});
		});
	});
});
