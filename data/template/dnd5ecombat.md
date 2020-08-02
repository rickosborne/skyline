## ${title}

${plural} are modified from the stock [${adapter.dnd5e.basedOn.title}](${adapter.dnd5e.basedOn.href}).
For additional flavor, see the [Horizon Wiki on ${title}](${link.horizonWiki}).

<div class="dnd5e-stat-block">
    <article>
    <header class="name-and-size">
        <h3 class="title">${toWords(title)}</h3>
        <p class="size-and-type"><em>${dnd5e.sizeFromHZD[size.toLowerCase()]} machine</em></p>
    </header>
    <section class="ac-hp-speed">
        <p class="ac"><strong>Armor Class:</strong> ${adapter.dnd5e.armor.num} ${adapter.dnd5e.armor.type}</p>
        <p class="hp"><strong>Hit Points:</strong> ${adapter.dnd5e.hp.average} (${adapter.dnd5e.hp.roll})</p>
        <p class="speed"><strong>Speed:</strong> ${adapter.dnd5e.speedFeet} ft.${ifPresent(adapter.dnd5e.flyFeet, ff => `, fly ${ff} ft.`)}</p>
    </section>
    <table class="stats">
        <thead>
            <tr>
                <th aria-label="Strength">STR</th>
                <th aria-label="Dexterity">DEX</th>
                <th aria-label="Constitution">CON</th>
                <th aria-label="Intelligence">INT</th>
                <th aria-label="Wisdom">WIS</th>
                <th aria-label="Charisma">CHA</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${adapter.dnd5e.attr.STR.score} (${adapter.dnd5e.attr.STR.bonus})</td>
                <td>${adapter.dnd5e.attr.DEX.score} (${adapter.dnd5e.attr.DEX.bonus})</td>
                <td>${adapter.dnd5e.attr.CON.score} (${adapter.dnd5e.attr.CON.bonus})</td>
                <td>${adapter.dnd5e.attr.INT.score} (${adapter.dnd5e.attr.INT.bonus})</td>
                <td>${adapter.dnd5e.attr.WIS.score} (${adapter.dnd5e.attr.WIS.bonus})</td>
                <td>${adapter.dnd5e.attr.CHA.score} (${adapter.dnd5e.attr.CHA.bonus})</td>
            </tr>
        </tbody>
    </table>
    <section class="additional-stats">
        <!-- Damage Resistances and Immunities -->
        ${Array.isArray(adapter.dnd5e.skill) ? `<p class="skills"><strong>Skills:</strong> ${Object.keys(adapter.dnd5e.skill).sort().map(p => `${p} ${adapter.dnd5e.skill[p]}`).join(', ')}</p>` : ''}:trimIfEmpty:
        <p class="senses"><strong>Senses:</strong> ${Object.keys(adapter.dnd5e.passive).sort().map(p => `Passive ${p} ${adapter.dnd5e.passive[p]}`).join(', ')}</p>
        <p class="challenge"><strong>Challenge:</strong> ${adapter.dnd5e.challenge.rating} (${adapter.dnd5e.challenge.xp} XP)</p>
        ${ifPresent(overrideSource, os => `<p class="overrides"><strong>Overrides:</strong> ${overrideSource}</p>`)}:trimIfEmpty:
    </section>
    <section class="non-attacks">
${action.filter(a => !a.attack).map(a => {
  const title = `_**${a.title}.**_`;
  const desc = Array.isArray(a.description) ? a.description.join('\n') : a.description;
  const extra = adapter.dnd5e.action[a.id];
  const extraDesc = extra == null ? null : Array.isArray(extra.description) ? extra.description.join('\n') : extra.description;
  return ['<p class="non-attack" markdown="1">', title, desc, extraDesc, '</p>'].filter(t => t != null).join('\n');
}).join('\n')}
    </section>
    <section class="actions">
        <header>
            <h4>Actions</h4>
        </header>
