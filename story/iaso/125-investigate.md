---
tags:
- story
location: Ruins near Mother's Watch
---

## 125

Read to everyone:

> You're able to get down into the cave without much effort or risk.
> The struggling Watcher notices your presence and fires several shots from its glowing red eye.
> Without control of its neck, however, the shots go wide and are not a danger to you, impacting the far wall.
>
> The noises made by the Watcher are likely to draw attention from any other passing machines.
> A single well-placed strike would be enough to deactivate it.

Dispatch the Watcher, which is prone, restrained, and cannot attack, then continue:

> The area is dank with standing water, bat guano, and ages of decay.
> But it's also clear this place is a ruin of the Old Ones: metal archways covered in moss and dripped stone, strange lights glowing for incomprehensible purposes, and a boxy, unnatural feel to the architecture.
> Enough sunlight filters through the ceiling to make you uncomfortable about walking around above.

Investigate the area by visiting the labeled story entries:

<!-- +template map story/iaso/510-mothers-watch-ruins svg -->

<!-- map data 1572cf35970bf2f94142b3e08be34404e5e677476f805bc84d936c7e66be2ae5
Map
  Title: Mother's Watch Ruins, Level I
  Theme: Old Ones Indoor Delve
  Scale: 5ft per point
                        Environment:
      +------------+    . office floor
     /:W:w.......>..\   D office door
    |::1.........+...|  + office wall
+---+w...........]...|  - office wall
|................]...D  / office wall
|................]...|  \ office wall
+---+............]...|  | office wall
    |.....w:ww...+...|  ] railing
     \....w:::4..>../   v stairs  (rotate: 90)
      +-------L----+    ^ stairs  (rotate: 270)
                        : rocks
                        w puddle
                        > stairs
Points of Interest:
E. Entrance  (tile: puddle)
W. Impaled Watcher  (tile: rocks)
L. Damaged door & blinking light  (tile: puddle; link: 150-the-blinking-light)
-->

