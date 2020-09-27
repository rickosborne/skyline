---
tags:
- title-is-spoiler
---

## Mother's Watch Ruins

<!-- +template map story/iaso/510-mothers-watch-ruins svg -->

<!-- map data 2e0f8f82dbdb1c2692249b9c8f2bbc65dd88bd11873afc1084264ef2aeb277c8
Map
  Title: Mother's Watch Ruins, Level I
  Theme: Old Ones Indoor Delve
  Scale: 5ft per point
                                                   Environment:
          +------------+                           . office floor
         /:::w.......>..\                          D office door
        |::1.........+...|                         + office wall
+-------+w...........]...+-----+-----+----------+  - office wall
|....................]...D.....D.....D.........3|  / office wall
|....................]...+-----+vv+--+..........|  \ office wall
+-------+............]...|     |vv|22|..........|  | office wall
        |............+...|     |.....+----------+  ] railing
         \...........>../      +-----+             v stairs  (rotate: 90)
          +------------+                           ^ stairs  (rotate: 270)
                                                   : rocks
                                                   w puddle
                                                   > stairs
Points of Interest:
1. Entrance  (tile: office floor)
2. Stairs to Level II  (symbol: ^; link: 150-the-blinking-light.html)
3. Crate  (tile: office floor; overlay: crate)
-->

