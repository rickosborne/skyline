import * as fs from "fs";
import * as path from "path";
import {h} from "preact";
import * as YAML from "yaml";
import {Machine} from "../schema/machine";
import {ATemplate} from "./ATemplate";
import {html} from "./hypertext";
import {ifLines, ifPresent, LOOKUPS, toWords} from "./util";

export class CypherCreature extends ATemplate<Machine> {
	canRender(dataType: string, templateId: string, params: Record<string, string>): boolean {
		return dataType === 'machine' && templateId === 'cypher-creature';
	}

	convert(data: any, params: Record<string, string>): Machine {
		const machine: Machine = data;
		if (machine.adapter != null && machine.adapter.cypher != null) {
			return machine;
		}
		throw new Error(`Not a machine, or missing Cypher data`);
	}

	getData(dataType: string, dataName: string, params: Record<string, string>): object | undefined {
		if (dataType !== 'machine') {
			return undefined;
		}
		const text = fs.readFileSync(path.join(__dirname, "..", "..", "data", "machine", `${dataName}.${dataType}.yaml`), {encoding: "utf8"});
		return YAML.parse(text);
	}

	render(data: Machine, params: Record<string, string>): string {
		return ifLines([
			html(<h1>{data.title}</h1>),
			ifPresent(data?.link?.horizonWiki, hw => html(
				<p class="col-span-all">For additional flavor, see the <a href={hw} rel="external">Horizon Wiki on {data.title}</a>.</p>
			)),
			html(
				<div class="cypher-stat-block stat-block">
					<article>
						<header class="title">
							<h3>{toWords(data.title)}</h3>
							<aside class="level-and-target">{data.adapter.cypher.level} ({data.adapter.cypher.target})</aside>
						</header>
						<section class="stats-tab">
							<table class="stats">
								<thead>
								<tr>
									<th><abbr title="Level">LEV</abbr></th>
									<th><abbr title="Target Number">TAR</abbr></th>
									<th><abbr title="Health">HEA</abbr></th>
									<th><abbr title="Armor">ARM</abbr></th>
									<th><abbr title="Damage">DAM</abbr></th>
									<th><abbr title="Movement">MOV</abbr></th>
								</tr>
								</thead>
								<tbody>
								<tr>
									<td>{data.adapter.cypher.level}</td>
									<td>{data.adapter.cypher.target}</td>
									<td>{data.adapter.cypher.health}</td>
									<td>{data.adapter.cypher.armor}</td>
									<td>{data.adapter.cypher.damage}</td>
									<td>{data.adapter.cypher.movement}</td>
								</tr>
								</tbody>
							</table>
						</section>
						<section class="points" data-if-children>
							<dl class="point-list" data-if-children>
								{this.renderDetailedList(data.adapter.cypher, {
									'Motive': c => c.modifications,
									'Movement': c => c.movementNotes,
									'Modifications': c => c.modifications,
									'Interaction': c => c.interaction,
									'Use': c => c.use,
									'GM Intrusion': c => c.intrusion,
								})}
							</dl>
						</section>
						<section class="combats" data-if-children>
							<header data-if-siblings>
								<h4>Combat</h4>
							</header>
							<p data-markdown="1" data-if-children>
								{ifLines([data.adapter.cypher.combatNotes])}
							</p>
							<dl data-if-children class="combat-list">
								{ifLines(data.action.filter(a => a.attack).map(a => this.renderDetailedItem(a.title, a.description)))}
							</dl>
						</section>
						<section class="components" data-if-children>
							<header data-if-siblings>
								<h4>Components</h4>
							</header>
							<dl data-if-children class="component-list">
								{ifLines(Object.keys(data.component || {})
									.sort((a, b) => a === 'body' ? -1 : b === 'body' ? 1 : a.localeCompare(b))
									.map(cid => {
										const c = (data.component || {})[cid];
										const tear = c.remove ? 'Can tear loose.' : null;
										let explode = null;
										if (c.explode != null) {
											const explodeDamageType = LOOKUPS.cypher.hazardFromHZD[c.explode.element] || 'Collision';
											const explodeRange = LOOKUPS.cypher.range.find(r => c.explode != null && r.ftAway >= c.explode.rangeFeet);
											explode = `Explodes when destroyed for ${explodeDamageType} damage to all creatures within ${explodeRange == null ? `${c.explode.rangeFeet} ft` : `${explodeRange.name} range`}.`;
										}
										const damage = ifPresent(c.damage, damage => ('Takes ' + Object.keys(damage).map(d => d === 'all' ? `${damage.all}&times; damage (all types)` : `${damage[d]}&times; ${LOOKUPS.cypher.hazardFromHZD[d] || d} damage`).join(', ') + '.'));
										const contains = c.loot == null || cid === 'body' ? null : ('Contains: ' + c.loot.map(l => `${this.renderQuantity(l.quantity, '&times;')} ${l.title}`).join(', ') + '.');
										const nonTitle = ifLines([tear, damage, explode, contains]);
										return cid === 'body' && nonTitle === '' ? '' : this.renderDetailedItem(c.title, nonTitle);
									}))}
							</dl>
						</section>
						<section class="loot-items" data-if-children>
							<header data-if-siblings>
								<h4>Loot</h4>
							</header>
							<table class="loot-list" data-if-children>
								<thead data-if-siblings>
								<tr>
									<th>Item</th>
									<th class="loot-percent">Probability</th>
									<th class="loot-qty">Quantity</th>
								</tr>
								</thead>
								<tbody data-if-children>
								{ifLines(Object.values(data.component || {})
									.flatMap(c => c.loot || [])
									.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
									.map(l => html(
										<tr>
											<td class="loot-title">{l.title}</td>
											<td class="loot-percent">{l.percent}%</td>
											<td class="loot-qty">{this.renderQuantity(l.quantity, '&times;')}</td>
										</tr>
									)))}
								</tbody>
							</table>
						</section>
					</article>
				</div>
			)
		]);
	}

}
