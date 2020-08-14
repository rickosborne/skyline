import {h} from 'preact';
import {Action, Component, DD5E, Item, Machine, RandomQuantity} from '../schema/machine';
import {ATemplate} from "./ATemplate";
import {html} from './hypertext';
import {DND5E_STAT_ATTR, DND5E_STATS, getLookups, ifLines, Lookups, toWords} from "./util";

const LOOKUPS: Lookups = getLookups();

const BODY = 'body';

export class Dnd5ENpcStats extends ATemplate<Machine> {
	canRender(dataType: string, templateId: string): boolean {
		return dataType === 'machine' && templateId === 'dnd5e-npc-stats';
	}

	convert(data: any): Machine {
		const machine: Machine = data as Machine;
		if (machine.adapter != null && machine.title != null) {
			return machine;
		}
		throw new Error(`Not a machine: ${JSON.stringify(data)}`);
	}

	render(data: Machine): string {
		return ifLines([
			html(<h2>{data.title}</h2>),
			html(
				<p data-if-children data-space>
					<marquee data-unwrap data-if-present={data.adapter.dnd5e.basedOn} data-space>
						{data.plural} are modified from the stock
						<a href={data.adapter.dnd5e.basedOn?.href} rel="external">{data.adapter.dnd5e.basedOn?.title}</a>.
					</marquee>
					<marquee data-unwrap data-if-present={data.link?.horizonWiki} data-space>
						For additional flavor, see the <a href={data.link?.horizonWiki} rel="external">Horizon Wiki
						on {data.title}</a>.
					</marquee>
				</p>
			),
			html(
				<div class="dnd5e-stat-block stat-block">
					<article>
						<header class="name-and-size">
							<h3 class="title">{toWords(data.title)}</h3>
							<p class="size-and-type"><em>{LOOKUPS.dnd5e.sizeFromHZD[data.size.toLowerCase()]} machine</em></p>
						</header>
						<section class="ac-hp-speed">
							<p class="ac">
								<strong>Armor Class:</strong> {data.adapter.dnd5e.armor.num} {data.adapter.dnd5e.armor.type}
							</p>
							<p class="hp" data-space>
								<strong>Hit Points:</strong>
								<span class="roll-average">{data.adapter.dnd5e.hp.average}</span>
								<span class="roll-dice">({data.adapter.dnd5e.hp.roll})</span>
							</p>
							<p class="speed" data-space>
								<strong>Speed:</strong>
								{data.adapter.dnd5e.flyFeet ? ' walk ' : ''}
								<span class="scalar">{data.adapter.dnd5e.speedFeet}</span> <span class="measure">ft.</span>
								<marquee data-unwrap data-if-present={data.adapter.dnd5e.flyFeet}>
									, fly <span class="scalar">{data.adapter.dnd5e.flyFeet}</span> <span class="measure">ft.</span>
								</marquee>
								<marquee data-unwrap data-if-present={data.adapter.dnd5e.swimFeet}>
									, swim <span class="scalar">{data.adapter.dnd5e.swimFeet}</span> <span class="measure">ft.</span>
								</marquee>
							</p>
						</section>
						<table class="stats">
							<thead>
							<tr>
								{DND5E_STATS.map(stat => `<th aria-label="${stat.title}">${stat.attr}</th>`).join('\n')}
							</tr>
							</thead>
							<tbody>
							<tr>
								{DND5E_STAT_ATTR.map(attr => `<td>${data.adapter.dnd5e.attr[attr].score} (${data.adapter.dnd5e.attr[attr].bonus})</td>`).join('\n')}
							</tr>
							</tbody>
						</table>
						<section class="additional-stats">
							<p class="skills" data-if-children data-space>
								<strong data-if-siblings>Skills:</strong>
								{Object.keys(data.adapter.dnd5e.skill || []).sort().map(p => `${p} ${(data.adapter.dnd5e.skill || {})[p]}`).join(', ')}
							</p>
							{this.renderSenses(data)}
							<p class="challenge">
								<strong>Challenge:</strong> {data.adapter.dnd5e.challenge.rating} ({data.adapter.dnd5e.challenge.xp} XP)
							</p>
							<p class="overrides" data-if-children>
								<strong data-if-siblings>Overrides:</strong> {data.overrideSource}
							</p>
						</section>
						<section class="non-attacks" data-if-children>
							{this.renderNonAttacks(data)}
						</section>
						<section class="actions" data-if-children>
							<header data-if-siblings>
								<h4>Actions</h4>
							</header>
							{this.renderActions(data)}
						</section>
						<section class="components" data-if-children>
							<header data-if-siblings>
								<h4>Components</h4>
							</header>
							{this.renderComponents(data)}
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
								{this.renderLootList(data)}
								</tbody>
							</table>
						</section>
					</article>
				</div>
			)
		]);
	}

