import {h} from "preact";
import {ComplexScore, Dnd5EPlayerCharacter, PlayerCharacter} from "../schema/book";
import {ABookTemplate} from "./ABookTemplate";
import {html} from "./hypertext";
import {DND5E_SENSES, DND5E_STATS, ifLines, LOOKUPS, toWords} from "./util";

export interface PlayerCharacterInfo {
	dnd5e: Dnd5EPlayerCharacter;
	hzd: PlayerCharacter;
}

export const DND5E_PC_TEMPLATE_ID: "dnd5e-pc-stats" = "dnd5e-pc-stats";

export class Dnd5EPcStats extends ABookTemplate<PlayerCharacterInfo> {
	public static readonly TEMPLATE_ID = DND5E_PC_TEMPLATE_ID;

	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		return super.canRender(dataType, templateId, params) && templateId === Dnd5EPcStats.TEMPLATE_ID;
	}

	convert(data: any, params: Record<string, string>): PlayerCharacterInfo {
		const characterName = params.character;
		const book = this.bookFromAny(data);
		const hzd = this.playerCharacterNamed(characterName, book);
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

	render(data: PlayerCharacterInfo): string {
		// noinspection HtmlDeprecatedTag
		return ifLines([
			html(<h1>{data.hzd.name}</h1>),
			data.dnd5e.link != null && data.dnd5e.link.characterDndBeyond != null ? html(
				<p class="col-span-all"><a href={data.dnd5e.link.characterDndBeyond.href}
					rel="external">{data.dnd5e.link.characterDndBeyond.title}</a></p>
			) : '',
			html(
				<div class="dnd5e-pc-block stat-block col-span-all">
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
									const expertise = playerSkill != null && !!playerSkill.expertise;
									const classNames = ['proficient', expertise ? 'expert' : proficient ? 'yes' : 'no'];
									const bonus = Number(data.dnd5e.attr[skill.modifies].bonus) + (proficient ? Number(data.dnd5e.proficiencyBonus) : 0);
									return html(
										<tr>
											<td class={classNames.join(' ')}>
												{proficient ? '&check;' : '&cross;'}
												<abbr data-if-present={expertise} title="+1 from Expertise">+</abbr>
											</td>
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
									const rangeMultiplier = attack.rangeMultiplier == null ? 3 : attack.rangeMultiplier;
									const rangeMax = attack.rangeFeet != null && rangeMultiplier > 0 ? `/${attack.rangeFeet * rangeMultiplier}` : '';
									// noinspection HtmlDeprecatedTag
									return html(
										<tr>
											<td class="type">
												<abbr title={type} class={type.toLowerCase()}>{attack.hands + 'H&nbsp;' + type[0]}</abbr>
											</td>
											<td class="attack">{attack.title}</td>
											<td class="range">
												<abbr title="Reach" data-if-present={attack.reachFeet} data-space>
													<span class="scalar reach" data-trim>{attack.reachFeet}</span>
													<span class="measure">ft.</span>
												</abbr>
												<abbr data-if-present={attack.rangeFeet} title="Range" data-space>
													<span class="scalar range" data-trim>{attack.rangeFeet}{rangeMax}</span>
													<span class="measure">ft.</span>
												</abbr>
											</td>
											<td class="hit">
												{typeof attack.toHit === 'string' ? attack.toHit : `${attack.toHit.stat} ${attack.toHit.num}`}
											</td>
											<td class="damage">
												<abbr title={attack.damage.type} class={attack.damage.type.toLowerCase()} data-space>{String(attack.damage.roll).replace(/\s+/g, '&nbsp;')}</abbr>
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
