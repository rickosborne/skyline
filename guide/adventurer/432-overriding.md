---
tags:
- guide
---

## Override Narratives

For tables which enjoy richer storytelling, consider the narrative aspects of performing an override on a machine.
Canonically, we know Focus operations do involve an augmented reality user interface: _HZD_ shows young Aloy flipping through menus of options.
Her interactions with the Focus as an adult do not show this same level of interaction, though we might believe this is more of a cinematic distinction than functional.

One option for Override narrative might be to take the shorter route: the Focus has a direct neural link and responds to what the wearer _intends_ to happen.
This is something of a "Do What I Mean" approach, and lends itself to statements like "I override the Control Pylon" without much detail.

A second option would be to assume that most Focus interactions do have some sort of explicit user interface which doesn't just read the wearer's mind.
This would make initial tasks far more challenging when they are open-ended:

> Your Override Controller connects with the Control Pylon.
> A huge list of unfamiliar terms scrolls by in front of you.
> You can read the words, like "Audit Automation" and "Schematic Modeling", but many of them don't have an immediately clear meaning.
> What are you looking for?

This does not inherently mean all tasks become impossible without an Old Ones dictionary.
Fundamental software engineering principles would help in many tasks — go to override a Cauldron door, and you'll probably only be presented with a few options, one of which would probably be clearly labeled as "Door Control".
Sure, you might also see things like "Environmental Logs", but odds are good you would not see system controls for any other, unrelated part of the facility.

This approach does not mean you'd need to describe user interface actions every time you override a door.
Please don't do that — that would be awful for everyone.
Instead, use it when you want to add tension (and maybe some chaos and hilarity) to unfamiliar situations.

Some _Skyline_ story modules use this latter approach when describing actions, by explaining in broad strokes what the character must do with the Focus.
Feel free to elide these details if they don't do anything for you.

### Override Keys

It's never explained in _Horizon_ lore, but _Skyline_ makes some assumptions about how Override operations happen.
We know that Corruptors (Scarabs) had components which could "slave enemy robots to its own network".
_Skyline_ refers to this component as a Corruptor Override Controller, or generally just an Override Controller.
In _HZD_ we see Aloy grab the water-bottle-sized unit off a downed Corruptor, which then immediately begins interacting with her Focus.

When Aloy went to use the Override Controller on a Strider, she found she already had the ability to control that type of machine.
Controlling other machines, however, required her to delve Cauldrons, where the Control Pylons stored some kind of codes for a few machines.

Because "code" is an overloaded term in a world where AI exists, _Skyline_ instead refers to these as override keys.
In hand-wavy narrative terms, we presume machines work on cryptographic technologies of the modern world: just like modern computer processors and Internet-enabled devices ship with baked-in-firmware cryptographic keys they will trust, we presume each type of machine has a similar "signing key".
Keeping all your keys in one place would also be horrible operational security, so it would be odd to find more than a small number within each Control Pylon.

In _HZD_, we saw Aloy's ability to override machines was retained even after her original Focus was destroyed, implying that the keys are _at least_ stored in the Controller.
_Skyline_ leaves a few open questions for the Narrator to decide:

* Where are override keys stored: the Controller, the Focus, or both?
* If they can be stored in the Focus, can they be shared?
* Or, does each Controller have the equivalent of its own signing key, meaning the override keys which are obtained by one Controller would be completely useless for another?

Narrators might also choose to use override keys to hide and progressively reveal areas: "the door here looks newer, and while your Override Controller can interface with it, it lacks something the door needs to open".

### Override vs. Corrupt

_Skyline_ makes a distinction between the Override Controller's ability to _interface_ with systems and the Corruptor's ability to _control_ machines.
An Override Controller is effectively a set of lock-picks for the front door of any electronic system.
Whether the system is a Control Pylon, a door, a machine, or something else electronic and networked, an Override Controller is going to get you access to the system's network and software.

The security of the system from that point controls what you can do with that access.
In the example of Override Keys above, most machines require specific cryptographic keys before you can order them around.
An Override Controller might get you access to the machine, but without those keys you can't control it because it will just ignore your commands.

{:.aside}
Corruptor nanites work not unlike some insect parasites with the ability to causing the insect to do things it otherwise would not.

Corruptors take this one step further when it comes to machines: they don't just interface with the machine's network, they also send out a nanite swarm to take control of the machine's individual components.
This allows a Corruptor to bypass the software-level key requirement, letting the nanite swarm direct the movements and actions of the machine.
This is also why later-generation machines are immune to corruption: HEPHAESTUS adapted to the increasing number of active Corruptors, and added some amount of component-level security to new machines.

{:.aside}
Can Daemonic machines truly not be overridden?
Or do you just need to find the right keys?

It's not _Horizon_ canon, but as Aloy did not have a nanite swarm under her control, she could not just take over any machine as a Corruptor would — she needed the overrides (keys).
A character with control of a nanite swarm, however?
If this is interesting to you, check out the section on [Magic in _Skyline_](../narrator/230-magic.md) in the Narrator's Guide.

### Corruption Arrows

The word "corruption" here is a little confusing, as the (green) effect of Corruption Arrows is not the same as the (red) effect of a Corruptor's nanite swarm.
The arrows cause both humans and machines to turn on each other, though the effects may be similar but unrelated.
To be clear: this effect does not take control of either machines or humans.

Metalburn makes up the active ingredient in Corruption Arrows, though there is no official _Horizon_ canon for the resource.
However, the only sources of Metalburn are old Corruptors and Deathbringers, as well as Corrupted machines.
This might imply Metalburn has something to do with nanites, which are present in all.

_Skyline_ leaves the rationale for the effect of Corruption Arrows open as a point of flexibility for Narrators.
However, one plausible rationale might be that the Metalburn in the arrows is highly EM-reflective when dispersed, causing various imaging and sensors problems for a machine's friend-or-foe recognition.
The same particles might act as a short-term hallucinogen, focusing on the amygdala in humans, causing them to become overly aggressive.