${action.filter(a => a.attack).map(a => {
  const title = `_**${a.title}.**_`;
  const desc = Array.isArray(a.description) ? a.description.join('\n') : a.description;
  const extra = adapter.dnd5e.action[a.id];
  let extraDesc;
  if (extra != null) {
    const melee = extra.melee ? '_Melee Weapon Attack_' : null;
    const ranged = extra.ranged ? '_Ranged Weapon Attack_' : null;
    const toHit = extra.toHit == null ? null : `${extra.toHit} to hit`;
    const reach = extra.reachFeet ? `reach ${extra.reachFeet} ft.` + (extra.minRangeFeet ? ` (min. ${extra.minRangeFeet} ft.)` : ''): null;
    const target = extra.target === 'all' ? null : extra.target === 1 ? 'one target' : `${extra.target} targets`;
    const save = extra.save == null ? null : `Targets may make a DC ${extra.save.difficulty} ${extra.save.attribute} saving throw to ${extra.save.half ? 'take half damage' : 'avoid the attack'}.`;
    const first = [melee, ranged, toHit, reach, target].filter(t => t != null).join(', ');
    const edesc = Array.isArray(extra.description) ? extra.description.join('\n') : extra.description;
    const onHit = Array.isArray(extra.onHit) ? '_Hit:_ ' + extra.onHit.map(o => `${o.average} (${o.roll}) ${o.type} damage`).join(', ') + '.' : null;
    extraDesc = (first === '' ? '' : (first + '.\n')) + [edesc, save, onHit].filter(t => t != null && t !== '').join('\n');
  }
  return ['<p class="action" markdown="1">', title, desc, extraDesc, '</p>'].filter(t => t != null).join('\n');
}).join('\n')}
    </section>
    <section class="components">
        <header>
            <h4>Components</h4>
        </header>
${Object.keys(component).sort((a, b) => a === 'body' ? -1 : b === 'body' ? 1 : a.localeCompare(b)).map(cid => {
  const c = component[cid];
  const title = `_**${c.title}.**_`;
  const acMod = dnd5e.acMod[c.targetDifficulty || 'Normal'];
  const ac = 'AC ' + (adapter.dnd5e.armor.num + acMod);
  const machineHP = adapter.dnd5e.hp.average || Math.floor(variant.base.hp / 10);
  const componentHP = Math.floor(machineHP * c.damagePercent / 100.0) + ' HP';
  const tear = c.remove ? 'can tear loose' : null; 
  const explode = c.explode == null ? null : `Explodes when destroyed for 2d8 ${dnd5e.damageTypeFromHZD[c.explode.element] || c.explode.element} damage to all creatures within ${c.explode.rangeFeet} ft.`;
  const damage = c.damage == null ? null : ('Takes ' + Object.keys(c.damage).map(d => d === 'all' ? `${c.damage.all}&times; damage (all types)` : `${c.damage[d]}&times; ${dnd5e.damageTypeFromHZD[d] || d} damage`).join(', ') + '.');
  const contains = c.loot == null || cid === 'body' ? null : ('Contains: ' + c.loot.map(l => `${typeof l.quantity === 'number' ? l.quantity : l.quantity.min + '-' + l.quantity.max}&times; ${l.title}`).join(', ') + '.');
  return ['<p class="component" markdown="1">', title, [ac, componentHP, tear].filter(t => t != null).join(', ') + '.', damage, c.targetNotes, explode, contains, '</p>'].filter(t => t != null).join('\n');
}).join('\n')}
    </section>
    <section class="loot-items">
        <header>
            <h4>Loot</h4>
        </header>
        <table class="loot-list">
            <thead>
                <tr>
                    <th>Item</th>
                    <th class="loot-percent">Probability</th>
                    <th class="loot-qty">Quantity</th>
                </tr>
            </thead>
            <tbody>
${Object.values(component).flatMap(c => c.loot || []).sort((a, b) => a.title.localeCompare(b.title)).map(l => {
  const qty = typeof l.quantity === 'number' ? l.quantity : `${l.quantity.min}-${l.quantity.max}`;
  return `<tr><td class="loot-title">${l.title}</td><td class="loot-percent">${l.percent}%</td><td class="loot-qty">${qty}</td></tr>`;
}).join('\n')}
            </tbody>
        </table>
    </section>
    </article>
</div>

