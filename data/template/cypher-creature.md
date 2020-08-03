## ${title}

For additional flavor, see the [Horizon Wiki on ${title}](${link.horizonWiki}).

<div class="cypher-stat-block stat-block">
    <article>
        <header class="title">
            <h3>${toWords(title)}</h3>
            <aside class="level-and-target">${adapter.cypher.level} (${adapter.cypher.target})</aside>
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
                    <td>${adapter.cypher.level}</td>
                    <td>${adapter.cypher.target}</td>
                    <td>${adapter.cypher.health}</td>
                    <td>${adapter.cypher.armor}</td>
                    <td>${adapter.cypher.damage}</td>
                    <td>${adapter.cypher.movement}</td>
                </tr>
            </tbody>
        </table>
        </section>
        <section class="points">
${ifLines(adapter.cypher.motive, lines => `<p markdown="1">**Motive:** ${lines.join('\n')}</p>`)}:trimIfEmpty:
${ifLines(adapter.cypher.movementNotes, lines => `<p markdown="1"><strong>Movement:</strong>.  ${lines.join('  ')}</p>`)}:trimIfEmpty:
${ifLines(adapter.cypher.modifications, lines => `<p markdown="1">**Modifications:** ${lines.join('\n')}</p>`)}:trimIfEmpty:
${ifLines(adapter.cypher.interaction, lines => `<p markdown="1">**Interaction:** ${lines.join('\n')}</p>`)}:trimIfEmpty:
${ifLines(adapter.cypher.use, lines => `<p markdown="1">**Use:** ${lines.join('\n')}</p>`)}:trimIfEmpty:
${ifLines(adapter.cypher.intrusion, lines => `<p markdown="1">**GM Intrusion:** ${lines.join('\n')}</p>`)}:trimIfEmpty:
        </section>
        <section class="combats">
            <header>
                <h4>Combat</h4>
            </header>
${ifLines(adapter.cypher.combatNotes, lines => `<p markdown="1">${lines.join('\n')}</p>`)}
${action.filter(a => a.attack).map(a => {
  const title = `_**${a.title}.**_`;
  const desc = Array.isArray(a.description) ? a.description.join('\n') : a.description;
  return ['<p markdown="1">', title, desc, '</p>'].filter(t => t != null).join('\n');
}).join('\n')}
        </section>
        <section class="components">
            <header>
                <h4>Components</h4>
            </header>
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
  const nonTitle = [tear, damage, explode, contains].filter(t => t != null).join('\n');
  return cid === 'body' && nonTitle === '' ? '' : ['<p class="component" markdown="1">', title, nonTitle, '</p>'].join('\n');
}).join('\n\n')}
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
