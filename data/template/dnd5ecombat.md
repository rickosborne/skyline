## ${title}

${plural} are modified from the stock [${adapter.dnd5e.basedOn.title}](${adapter.dnd5e.basedOn.href}).
For additional flavor, see the [Horizon Wiki on ${title}](${link.horizonWiki}).

| Stat | Value |
| ---- | ----- |
| Armor Class (AC) | ${adapter.dnd5e.armor.num} ${adapter.dnd5e.armor.type} |
| Hit Points (HP) | ${adapter.dnd5e.hp.average || Math.floor(variant.base.hp / 10)} (${adapter.dnd5e.hp.roll}) |
| Speed | ${adapter.dnd5e.speedFeet} |
| Skills | ${Object.keys(adapter.dnd5e.skill).sort().map(p => `${p} ${adapter.dnd5e.skill[p]}`).join(', ')} |
| Senses | ${Object.keys(adapter.dnd5e.passive).sort().map(p => `${p} ${adapter.dnd5e.passive[p]}`).join(', ')} |
| Challenge | ${adapter.dnd5e.challenge.rating} (${adapter.dnd5e.challenge.xp} XP) |

| STR | DEX | CON | INT | WIS | CHA |
| :---: | :---: | :---: | :---: | :---: | :---: |
| ${adapter.dnd5e.attr.STR.score} | ${adapter.dnd5e.attr.DEX.score} | ${adapter.dnd5e.attr.CON.score} | ${adapter.dnd5e.attr.INT.score} | ${adapter.dnd5e.attr.WIS.score} | ${adapter.dnd5e.attr.CHA.score} |
| ${adapter.dnd5e.attr.STR.score} | ${adapter.dnd5e.attr.DEX.bonus} | ${adapter.dnd5e.attr.CON.bonus} | ${adapter.dnd5e.attr.INT.bonus} | ${adapter.dnd5e.attr.WIS.bonus} | ${adapter.dnd5e.attr.CHA.bonus} |

${action.filter(a => !a.attack).map(a => {
  const title = `_**${a.title}**_`;
  const desc = Array.isArray(a.description) ? a.description.join(' ') : a.description;
  const extra = adapter.dnd5e.action[a.id];
  const extraDesc = extra == null ? null : Array.isArray(extra.description) ? extra.description.join(' ') : extra.description;
  return [title, desc, extraDesc].filter(t => t != null).join(' ');
}).join('\n\n')}

### Actions

${action.filter(a => a.attack).map(a => {
  const title = `_**${a.title}.**_`;
  const desc = Array.isArray(a.description) ? a.description.join(' ') : a.description;
  const extra = adapter.dnd5e.action[a.id];
  let extraDesc;
  if (extra != null) {
    const melee = extra.melee ? '_Melee Weapon Attack_' : null;
    const ranged = extra.ranged ? '_Ranged Weapon Attack_' : null;
    const toHit = extra.toHit == null ? null : `${extra.toHit} to hit`;
    const reach = extra.reachFeet ? `reach ${extra.reachFeet} ft.` : null;
    const target = extra.target === 'all' ? null : extra.target === 1 ? 'one target' : `${extra.target} targets`;
    const first = [melee, ranged, toHit, reach, target].filter(t => t != null).join(', ');
    const edesc = Array.isArray(extra.description) ? extra.description.join(' ') : extra.description;
    const onHit = Array.isArray(extra.onHit) ? '_Hit:_ ' + extra.onHit.map(o => `${o.average} (${o.roll}) ${o.type} damage`).join(', ') + '.' : null;
    extraDesc = (first === '' ? '' : (first + '. ')) + edesc + ' ' + onHit;
  }
  return [title, desc, extraDesc].filter(t => t != null).join(' ');
}).join('\n\n')}

### Components

${Object.keys(component).sort((a, b) => a === 'body' ? -1 : b === 'body' ? 1 : a.localeCompare(b)).map(c => {
  const title = `_**${c.title}.**_`;
  const ac = 'AC ' + (10 + ({
    Easy: -2,
    Normal: 0,
    Moderate: 2,
    Tricky: 5,
    Hard: 9,
    Epic: 14,
    Legendary: 20
  })[c.targetDifficulty]);
  const machineHP = adapter.dnd5e.hp.average || Math.floor(variant.base.hp / 10);
  const componentHP = Math.floor(machineHP * c.damagePercent / 100.0) + ' HP';
  const tear = c.remove ? 'can be torn off' : 'cannot be torn off'; 
  const damage = c.damage != null && c.damage.all != null ? `Takes ${c.damage.all}x damage.` : '**TODO**';
  const contains = c.loot == null ? null : ('Contains: ' + c.loot.map(l => `${l.quantity}x ${l.title}`).join(', '));
  return [title, `${ac}, ${componentHP}, ${tear}.`, damage, c.targetNotes, contains].filter(t => t != null).join(' ');
}).join('\n\n')}

### Loot

| Component | Probability | Quantity |
| --- | :---: | :---: |
${Object.values(component).flatMap(c => c.loot).sort((a, b) => a.title.localeCompare(b.title)).map(l => {
  const qty = typeof l.quantity === 'number' ? l.quantity : `${l.quantity.min}-${l.quantity.max}`;
  return `| ${l.title} | ${l.percent}% | ${qty} |`;
}).join('\n')}