<section>
	<figure>
		<svg viewBox="0 0 22 10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<style>
				.poi {
					font-family: Roboto, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
					font-weight: bold;
					cursor: default;
				}
			</style>
			<defs>
				<rect fill="#808080" height="1" id="office-floor" rx="0.1" ry="0.1" stroke="none" width="1"><title>office floor</title></rect>
				<rect fill="#a0a0a0" height="1" id="office-door" rx="0.1" ry="0.1" stroke="none" width="1"><title>office door</title></rect>
				<rect fill="black" height="0.1" id="office-wall-h" stroke="none" width="1"></rect>
				<rect fill="black" height="1" id="office-wall-v" stroke="none" width="0.1"></rect>
				<rect fill="black" height="0.1" id="office-wall-c" stroke="none" width="0.1"></rect>
				<rect fill="#333333" height="1" id="office-wall-b" width="1" x="0" y="0"></rect>
				<rect fill="#c0c0c0" height="1" id="railing" rx="0.1" ry="0.1" stroke="none" width="1"><title>railing</title></rect>
				<symbol id="office-stairs" viewBox="0 0 1 1">
					<title>Stairs</title>
					<rect fill="#999999" height="1" stroke="none" width="0.2" x="0" y="0"></rect>
					<rect fill="#aaaaaa" height="1" stroke="none" width="0.2" x="0.2" y="0"></rect>
					<rect fill="#bbbbbb" height="1" stroke="none" width="0.2" x="0.4" y="0"></rect>
					<rect fill="#cccccc" height="1" stroke="none" width="0.2" x="0.6" y="0"></rect>
					<rect fill="#dddddd" height="1" stroke="none" width="0.2" x="0.8" y="0"></rect>
				</symbol>
				<symbol height="1" id="office-crate" viewBox="0 0 1 1" width="1">
					<title>Crate</title>
					<path d="M0.05,0.5 l0.45,-0.45 l0.45,0.45 l-0.45,0.45 z" fill="none" stroke="#ccffff" stroke-width="0.05"></path>
					<path d="M0.15,0.5 l0.35,-0.35 l0.35,0.35 l-0.35,0.35 z" fill="#ccffff" stroke="none"></path>
				</symbol>
				<rect fill="#208020" height="1" id="rocks" rx="0.1" ry="0.1" stroke="none" width="1"><title>rocks</title></rect>
				<rect fill="#202080" height="1" id="puddle" rx="0.1" ry="0.1" stroke="none" width="1"><title>puddle</title></rect>
				<rect fill="transparent" height="1" id="--background" width="1"></rect>
				<circle fill="#ffff99" id="--poi" r="0.7" stroke="#999933" stroke-width="0.07"></circle>
			</defs>
			<g class="layer-B">
				<g class="office-floor-group">
					<path class="office-floor-box" d="M10,1 h7 v8 h-2 v-1 h-1 v-1 h-4 v2 h-4 v-1 h-1 v-2 h-4 v-2 h5 v-1 h2 v-1 h2 v-1 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-floor-group">
					<path class="office-floor-box" d="M18,1 h2 v1 h1 v6 h-1 v1 h-2 v-8 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-wall-group">
					<path class="office-wall-box" d="M6,0 h14 v1 h-14 v-1 h1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M5,1 h1 v1 h-1 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M4,2 h1 v2 h-4 v2 h4 v2 h-1 v-1 h-4 v-4 h4 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M5,8 h1 v1 h-1 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M6,9 h8 v1 h-8 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M20,1 h1 v1 h-1 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M21,2 h1 v2 h-1 v-2 z"><title>office wall</title></path>
				</g>
				<g class="office-wall-group">
					<path class="office-wall-box" d="M17,2 h1 v1 h-1 v-1 h1 z"><title>office wall</title></path>
				</g>
				<g class="office-wall-group">
					<path class="office-wall-box" d="M21,5 h1 v3 h-1 v-3 h1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M20,8 h1 v1 h-1 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M19,9 h1 v1 h-5 v-1 h4 z"><title>office wall</title></path>
				</g>
				<g class="office-wall-group">
					<path class="office-wall-box" d="M17,7 h1 v1 h-1 v-1 h1 z"><title>office wall</title></path>
				</g>
				<use class="generic-tile" href="#rocks" x="6" y="1"></use>
				<use class="generic-tile" href="#rocks" x="7" y="1"></use>
				<use class="generic-tile" href="#rocks" x="8" y="1"></use>
				<use class="generic-tile" href="#puddle" x="9" y="1"></use>
				<use class="generic-tile" href="#rocks" x="5" y="2"></use>
				<use class="generic-tile" href="#rocks" x="6" y="2"></use>
				<use class="generic-tile" href="#puddle" x="5" y="3"></use>
				<use class="generic-tile" href="#railing" x="17" y="3"></use>
				<use class="generic-tile" href="#railing" x="17" y="4"></use>
				<use class="generic-tile" href="#railing" x="17" y="5"></use>
				<use class="generic-tile" href="#railing" x="17" y="6"></use>
				<use class="generic-tile" href="#puddle" x="10" y="7"></use>
				<use class="generic-tile" href="#rocks" x="11" y="7"></use>
				<use class="generic-tile" href="#puddle" x="12" y="7"></use>
				<use class="generic-tile" href="#puddle" x="13" y="7"></use>
				<use class="generic-tile" href="#puddle" x="10" y="8"></use>
				<use class="generic-tile" href="#rocks" x="11" y="8"></use>
				<use class="generic-tile" href="#rocks" x="12" y="8"></use>
				<use class="generic-tile" href="#rocks" x="13" y="8"></use>
				<use class="generic-tile" href="#puddle" x="14" y="9"></use>
			</g>
			<g class="layer-I">
				<use height="1" href="#office-stairs" width="1" x="17" y="1"></use>
				<use class="generic-tile" href="#office-door" x="21" y="4"></use>
				<use height="1" href="#office-stairs" width="1" x="17" y="8"></use>
			</g>
			<g class="layer-P">
				<use class="generic-tile" href="#rocks" x="7" y="1"></use>
				<g class="poi-generic-group">
					<title>Impaled Watcher</title>
					<use class="poi-generic" href="#--poi" x="7.5" y="1.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="7.475" y="1.55">W</text>
				</g>
				<use class="generic-tile" href="#puddle" x="14" y="9"></use>
				<a class="poi-generic-link" href="150-the-blinking-light">
					<title>Damaged door & blinking light</title>
					<use class="poi-generic" href="#--poi" x="14.5" y="9.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="14.475" y="9.55">L</text>
				</a>
			</g>
		</svg>
		<figcaption class="points-of-interest avoid-break-before">
			<header>Points of Interest</header>
			<dl>
				<div class="detailed">
					<dt class="poi-id">E</dt>
					<dd class="poi-title"><span class="poi-title">Entrance</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">W</dt>
					<dd class="poi-title"><span class="poi-title">Impaled Watcher</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">L</dt>
					<dd class="poi-title"><a class="poi-link" href="150-the-blinking-light">Damaged door & blinking light</a></dd>
				</div>
			</dl>
		</figcaption>
	</figure>
</section>

<!-- -template map story/iaso/510-mothers-watch-ruins svg -->

