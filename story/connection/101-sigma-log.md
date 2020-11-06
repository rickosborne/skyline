---
tags:
- story
---

The datapoint log from the control pylon of Cauldron SIGMA reads:

```
M/SIGMA CORE LOG 763F
///
[763.4012] Production/Resume
[763.4376] Intrusion/Source:Unknown
[763.4377] Intrusion/Contained
[763.4490] Intrusion/Source:Unknown
[763.4491] Intrusion/Contained
[763.4502] Intrusion/Source:Unknown
[763.4503] Security/Compromised
[763.4504] Sensors/Compromised
[763.4505] Control/Compromised
[763.4505] Production/Offline
[763.4506] Authority/Compromised
[763.4507] Directives/Purged
[763.4508] Directives/Received (WARNING: Unable to verify signature "H14". Control systems unavailable.)
[763.4509] [H14] Authority/Reestablished
[763.4509] [H14] Control/Reestablished
[763.4510] [H14] Production/Resume
[763.4700] [H14] Fitness Test/00001/Commence
[763.4718] [H14] Fitness Test/00001/Collecting Data
[763.4722] [H14] Fitness Test/00001/Model Updated
[763.4723] [H14] Production/Retooling
[763.4800] [H14] Fitness Test/00002/Commence
[763.4817] [H14] Fitness Test/00002/Collecting Data
[763.4823] [H14] Fitness Test/00002/Model Updated
[763.4824] [H14] Production/Retooling
///
```

The entries marked `Fitness Test` and `Retooling` go on for quite some time, with the last sequence number being `00139`.
