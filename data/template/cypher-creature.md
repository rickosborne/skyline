## ${title}

For additional flavor, see the [Horizon Wiki on ${title}](${link.horizonWiki}).

**Level (Target Number)**: ${adapter.cypher.level} (${adapter.cypher.target})

${ifLines(adapter.cypher.motive, lines => `**Motive:** ${lines.join('\n')}`)}:trimAndNextIfEmpty:

**Health:** ${adapter.cypher.health}

**Damage Inflicted:** ${adapter.cypher.damage} points

**Armor:** ${adapter.cypher.armor}

**Movement:** ${adapter.cypher.movement}
${ifLines(adapter.cypher.movementNotes, lines => lines.join('\n'))}:trimAndNextIfEmpty:

${ifLines(adapter.cypher.modifications, lines => `**Modifications:** ${lines.join('\n')}`)}:trimAndNextIfEmpty:

${ifLines(adapter.cypher.interaction, lines => `**Interaction:** ${lines.join('\n')}`)}:trimAndNextIfEmpty:

${ifLines(adapter.cypher.use, lines => `**Use:** ${lines.join('\n')}`)}:trimAndNextIfEmpty:

${ifLines(adapter.cypher.intrusion, lines => `**GM Intrusion:** ${lines.join('\n')}`)}:trimAndNextIfEmpty:


### Combat

${ifLines(adapter.cypher.combatNotes, lines => lines.join('\n'))}:trimAndNextIfEmpty:

${action.filter(a => a.attack).map(a => {
  const title = `_**${a.title}.**_`;
  const desc = Array.isArray(a.description) ? a.description.join('\n') : a.description;
  return [title, desc].filter(t => t != null).join('\n');
}).join('\n\n')}

### Components

${Object.keys(component).sort((a, b) => a === 'body' ? -1 : b === 'body' ? 1 : a.localeCompare(b)).map(cid => {
  const c = component[cid];
  const title = `_**${c.title}.**_`;
  const tear = c.remove ? 'Can tear loose.' : null; 
  const rename = {
    shock: 'lightning'
  };
  let explode = null;
  if (c.explode != null) {
    const explodeDamageType = cypher.hazardFromHZD[c.explode.element] || 'Collision';
    const explodeRange = cypher.range.find(r => r.ftAway >= c.explode.rangeFeet);
    explode = `Explodes when destroyed for ${explodeDamageType} damage to all creatures within ${explodeRange == null ? `${c.explode.rangeFeet} ft` : `${explodeRange.name} range`}.`;
  }
  const damage = c.damage == null ? null : ('Takes ' + Object.keys(c.damage).map(d => d === 'all' ? `${c.damage.all}&times; damage (all types)` : `${c.damage[d]}&times; ${cypher.hazardFromHZD[d] || d} damage`).join(', ') + '.');
  const contains = c.loot == null || cid === 'body' ? null : ('Contains: ' + c.loot.map(l => `${typeof l.quantity === 'number' ? l.quantity : l.quantity.min + '-' + l.quantity.max}&times; ${l.title}`).join(', ') + '.');
  return [title, tear, damage, explode, contains].filter(t => t != null).join('\n');
}).join('\n\n')}

### Loot

${ifLines(adapter.cypher.lootNotes, lines => lines.join('\n'))}:trimAndNextIfEmpty:

| Component | Probability | Quantity |
| --- | :---: | :---: |
${Object.values(component).flatMap(c => c.loot || []).sort((a, b) => a.title.localeCompare(b.title)).map(l => {
  const qty = typeof l.quantity === 'number' ? l.quantity : `${l.quantity.min}-${l.quantity.max}`;
  return `| ${l.title} | ${l.percent}% | ${qty} |`;
}).join('\n')}