<section>
	<figure>
		<svg viewBox="0 0 49 10" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
					<path class="office-floor-box" d="M14,1 h7 v8 h-11 v-1 h-1 v-2 h-8 v-2 h9 v-1 h1 v-1 h3 v-1 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-floor-group">
					<path class="office-floor-box" d="M22,1 h2 v1 h1 v6 h-1 v1 h-2 v-8 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-floor-group">
					<path class="office-floor-box" d="M26,4 h5 v1 h-5 v-1 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-floor-group">
					<path class="office-floor-box" d="M32,4 h5 v1 h-5 v-1 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-floor-group">
					<path class="office-floor-box" d="M38,4 h10 v3 h-10 v-3 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-floor-group">
					<path class="office-floor-box" d="M32,7 h5 v1 h-5 v-1 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-wall-group">
					<path class="office-wall-box" d="M10,0 h14 v1 h-14 v-1 h1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M9,1 h1 v1 h-1 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M8,2 h1 v2 h-8 v2 h8 v2 h-1 v-1 h-8 v-4 h8 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M24,1 h1 v1 h-1 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M25,2 h1 v1 h23 v5 h-11 v1 h-7 v-3 h-5 v2 h-1 v-3 h7 v3 h5 v-2 h-2 v1 h-1 v-2 h4 v2 h10 v-3 h-23 v-2 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M9,8 h1 v1 h-1 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M10,9 h14 v1 h-14 v-1 z"><title>office wall</title></path>
					<path class="office-wall-box" d="M24,8 h1 v1 h-1 v-1 z"><title>office wall</title></path>
				</g>
				<g class="office-wall-group">
					<path class="office-wall-box" d="M21,2 h1 v1 h-1 v-1 h1 z"><title>office wall</title></path>
				</g>
				<g class="office-wall-group">
					<path class="office-wall-box" d="M21,7 h1 v1 h-1 v-1 h1 z"><title>office wall</title></path>
				</g>
				<use class="generic-tile" href="#rocks" x="10" y="1"></use>
				<use class="generic-tile" href="#rocks" x="11" y="1"></use>
				<use class="generic-tile" href="#rocks" x="12" y="1"></use>
				<use class="generic-tile" href="#puddle" x="13" y="1"></use>
				<use class="generic-tile" href="#rocks" x="9" y="2"></use>
				<use class="generic-tile" href="#rocks" x="10" y="2"></use>
				<use class="generic-tile" href="#puddle" x="9" y="3"></use>
				<use class="generic-tile" href="#railing" x="21" y="3"></use>
				<use class="generic-tile" href="#railing" x="21" y="4"></use>
				<use class="generic-tile" href="#railing" x="21" y="5"></use>
				<use class="generic-tile" href="#railing" x="21" y="6"></use>
				<use height="1" href="#office-stairs" transform="rotate(270, 35.5, 6.5)" width="1" x="35" y="6"></use>
				<a class="poi-generic-link" href="150-the-blinking-light.html">
					<title>Stairs to Level II</title>
					<use class="poi-generic" href="#--poi" x="35.5" y="6.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="35.475" y="6.55">2</text>
				</a>
				<use height="1" href="#office-stairs" transform="rotate(270, 36.5, 6.5)" width="1" x="36" y="6"></use>
				<a class="poi-generic-link" href="150-the-blinking-light.html">
					<title>Stairs to Level II</title>
					<use class="poi-generic" href="#--poi" x="36.5" y="6.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="36.475" y="6.55">2</text>
				</a>
			</g>
			<g class="layer-O"><use class="generic-tile" href="#crate" x="47" y="4"></use></g>
			<g class="layer-I">
				<use height="1" href="#office-stairs" width="1" x="21" y="1"></use>
				<use class="generic-tile" href="#office-door" x="25" y="4"></use>
				<use class="generic-tile" href="#office-door" x="31" y="4"></use>
				<use class="generic-tile" href="#office-door" x="37" y="4"></use>
				<use height="1" href="#office-stairs" transform="rotate(90, 32.5, 5.5)" width="1" x="32" y="5"></use>
				<use height="1" href="#office-stairs" transform="rotate(90, 33.5, 5.5)" width="1" x="33" y="5"></use>
				<use height="1" href="#office-stairs" transform="rotate(90, 32.5, 6.5)" width="1" x="32" y="6"></use>
				<use height="1" href="#office-stairs" transform="rotate(90, 33.5, 6.5)" width="1" x="33" y="6"></use>
				<use height="1" href="#office-stairs" transform="rotate(270, 35.5, 6.5)" width="1" x="35" y="6"></use>
				<use height="1" href="#office-stairs" transform="rotate(270, 36.5, 6.5)" width="1" x="36" y="6"></use>
				<use height="1" href="#office-stairs" width="1" x="21" y="8"></use>
			</g>
			<g class="layer-P">
				<g class="office-floor-group">
					<path class="office-floor-box" d="M11,2 h1 v1 h-1 v-1 h1 z"><title>office floor</title></path>
				</g>
				<g class="office-floor-group">
					<path class="office-floor-box" d="M47,4 h1 v1 h-1 v-1 h1 z"><title>office floor</title></path>
				</g>
				<use height="1" href="#office-stairs" transform="rotate(270, 35.5, 6.5)" width="1" x="35" y="6"></use>
				<a class="poi-generic-link" href="150-the-blinking-light.html">
					<title>Stairs to Level II</title>
					<use class="poi-generic" href="#--poi" x="35.5" y="6.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="35.475" y="6.55">2</text>
				</a>
				<use height="1" href="#office-stairs" transform="rotate(270, 36.5, 6.5)" width="1" x="36" y="6"></use>
				<a class="poi-generic-link" href="150-the-blinking-light.html">
					<title>Stairs to Level II</title>
					<use class="poi-generic" href="#--poi" x="36.5" y="6.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="36.475" y="6.55">2</text>
				</a>
			</g>
		</svg>
		<figcaption class="points-of-interest avoid-break-before">
			<header>Points of Interest</header>
			<dl>
				<div class="detailed">
					<dt class="poi-id">1</dt>
					<dd class="poi-title"><span class="poi-title">Entrance</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">2</dt>
					<dd class="poi-title"><a class="poi-link" href="150-the-blinking-light.html">Stairs to Level II</a></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">3</dt>
					<dd class="poi-title"><span class="poi-title">Crate</span></dd>
				</div>
			</dl>
		</figcaption>
	</figure>
</section>

<!-- -template map story/iaso/510-mothers-watch-ruins svg -->

TODO: This is not the final map.
It's just a placeholder while I work on the map tech.
