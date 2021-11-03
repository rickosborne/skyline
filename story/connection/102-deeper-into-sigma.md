---
tags:
- story
location: Cauldron SIGMA
---

## 102

Read to everyone:

> As you disconnect your Override Controller from the pylon, one of the doors on the far side of the room slides aside.
> Before it is even half open, however, it falters and stops.
> Seconds pass, and the door seems conflicted about whether it wants to be open or closed, sliding inches back and forth in fits and starts.
>
> No machines are visible on the other side, even though you're fairly certain this is the door through which the newer Hybrid Bellowback arrived.

The party can make it through the door with minimal effort.
The tunnel on the other side looks like any other, with a gentle downward slope.
The distinctive cadence of patrolling Watchers can be heard in the distance.

TODO: SIGMA Arena Tunnel Map

TODO: Do the bridge overrides have a name when you look at them?

Upon using an Override Controller to extend the bridge at `(A)` another log file is pushed to your Focus.
It appears to be a more detailed version of part of the previous log file:

```
M/SIGMA CORE LOG 763F
///
[763.4490] Communication/Link Established
[763.4491] Communication/Demultiplex/Unrecognized Entity (Action: Discard)
[763.4492] ????????/?????????
[763.4493] Security/Quarantine/Instantiated
[763.4494] Communication/Demultiplex/Unpacking
[763.4495] ????????/?????????
[763.4496] Security/Quarantine/Relaxed
[763.4497] ????????/?????????
[763.4498] Control/Instantiate (Path: ????????; Access: ????????)
[763.4499] [????????] ????????/?????????
[763.4502] Intrusion/Source:Unknown
///
```

The next bridge pushes a third log file, though this one looks significantly corrupted:

```
?/?IG?A C??E L?G ???F
///
[763.4492] C?????l/??e??ide (A??h??i??: H??; C???a?d: ?ec??i??/??a?a??i?e)
[763.4493] ?ec??i??/??a?a??i?e/I???a??ia?ed
///
```

Then a fourth, which is a single line:

```
M/SIGMA CORE LOG 763F
///
[763.4495] Control/Override (Authority: H14; Command: Security/Access/Change)
///
```

The fifth is just one more line of cryptic words:

```
[763.4499] [H14] Executor/Online (Thread Group: "HADES#14"; UID: root)
```

