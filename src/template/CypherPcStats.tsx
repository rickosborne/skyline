import {h} from "preact";
import {CypherBookReference, CypherPlayerCharacter, CypherStat, CypherStatAbbr, PlayerCharacter} from "../schema/book";
import {ABookTemplate} from "./ABookTemplate";
import {html} from "./hypertext";
import {CYPHER_STAT_TITLES, ifLines, ifPresent, toWords} from "./util";

export interface CypherPlayerCharacterInfo {
	cypher: CypherPlayerCharacter;
	hzd: PlayerCharacter;
}

export class CypherPcStats extends ABookTemplate<CypherPlayerCharacterInfo> {
	public static readonly TEMPLATE_ID = 'cypher-pc-stats';

	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		return super.canRender(dataType, templateId, params) && templateId === CypherPcStats.TEMPLATE_ID;
	}

	convert(data: any, params: Record<string, string>): CypherPlayerCharacterInfo {
		const characterName = params.character;
		const book = this.bookFromAny(data);
		const hzd = this.playerCharacterNamed(characterName, book);
		const cypher = (book.adapter?.cypher?.playerCharacter || [] as CypherPlayerCharacter[]).find(pc => pc.name === characterName);
		if (cypher == null) {
			throw new Error(`Cypher Player Character not found: ${characterName}`);
		}
		return {
			cypher,
			hzd
		};
	}

	ref(title: string, bookRef: CypherBookReference | undefined, className: string = ''): string {
		return html(
			<span class={className} data-endl>
				<span class="ref-title">{title}</span>
				<span class="ref-book-page" data-if-children data-trim>
					<span class="ref-book" data-if-present={bookRef}>{bookRef?.book}</span>
					<span class="ref-page" data-if-present={bookRef}>{bookRef?.page}</span>
				</span>
			</span>
		);
	}

	render(data: CypherPlayerCharacterInfo, params: Record<string, string>): string {
		const {cypher, hzd} = data;
		const mostly = Object.entries((cypher.skill || []).map(s => s.pool).reduce((t, s) => {
			t[s]++;
			return t;
		}, {Intellect: 0, Might: 0, Speed: 0} as Record<CypherStatAbbr, number>)).reduce((best, [stat, count]) => {
			if (count > best.count) {
				return {stat, count};
			} else {
				return best;
			}
		}, {stat: "Intellect" as CypherStatAbbr, count: 0}).stat.toLowerCase();
		const classNames = `block cypher-pc-stat-block col-span-all mostly-${mostly}`;
		// noinspection HtmlDeprecatedTag
		return ifLines([
			html(<h1>{hzd.name}</h1>),
			html(
				<div class={classNames}>
					<article>
						<header class="name">
							<h3 class="title">{toWords(hzd.name)}</h3>
						</header>
						<div class="summary" data-endl>
							<span class="summary-is-a">is {cypher.summary.article || 'a'}</span>
							{this.ref(cypher.summary.adjective, cypher.summary.descriptorRef, 'summary-descriptor')}
							{this.ref(cypher.summary.noun, cypher.summary.typeRef, 'summary-type')}
							<span class="summary-who">who</span>
							{this.ref(cypher.summary.verb, cypher.summary.focusRef, 'summary-focus')}
						</div>
						{this.valueBlock('Tier', cypher.tier)}
						{this.valueBlock('Effort', cypher.effort)}
						{this.valueBlock('XP', '&nbsp;')}
						<section class="stats block">
							{Object.entries(CYPHER_STAT_TITLES).map(([attrKey, title]: [keyof CypherStat, string]) => {
								const attr = cypher.stat[attrKey];
								return html(
									<div class={'stat ' + attrKey.toLowerCase()}>
										<header class="label">{title}</header>
										<div class="pool value">{attr.note ? html(
											<abbr title={ifLines([`Base ${attr.base}`, attr.note], ', ')}>{attr.pool}</abbr>
										) : (attr.pool || '1')}</div>
										<div class="pool legend">Pool</div>
										<div class="edge value">{attr.edge || '1'}</div>
										<div class="edge legend">Edge</div>
									</div>
								);
							})}
						</section>
						<section class="recovery block">
							<div class="rolls">
								<header class="label">Recovery Rolls</header>
								<div class="plus">
									<div class="label">1d6 +</div>
									<div class="value">{cypher.recovery?.roll || '1'}</div>
								</div>
								<div class="action"><abbr title="1 Action">1A</abbr></div>
								<div class="hour"><abbr title="1 Hour">1H</abbr></div>
								<div class="minutes"><abbr title="10 Minutes">10M</abbr></div>
								<div class="hours"><abbr title="10 Hours">10H</abbr></div>
							</div>
							<div class="damage-track">
								<header class="label">Damage Track</header>
								<div class="impaired">Impaired</div>
								<div class="debilitated">Debilitated</div>
							</div>
						</section>
						<section class="special-abilities block">
							<header class="label">Special Abilities</header>
							<dl>
								{ifLines((cypher.ability || [])
									.sort(this.sortByTitle())
									.map(ability => html(
										<div class="detailed">
											<dt>{this.ref(ability.title, ability.bookRef)}</dt>
											<dd data-space data-if-children>
												<span class="familiarity" data-if-present={ability.familiarity}>{ability.familiarity}.</span>
												<span class="cost" data-if-present={ability.cost}>{ability.cost?.num} {ability.cost?.pool} {ability.cost?.num === 1 ? 'point' : 'points'}</span>
												<span class="action" data-if-present={ability.action}>Action.</span>
												<span class="enabler" data-if-present={ability.enabler}>Enabler.</span>
											</dd>
										</div>
									)))}
							</dl>
						</section>
						<section class="advancement block">
							<header class="label">Advancement</header>
							<div class="increase-capabilities">
								<header class="legend">Increase Capabilities</header>
							</div>
							<div class="move-toward-perfection">
								<header class="legend">Move Toward Perfection</header>
							</div>
							<div class="extra-effort">
								<header class="legend">Extra Effort</header>
							</div>
							<div class="skill-training">
								<header class="legend">Skill Training</header>
							</div>
							<div class="other">
								<header class="legend">Other</header>
							</div>
						</section>
						{Object.entries(CYPHER_STAT_TITLES).map(([attr, title]) => html(
							<section class={'block skills ' + attr.toLowerCase()}>
								<table>
									<thead class="label">
									<tr>
										<th class="skill-stat">{title}</th>
										<th><abbr title="Trained">T</abbr></th>
										<th><abbr title="Specialized">S</abbr></th>
										<th><abbr title="Inability">I</abbr></th>
									</tr>
									</thead>
									<tbody>
									{ifLines(cypher.skill
										.filter(s => s.pool === attr)
										.sort(this.sortByTitle())
										.map(skill => html(
											<tr>
												<td class="title">{skill.title}</td>
												<td class={'trained ' + (skill.trained ? 'yes' : 'no')}>{skill.trained ? 'T' : '-'}</td>
												<td class={'specialized ' + (skill.specialized ? 'yes' : 'no')}>{skill.specialized ? 'S' : '-'}</td>
												<td class={'inability ' + (skill.inability ? 'yes' : 'no')}>{skill.inability ? 'I' : '-'}</td>
											</tr>
										)))}
									</tbody>
								</table>
							</section>
						)).join('\n')}
						<section class="attacks block">
							<table>
								<thead class="label">
								<tr>
									<th class="attacks-list">Attacks</th>
									<th><abbr title="Modifier">Mod</abbr></th>
									<th><abbr title="Damage">Dmg</abbr></th>
								</tr>
								</thead>
								<tbody>
								{ifLines((cypher.attack || []).sort(this.sortByTitle()).map(attack => html(
									<tr>
										<td class="title">{attack.title}</td>
										<td class="modifier">{attack.modifier}</td>
										<td class="damage">{attack.damage}</td>
									</tr>
								)))}
								</tbody>
							</table>
						</section>
						<section class="cyphers block">
							<header class="label">Cyphers</header>
							<dl class="cyphers-list">
								{ifLines((cypher.cypher || []).sort(this.sortByTitle()).map(c => html(
									<div class="detailed">
										<dt>{c.title}</dt>
										<dd>
											<span class="level" data-if-children>{c.level}</span>
											<span class="notes" data-if-children>{ifLines(c.note)}</span>
										</dd>
									</div>
								)))}
							</dl>
							<div class="limit">
								<div class="value">{cypher.cypherLimit}</div>
								<header class="legend">Limit</header>
							</div>
						</section>
						<section class="equipment block">
							<header class="label">Equipment</header>
							<div class="armor">
								<div class="value">{cypher.armor}</div>
								<header class="legend">Armor</header>
							</div>
							<div class="currency">
								<div class="value">{cypher.currency}</div>
								<header class="legend">Shards</header>
							</div>
							<dl class="equipment-list">
								{ifLines((cypher.equipment || []).sort(this.sortByTitle()).map(equipment => html(
									<div class="detailed">
										<dt>{equipment.title}</dt>
										<dd data-space data-if-children>
											{ifPresent(equipment.count, c => html(<span class="count">&times;{c}</span>))}
											<span class="notes" data-if-children>{ifLines([equipment.note])}</span>
										</dd>
									</div>
								)))}
							</dl>
						</section>
					</article>
				</div>
			)
		]);
	}

	valueBlock(title: string, value: any, className: string = title.toLowerCase()): string {
		return html(
			<section class={className + ' block'}>
				<header class="label">{title}</header>
				<div class="value">{value}</div>
			</section>
		);
	}

}