	private renderActions(data: Machine): string {
		return html(
			<dl class="action-list" data-if-children>
				{data.action.filter(a => a.attack).map(a => this.renderAttack(a, data.adapter.dnd5e)).join('\n')}
			</dl>
		);
	}

// noinspection JSMethodCanBeStatic
	private renderAttack(a: Action, dnd5e: DD5E): string {
		const desc = Array.isArray(a.description) ? a.description.join('\n') : a.description;
		const extra = (dnd5e.action || {})[a.id];
		let extraDesc;
		if (extra != null) {
			const melee = extra.melee ? html(<em>Melee Weapon Attack</em>) : null;
			const ranged = extra.ranged ? html(<em>Ranged Weapon Attack</em>) : null;
			const toHit = extra.toHit == null ? null : `${extra.toHit} to hit`;
			const reach = extra.reachFeet ? `reach ${extra.reachFeet} ft.` + (extra.minRangeFeet ? ` (min. ${extra.minRangeFeet} ft.)` : '') : null;
			const target = extra.target === 'all' ? null : extra.target === 1 ? 'one target' : `${extra.target} targets`;
			const save = extra.save == null ? null : `Targets may make a DC ${extra.save.difficulty} ${extra.save.attribute} saving throw to ${extra.save.half ? 'take half damage' : 'avoid the attack'}.`;
			const first = ifLines([melee, ranged, toHit, reach, target], ', ', '.\n');
			const onHit = Array.isArray(extra.onHit) ? html(<em>Hit:</em>) + ' ' + extra.onHit.map(o => [
				html(<span class="roll-average">{o.average}</span>),
				html(<span class="roll-dice">({o.roll})</span>),
				html(<span class="damage-type">{o.type}</span>),
				`damage`
			].join(' ')).join(', ') + '.' : null;
			extraDesc = ifLines([first, extra.description, save, onHit]);
		}
		return html(
			<div class="detailed">
				<dt>{a.title}</dt>
				<dd data-if-children data-markdown="1">{desc} {extraDesc}</dd>
			</div>
		);
	}

	private renderComponent(c: Component, data: Machine, cid: string): string {
		const acMod = (LOOKUPS.dnd5e.acMod || [])[c.targetDifficulty || 'Normal'];
		const ac = 'AC ' + (data.adapter.dnd5e.armor.num ? data.adapter.dnd5e.armor.num + acMod : 'TODO');
		const machineHP = data.adapter.dnd5e.hp.average || Math.floor(data.variant.base.hp / 10);
		const componentHP = Math.floor(machineHP * c.damagePercent / 100.0) + ' HP';
		const tear = c.remove ? 'can tear loose' : null;
		const explode = c.explode == null ? null : `Explodes when destroyed for 2d8 ${LOOKUPS.dnd5e.damageTypeFromHZD[c.explode.element] || c.explode.element} damage to all creatures within ${c.explode.rangeFeet} ft.`;
		const damage = c.damage == null ? null : ('Takes ' + Object.keys(c.damage)
			.map(d => d === 'all' ? `${c.damage?.all}&times; damage (all types)` : `${(c.damage || {})[d]}&times; ${LOOKUPS.dnd5e.damageTypeFromHZD[d] || d} damage`)
			.join(', ') + '.');
		const contains = c.loot == null || cid === BODY ? null : (html(
			<em>Contains:</em>) + ' ' + c.loot.map(l => this.renderQuantity(l.quantity, '&times;') + ` ${l.title}`).join(', ') + '.');
		const needsMarkdown = Array.isArray(c.targetNotes) || typeof c.targetNotes === 'string' ? 1 : 0;
		const nonTitle = ifLines([
			ifLines([ac, componentHP, tear], ', ', '.'),
			damage,
			c.targetNotes,
			explode,
			contains
		]);
		return cid === BODY && nonTitle === '' ? '' : html(
			<div class="detailed">
				<dt>{c.title}</dt>
				<dd data-markdown={needsMarkdown}>{nonTitle}</dd>
			</div>
		);
	}

	private renderComponents(data: Machine): string {
		const components = Object.keys(data.component || {})
			.sort((a, b) => a === BODY ? -1 : b === BODY ? 1 : a.localeCompare(b));
		if (components.length < 1) {
			return '';
		}
		return html(
			<dl class="component-list" data-if-children>
				{components
					.map(cid => this.renderComponent((data.component || {})[cid], data, cid))
					.join('\n')}
			</dl>
		);
	}

	// noinspection JSMethodCanBeStatic
	private renderLootItem(l: Item): string {
		return html(
			<tr>
				<td class="loot-title">{l.title}</td>
				<td class="loot-percent">{l.percent}%</td>
				<td class="loot-qty">{this.renderQuantity(l.quantity)}</td>
			</tr>
		);
	}

	private renderLootList(data: Machine): string {
		if (data.component == null) {
			return '';
		}
		return ifLines(Object.values(data.component)
			.flatMap(c => c.loot || [])
			.sort((a, b) => (a.title || '').localeCompare(b.title || ''))
			.map(l => this.renderLootItem(l)));
	}

	// noinspection JSMethodCanBeStatic
	private renderNonAttack(a: Action, dnd5e: DD5E): string {
		const desc = ifLines(a.description);
		const extra = (dnd5e.action || {})[a.id];
		const extraDesc = extra == null ? null : ifLines(extra.description);
		return html(
			<div class="detailed">
				<dt>{a.title}</dt>
				<dd data-markdown={extraDesc != null && extraDesc !== '' ? 1 : 0}>{desc} {extraDesc}</dd>
			</div>
		);
	}

	private renderNonAttacks(data: Machine): string {
		return html(
			<dl class="non-attack-list" data-if-children>
				{data.action
					.filter(a => !a.attack)
					.map(a => this.renderNonAttack(a, data.adapter.dnd5e))
					.join('\n')}
			</dl>
		);
	}

	// noinspection JSMethodCanBeStatic
	private renderQuantity(qty: number | RandomQuantity | undefined, suffix: string = ''): string {
		if (qty == null) {
			return '';
		} else if (typeof qty === 'number') {
			return String(qty) + suffix;
		} else {
			return `${qty.min}${suffix}-${qty.max}${suffix}`;
		}
	}

	private renderSenses(data: Machine): string {
		const passive = data.adapter.dnd5e.passive;
		if (passive == null) {
			return '';
		}
		const senses = Object.keys(passive).sort().map(p => `Passive ${p} ${(passive || {})[p]}`).join(', ');
		return html(
			<p class="senses">
				<strong>Senses:</strong> {senses}
			</p>
		);
	}
}
