---
tags:
- guide
---

## Machine Combat in _Skyline_

Most TTRPG systems include perfectly adequate approaches to creature combat.
If you'd like to continue using those rules without anything extra, you may safely skip this section.
For a bit more challenge, consider the following additions to add some depth to machine combat, rewarding players for inventive strategies.

### Component Basics

Machine stat blocks include listings of components, which are (generally) targetable in combat.
The various adapters each use their own stat block format and details, but the broad strokes are the same:

* Each machine has one _Body_ component.
  This is the component damaged when no other component has been specified, or often when another targeted component was missed by a small amount.
* Non-body components will specify how much damage the component can take before it is destroyed and can no longer be targeted.
  This component "health" is shared with that of the machine — it is **not** in addition to it.
* Some components can be removed from the machine.
  In the _Horizon_ games, this would be done with "Tear" weapons.
  Depending on the component, this removal may damage the machine, or may affect how it functions.
* Components may have their own damage type resistances and vulnerabilities.
  For example, Blaze canisters are vulnerable to fire damage.
  In such cases, a multiplier for the damage type is included, such as "2&times;" for double damage.
* Resistances and vulnerabilities for one component do not necessarily apply to other components, including the ones on the body.
* Components may include loot items, which may be damaged when the component takes damage.
  Tearing the component free without doing any other damage to it increases the likelihood of recovering the loot.

## Components Example

For example, consider the components for a Watcher, where the stats used are for the 5E system:

* **Body**.  AC 13, 36 HP.
  Takes 2&times; Lightning damage.
* **Eye**.  AC 15, 36 HP.
  Takes 2&times; damage (all types).
  Only vulnerable to piercing weapons in a 30-degree cone in front of the Watcher.
  Contains: 1&times; Watcher Lens.

A few things to note from these example components:

* A watcher Body takes double damage from Lightning, while the Eye takes double damage of all types.
  However, targeting the Eye can only be done from the front of the Watcher — you can't hit it from behind or above — and requires a specific damage type.
  The AC (Armor Class) of the Eye is also a little higher, making it a little harder to hit, even when hit from the correct angle.
* The health of the Eye matches the health of the Body.
  This means that destroying the eye is enough to destroy the Watcher.
  It **does not** mean the Watcher has a combined HP of 72.
  The 36 HP listed on the Body is the total, and damage to other components is subtracted from that, up to the HP of the other component. 
* The Eye is not listed as "removable", and therefore cannot be torn away from the Body.
* If the Eye does not take damage during the fight, there's a chance of recovering one Watcher Lens from it.

### Component Damage

Let's look at another example to highlight how component damage relates to health.
Scrapper components, in more abstract terms, include the following:

* **Body**.  100% health.
* **Power Cell**.  25% health.
  Takes 3&times; Lightning damage.
  Can be removed.
  Explodes when destroyed, dealing moderate Fire damage to all creatures and components in Close range.
  Required for all _Laser_ attacks.
* **Radar**.  50% health.
  Can be removed.
  Takes 2&times; damage (all types).
  Required for _Radar Ping_ ability.

In the 5E system, a Scrapper has 44 HP.
This means the Power Cell has an effective 11 HP (25% of 44), while the Radar has an effective 22 HP (50% of 44).

Suppose a player character targets the Radar, then the Power Cell, and finally the Body:

1. Because the Radar takes double damage of all types, only 11 HP worth of damage (half of 22) is required to destroy it.
   The 22 damage counts against the total 44 HP of the Scrapper, taking it down to 22 HP.
2. Once the Radar has been destroyed, the Scrapper can no longer use its _Radar Ping_ ability to scan for hidden characters.
3. Destroying the Power Cell takes 11 damage of most types, or 4 Lightning damage which gets tripled.
   Notice that while 4 damage tripled is 12, the component's health is only 11 HP, so the "leftover" damage of 1 HP does not carry over to the Body — it is capped at the HP for the component.
   This takes the Scrapper down to 11 HP remaining.
4. The Power Cell explodes when it is destroyed, dealing Fire damage to everything around it.
   Each system and adapter will have its own rules about how to calculate the damage for this.
   In this example, let's presume this led to 8 damage, taking the Scrapper down to 3 HP.
5. Destroying the Power Cell removes the Scrapper's ability to use any _Laser_ attacks, reducing it to attacking with its claws and grinder-teeth.
6. The Body will need to take the remaining 3 damage to down the Scrapper.

**Care should be taken to not "double dip" damage.**

Imagine the components of the Scrapper above were targeted in a different order: Power Cell, then Radar, then Body.
When the Power Cell explodes, it does its damage to creatures _and components_ in range.
This includes the Scrapper's Radar component.
The 8 Fire damage from the explosion would be doubled against the Radar component, which takes double damage of all types.
This reduces the Radar from 22 HP by 16 down to 6 HP.

But be careful: **do not** also add that 8 Fire damage to the Body if it was already taken by other components.
Remember that component health is shared with the Body.
This means the Scrapper takes 16 damage from the explosion, because that's what its Radar took.
If multiple components are damaged at the same time you would still sum all damage to be subtracted from the Scrapper's total HP, just don't count the Body twice.

The intent here is to provide opportunities for players to create interesting chain reactions of damage.
For example, Destroying the Blaze canister on one of a pack of clumped-up Grazers could lead to other Blaze canisters exploding, and so on, destroying the entire pack with a single shot.
Which is great from a distance, but likely not so much if another player character had gotten too close to the pack.

### Should you use component rules?

Component damage adds quite a bit of complexity to combat management.
You must now track not just a number of machines, but also multiple different damage types and health pools for each.
But component targeting also provides the opportunity to vary encounters with the same machine types — it gives incentive to players to coordinate and plan encounters, and do more than just "hit it very hard".

Chain reactions, especially well-prepared ones with multiple effects, may provide amazing narrative opportunities, but they also _significantly_ increase the chance of missing something and getting it "wrong".
Tables which use chain reactions are encouraged to agree beforehand that there's always some narrative explanation for why something was "missed".
Trying to "rewind" and partially reapply chain reactions is likely far more frustrating and confusion-inducing than is worth it.
It's also not hard to see how the _Fireball_ meme would likely apply here:

> I didn't ask how close everyone is, I said "I shoot the Blaze canister".

You may also choose to employ or ignore components at the session or encounter level.
For example, your first few sessions might ignore components until everyone gets used to combat.
Similarly, components and chain reactions provide the opportunity for interesting narrative constraints: "you need to destroy this group of machines within two rounds or they will alert this other group".
Such constraints can be done without components and chain reactions, but their presence will encourage planning.
