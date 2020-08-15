import * as fs from "fs";
import * as path from "path";
import {h} from "preact";
import * as YAML from "yaml";
import {Book, ComplexScore, Dnd5EPlayerCharacter, PlayerCharacter} from "../schema/book";
import {ATemplate} from "./ATemplate";
import {html} from "./hypertext";
import {DND5E_SENSES, DND5E_STATS, ifLines, LOOKUPS, toWords} from "./util";

export interface PlayerCharacterInfo {
	dnd5e: Dnd5EPlayerCharacter;
	hzd: PlayerCharacter;
}

export class Dnd5EPcStats extends ATemplate<PlayerCharacterInfo> {
	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		return dataType === "book" && templateId === "dnd5e-pc-stats";
	}

	convert(data: any, params: Record<string, string>): PlayerCharacterInfo {
		const book = data as Book;
		const characterName = params.character;
		if (characterName == null) {
			throw new Error(`No Character Name given in template params: ${JSON.stringify(params)}`);
		}
		const hzd = (book.playerCharacter || [] as PlayerCharacter[]).find(pc => pc.name === characterName);
		if (hzd == null) {
			throw new Error(`HZD Character not found: ${characterName}`);
		}
		const dnd5e = (book.adapter?.dnd5e?.playerCharacter || [] as Dnd5EPlayerCharacter[]).find(pc => pc.name === characterName);
		if (dnd5e == null) {
			throw new Error(`5E Character not found: ${characterName}`);
		}
		return {
			dnd5e,
			hzd
		};
	}

	// noinspection JSMethodCanBeStatic
	private effectiveScore(score: number | ComplexScore) {
		return typeof score == 'number' ? score : score.effective;
	}

	getData(dataType: string, dataName: string, params: Record<string, string>): object | undefined {
		if (dataType !== 'book') {
			return undefined;
		}
		const text = fs.readFileSync(path.join(__dirname, "..", "..", "story", dataName, "book.yaml"), {encoding: "utf8"});
		return YAML.parse(text);
	}

	render(data: PlayerCharacterInfo): string {
		// noinspection HtmlDeprecatedTag
		return ifLines([
			html(<h2>{data.hzd.name}</h2>),
			data.dnd5e.link != null && data.dnd5e.link.characterDndBeyond != null ? html(
				<p><a href={data.dnd5e.link.characterDndBeyond.href}
							rel="external">{data.dnd5e.link.characterDndBeyond.title}</a></p>
			) : '',
			html(
				<div class="dnd5e-pc-block stat-block">
					<article>
						<header class="name">
							<h3 class="title">{toWords(data.hzd.name)}</h3>
						</header>
						<p class="size-and-type">
							<em>{data.dnd5e.race} ({data.hzd.tribe}),
								<a href={data.dnd5e.class.href} rel="external"
									 title={data.dnd5e.class.title + " on D&D Beyond"}>{data.dnd5e.class.title}</a>,
								Level {data.dnd5e.level}</em>
						</p>
						<section class="stats">
							{DND5E_STATS.map(stat => {
								const attr = data.dnd5e.attr[stat.attr];
								const score = this.effectiveScore(attr.score);
								const note = typeof attr.score === 'number' ? undefined : attr.score.note;
								const base = typeof attr.score === 'number' ? attr.score : attr.score.base;
								return html(
									<div class="stat block">
										<header class="label"><abbr title={stat.title}>{stat.attr}</abbr></header>
										<div class="modifier">{attr.bonus}</div>
										<div class="value legend">{note ? html(<abbr
											title={ifLines([`Base ${base}`, note], ', ')}>{score}</abbr>) : score}</div>
									</div>
								)
							})}
						</section>
						<section class="senses block">
							<header class="label">Senses</header>
							<div class="group">
								{ifLines(DND5E_SENSES.map(sense => {
									const score = this.effectiveScore(data.dnd5e.attr[sense.modifies].score);
									const effective = score + data.dnd5e.proficiencyBonus;
									return html(
										<div class="sense">
											<div class="value">{data.dnd5e.passive[sense.title] || effective}</div>
											<div class="title">{sense.title}</div>
											<div class="based-on">({sense.modifies})</div>
										</div>
									);
								}))}
							</div>
						</section>
						<section class="proficiencies block">
							<header class="label">Proficiencies</header>
							<dl>
								{ifLines((data.dnd5e.proficiency || []).map(prof => html(
									<div class="detailed">
										<dt>{prof.title}</dt>
										<dd>{ifLines(prof.item, ', ')}</dd>
									</div>
								)))}
							</dl>
						</section>
						<section class="skills block">
							<header class="label">Skills</header>
							<table>
								<thead>
								<tr>
									<th class="proficient"><abbr title="Proficient?">Pr</abbr></th>
									<th class="modifies"><abbr title="Modifies">Mod</abbr></th>
									<th class="skill-name">Skill</th>
									<th class="bonus">Bonus</th>
								</tr>
								</thead>
								<tbody>
								{ifLines(LOOKUPS.dnd5e.skill.map(skill => {
									const playerSkill = (data.dnd5e.skill || []).find(s => s.title === skill.title);
									const proficient = playerSkill != null && !!playerSkill.proficient;
									const classNames = ['proficient', proficient ? 'yes' : 'no'];
									const bonus = Number(data.dnd5e.attr[skill.modifies].bonus) + (proficient ? Number(data.dnd5e.proficiencyBonus) : 0);
									return html(
										<tr>
											<td class={classNames.join(' ')}>{proficient ? '&check;' : '&cross;'}</td>
											<td class="modifies">{skill.modifies}</td>
											<td class="skill-name">{skill.title}</td>
											<td class="bonus">{bonus < 0 ? bonus : `+${bonus}`}</td>
										</tr>
									);
								}))}
								</tbody>
							</table>
						</section>
						<section class="proficiency-bonus block">
							<header class="label">Proficiency Bonus</header>
							<div class="value">{data.dnd5e.proficiencyBonus}</div>
						</section>
						<section class="walking-speed block">
							<header class="label">Speed</header>
							<div class="value">
								<span class="scalar">{data.dnd5e.speedFeet}</span> <span class="measure">ft.</span>
								<marquee data-unwrap data-if-present={data.dnd5e.flyFeet}>
									, fly <span class="scalar">{data.dnd5e.flyFeet}</span> <span class="measure">ft.</span>
								</marquee>
								<marquee data-unwrap data-if-present={data.dnd5e.swimFeet}>
									, swim <span class="scalar">{data.dnd5e.swimFeet}</span> <span class="measure">ft.</span>
								</marquee>
							</div>
						</section>
						<section class="initiative block">
							<header class="label">Initiative Bonus</header>
							<div class="value">{data.dnd5e.initiativeBonus}</div>
						</section>
						<section class="armor-class block">
							<header class="label">Armor Class</header>
							<div class="value">{data.dnd5e.armor.note ? html(
								<abbr
									title={ifLines([`Base ${data.dnd5e.armor.base}, `, data.dnd5e.armor.note])}>{data.dnd5e.armor.num}</abbr>
							) : data.dnd5e.armor.num}</div>
						</section>
						<section class="hit-points block">
							<header class="label">Hit Points</header>
							<div class="value">{data.dnd5e.hp}</div>
						</section>
						<section class="attacks block">
							<header class="label">Attacks</header>
							<table>
								<thead>
								<tr>
									<th class="type">Type</th>
									<th class="attack">Attack</th>
									<th class="range">Range</th>
									<th class="hit">Hit/DC</th>
									<th class="damage">Damage</th>
									<th class="notes">Notes</th>
								</tr>
								</thead>
								<tbody>
								{ifLines((data.dnd5e.attack || []).map(attack => {
									const type = attack.melee ? 'Melee' : attack.ranged ? 'Ranged' : attack.spell ? 'Spell' : 'Unknown';
									// noinspection HtmlDeprecatedTag
									return html(
										<tr>
											<td class="type"><abbr title={type} class={type.toLowerCase()}>{type[0]}</abbr></td>
											<td class="attack">{attack.title}</td>
											<td class="range">
												<marquee data-if-present={attack.reachFeet} data-unwrap>
													<span class="scalar reach">{attack.reachFeet}</span> <span class="measure">ft.</span> Reach
												</marquee>
												<marquee data-if-present={attack.rangeFeet} data-unwrap>
													<span class="scalar range">{attack.rangeFeet}</span> <span class="measure">ft.</span> Range
												</marquee>
											</td>
											<td class="hit">{attack.toHit}</td>
											<td class="damage">
												<abbr title={attack.damage.type}
															class={attack.damage.type.toLowerCase()}>{String(attack.damage.roll).replace(/\s+/g, '&nbsp;')}&nbsp;({attack.hands}H)</abbr>
											</td>
											<td class="notes">{ifLines([attack.note], ', ')}</td>
										</tr>
									)
								}))}
								</tbody>
							</table>
						</section>
						<section class="actions block">
							<header class="label">Actions</header>
							<dl>
								{ifLines((data.dnd5e.action || []).map(action => html(
									<div class="detailed">
										<dt>{action.title}</dt>
										<dd data-markdown="1">{ifLines([action.note])}</dd>
									</div>
								)))}
							</dl>
						</section>
					</article>
				</div>
			)
		]);
	}
}
