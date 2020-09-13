---
tags:
- story
---

## 119

Read to everyone:

> You've felled your first tree and are snacking from your wrapped bundles when one of you notices the glint of metal coming over a far hill.
> The distinctive shape of a long-necked Watcher, followed by at least one Strider, can be seen in the distance.
>
> Pren is hesitant to move on to the next tree, until the machines stop and begin grazing while the Watcher begins to circle them on patrol.
> They are far enough away that you eventually convince Pren and the others to continue, mainly by invoking the inevitable disappointment of Iala, and by promising to keep someone watching the machines at all times.
>
> Two hours pass, in which time two more trees fall to the ground and are leveraged onto the lumber carts.
> You've mostly finished your lunch as the Oseram woman, Nalender, turns to the group.
> "They're heading this way."
>
> The machines do not seem to be in any hurry, and they are not heading directly for you, but their path looks to be too close for comfort.
> You convince Pren and the others to begin moving the lumber back toward Mother's Watch, while you hold off the machines if they get aggressive.
>
> The machines come to a stop a few dozen yards away — not close enough to notice you yet, but they would if you resumed your work on the trees.

There is one Watcher, patrolling around a number of Striders equal to the number of player characters.
A stand of red-tipped tall grass covers much of the ground between the tree line and the machines:

<!-- +template map story/iaso/119-timber-and-striders svg -->

<!-- map data 4fd906c12c8c5eeae6ebce5e32958ddb7aaec393b067174fd51e668567f05d8a
Map
  Title: East of Mother's Watch
  Theme: Outdoor
  Scale: 10ft per point
..:::::::.........rr   Environment:
.....::......rrrrr..   . grass
rrr......rrrr.......   : tall grass
...rrrrrr.....ff..::   f forest
..........ffffff....   r road
::...ffCffffffffff..
...fffffffffffff....
ffffffffffffff...:..
fffffffffPfff...:::.
fffffffff.....::::..
ffffffff...:::::S...
fffffff...::.W......
ffffffff...........f
ffffffffff......ffff
                                            
Points of Interest:
C. Lumber carts (moving toward the road)  (tile: forest)
P. The party  (tile: forest)
S. Striders  (tile: grass)
W. Watcher  (tile: grass; path: N2 NE2 E4 S5 W5 NW1)
-->

<section>
	<figure>
		<svg viewBox="0 0 20 14" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
			<style>
				.poi {
					font-family: Roboto, "Open Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
					font-weight: bold;
					cursor: default;
				}
				.grass-box {
					fill: #99ff99;
					filter: url(#grass-filter);
				}
				.grass-matte {
					fill: #99ff99;
					filter: url(#grass-filter);
				}
				.boulders-round {
					fill: #cc6633;
					filter: url(#boulders-filter);
				}
				.mountain-round {
					fill: #999999;
					filter: url(#mountain-filter);
				}
				.mountain-back {
					fill: #99ff99;
					filter: url(#grass-filter);
				}
				.forest-round {
					fill: url(#forest-dots);
					filter: url(#forest-filter);
				}
				.forest-back {
					fill: #99ff99;
					filter: url(#grass-filter);
				}
				.road-journey {
					fill: #cc8033;
				}
				.road-fore {
					filter: url(#road-filter);
				}
				.river-journey {
					fill: #6699ff;
				}
				.shallows-journey {
					fill: #99bbff;
				}
				.tall-grass-round {
					fill: url(#tall-grass-dots);
					filter: url(#tall-grass-filter);
				}
				.tall-grass-back {
					fill: #99ff99;
					filter: url(#grass-filter);
				}
				.machine-site-overlay {
					stroke: #ff0000;
					stroke-width: 0.1px;
					stroke-linejoin: bevel;
					fill: url(#machine-overlay-gradient);
				}
			</style>
			<defs>
				<filter id="grass-filter">
					<feTurbulence baseFrequency="20,15" numOctaves="1" result="noise" type="fractalNoise"></feTurbulence>
					<feColorMatrix in="noise" result="mono" type="matrix" values=" 0 0 0 0 0, 0 0 0 0 0, 0 0 0 0 0, 0 0 0 -2.5 1 "></feColorMatrix>
					<feBlend in="SourceGraphic" in2="mono" mode="multiply" result="withNoise"></feBlend>
					<feComposite in="withNoise" in2="SourceGraphic" operator="in"></feComposite>
				</filter>
				<filter id="boulders-filter">
					<feTurbulence baseFrequency="0.3" numOctaves="5" result="noise" type="fractalNoise"></feTurbulence>
					<feDiffuseLighting in="noise" lighting-color="white" result="diffLight" surfaceScale="100"><feDistantLight azimuth="135" elevation="50" /></feDiffuseLighting>
					<feTurbulence baseFrequency="1" numOctaves="2" result="turbulence" type="turbulence"></feTurbulence>
					<feDisplacementMap in="SourceGraphic" in2="turbulence" result="bump" scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
					<feComposite in="diffLight" in2="bump" operator="in" result="textured"></feComposite>
					<feComposite in="bump" in2="textured" k2="1.35" k3="-1" operator="arithmetic"></feComposite>
				</filter>
				<filter id="mountain-filter">
					<feTurbulence baseFrequency="0.4" numOctaves="6" result="noise" type="fractalNoise"></feTurbulence>
					<feDiffuseLighting in="noise" lighting-color="white" result="diffLight" surfaceScale="100"><feDistantLight azimuth="135" elevation="50" /></feDiffuseLighting>
					<feTurbulence baseFrequency="1" numOctaves="2" result="turbulence" type="turbulence"></feTurbulence>
					<feDisplacementMap in="SourceGraphic" in2="turbulence" result="bump" scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
					<feComposite in="diffLight" in2="bump" operator="in" result="textured"></feComposite>
					<feComposite in="bump" in2="textured" k2="1.5" k3="-0.5" operator="arithmetic"></feComposite>
				</filter>
				<filter id="forest-filter">
					<feTurbulence baseFrequency="2" numOctaves="1" result="turbulence" type="turbulence"></feTurbulence>
					<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
					<feGaussianBlur stdDeviation="0.01"></feGaussianBlur>
				</filter>
				<pattern height="86" id="forest-dots" patternTransform="scale(0.02) rotate(30)" patternUnits="userSpaceOnUse" width="100">
					<rect fill="#33cc33" height="86%" width="100%"></rect>
					<circle cx="0" cy="44" fill="#33cc33" id="forest-dot" r="22"></circle>
					<use href="#forest-dot" transform="translate(48,0)"></use>
					<use href="#forest-dot" transform="translate(25,-44)"></use>
					<use href="#forest-dot" transform="translate(75,-44)"></use>
					<use href="#forest-dot" transform="translate(100,0)"></use>
					<use href="#forest-dot" transform="translate(75,42)"></use>
					<use href="#forest-dot" transform="translate(25,42)"></use>
				</pattern>
				<filter id="road-filter"><feGaussianBlur stdDeviation="0.01"></feGaussianBlur></filter>
				<rect fill="#6699ff" height="1" id="river" rx="0.1" ry="0.1" stroke="none" width="1"><title>river</title></rect>
				<rect fill="#99bbff" height="1" id="shallows" rx="0.1" ry="0.1" stroke="none" width="1"><title>shallows</title></rect>
				<filter id="tall-grass-filter">
					<feTurbulence baseFrequency="4" numOctaves="4" result="turbulence" type="turbulence"></feTurbulence>
					<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
					<feGaussianBlur stdDeviation="0.01"></feGaussianBlur>
				</filter>
				<pattern height="86" id="tall-grass-dots" patternTransform="scale(0.01) rotate(60)" patternUnits="userSpaceOnUse" width="100">
					<rect fill="#cc3366" height="86%" width="100%"></rect>
					<circle cx="0" cy="44" fill="#cc3366" id="tall-grass-dot" r="22"></circle>
					<use href="#tall-grass-dot" transform="translate(48,0)"></use>
					<use href="#tall-grass-dot" transform="translate(25,-44)"></use>
					<use href="#tall-grass-dot" transform="translate(75,-44)"></use>
					<use href="#tall-grass-dot" transform="translate(100,0)"></use>
					<use href="#tall-grass-dot" transform="translate(75,42)"></use>
					<use href="#tall-grass-dot" transform="translate(25,42)"></use>
				</pattern>
				<linearGradient gradientUnits="userSpaceOnUse" id="machine-overlay-gradient" spreadMethod="repeat" x1="0" x2="0.2" y1="0" y2="0.2">
					<stop offset="0%" stop-color="#ff0000ff"></stop>
					<stop offset="50%" stop-color="#ff000000"></stop>
				</linearGradient>
				<rect fill="transparent" height="1" id="--background" width="1"></rect>
				<circle fill="#ffff99" id="--poi" r="0.7" stroke="#80804d" stroke-width="0.07"></circle>
			</defs>
			<g class="layer-B">
				<rect class="grass-matte" height="16" width="22" x="-1" y="-1"></rect>
				<g class="forest-group">
					<path class="forest-round" d="M15,3 Q16,3,16,4 Q16,5,17,5 Q18,5,18,5.5 Q18,6,17,6 Q16,6,16,6.5 Q16,7,15,7 Q14,7,14,7.5 Q14,8,13.5,8 Q13,8,13,8.5 Q13,9,11,9 Q9,9,9,9.5 Q9,10,8.5,10 Q8,10,8,10.5 Q8,11,7.5,11 Q7,11,7,11.5 Q7,12,7.5,12 Q8,12,8,12.5 Q8,13,9,13 Q10,13,10,14 Q10,15,4.5,15 Q-1,15,-1,11 Q-1,7,1,7 Q3,7,3,6.5 Q3,6,4,6 Q5,6,5,5.5 Q5,5,7.5,5 Q10,5,10,4.5 Q10,4,12,4 Q14,4,14,3.5 Q14,3,14.5,3 Q15,3,14.5,3 Q14,3,15,3 z"><title>forest</title></path>
				</g>
				<g class="forest-group">
					<path class="forest-round" d="M20,12 Q21,12,21,13.5 Q21,15,18.5,15 Q16,15,16,14 Q16,13,17.5,13 Q19,13,19,12.5 Q19,12,20,12 Q21,12,20,12 Q19,12,20,12 z"><title>forest</title></path>
				</g>
				<g class="road-journey">
					<path d="M18.3,0 h0.4 h0.3 v0.3 v0.4 Q18.5,0.5,18.3,1 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q18.5,0.5,18.3,0 z"><title>road</title></path>
					<path d="M19.3,0 h0.4 h0.3 v0.3 v0.4 Q19.5,0.5,19,0.7 v-0.4 v-0.3 h0.3 z"><title>road</title></path>
					<path d="M14,1.3 v0.4 Q13.5,1.5,13.3,2 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q13.5,1.5,14,1.3 z"><title>road</title></path>
					<path d="M15,1.3 v0.4 Q14.5,1.5,14,1.7 v-0.4 Q14.5,1.5,15,1.3 z"><title>road</title></path>
					<path d="M16,1.3 v0.4 Q15.5,1.5,15,1.7 v-0.4 Q15.5,1.5,16,1.3 z"><title>road</title></path>
					<path d="M17,1.3 v0.4 Q16.5,1.5,16,1.7 v-0.4 Q16.5,1.5,17,1.3 z"><title>road</title></path>
					<path d="M17.7,1 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q17.5,1.5,17,1.7 v-0.4 Q17.5,1.5,17.7,1 z"><title>road</title></path>
					<path d="M1,2.3 v0.4 Q0.5,2.5,0,2.7 v-0.4 Q0.5,2.5,1,2.3 z"><title>road</title></path>
					<path d="M2,2.3 v0.4 Q1.5,2.5,1,2.7 v-0.4 Q1.5,2.5,2,2.3 z"><title>road</title></path>
					<path d="M3,2.7 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q2.5,2.5,2,2.7 v-0.4 Q2.5,2.5,3,2.7 z"><title>road</title></path>
					<path d="M10,2.3 v0.4 Q9.5,2.5,9.3,3 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q9.5,2.5,10,2.3 z"><title>road</title></path>
					<path d="M11,2.3 v0.4 Q10.5,2.5,10,2.7 v-0.4 Q10.5,2.5,11,2.3 z"><title>road</title></path>
					<path d="M12,2.3 v0.4 Q11.5,2.5,11,2.7 v-0.4 Q11.5,2.5,12,2.3 z"><title>road</title></path>
					<path d="M12.7,2 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q12.5,2.5,12,2.7 v-0.4 Q12.5,2.5,12.7,2 z"><title>road</title></path>
					<path d="M3,3.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q3.5,3.5,4,3.3 v0.4 Q3.5,3.5,3,3.3 z"><title>road</title></path>
					<path d="M5,3.3 v0.4 Q4.5,3.5,4,3.7 v-0.4 Q4.5,3.5,5,3.3 z"><title>road</title></path>
					<path d="M6,3.3 v0.4 Q5.5,3.5,5,3.7 v-0.4 Q5.5,3.5,6,3.3 z"><title>road</title></path>
					<path d="M7,3.3 v0.4 Q6.5,3.5,6,3.7 v-0.4 Q6.5,3.5,7,3.3 z"><title>road</title></path>
					<path d="M8,3.3 v0.4 Q7.5,3.5,7,3.7 v-0.4 Q7.5,3.5,8,3.3 z"><title>road</title></path>
					<path d="M8.7,3 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q8.5,3.5,8,3.7 v-0.4 Q8.5,3.5,8.7,3 z"><title>road</title></path>
					<path d="M18.7,0 h-0.4 Q18.5,-0.5,18.7,0 z"><title>road</title></path>
					<path d="M20,0.7 v-0.4 Q20.5,0.5,20,0.7 z"><title>road</title></path>
					<path d="M19.7,0 h-0.4 Q19.5,-0.5,19.7,0 z"><title>road</title></path>
					<path d="M0,2.3 v0.4 Q-0.5,2.5,0,2.3 z"><title>road</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-round" d="M5.5,-1 Q9,-1,9,0 Q9,1,8,1 Q7,1,7,1.5 Q7,2,6,2 Q5,2,5,1.5 Q5,1,3.5,1 Q2,1,2,0 Q2,-1,2.5,-1 Q3,-1,2.5,-1 Q2,0,5.5,-1 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-round" d="M19.5,3 Q21,3,21,3.5 Q21,4,19.5,4 Q18,4,18,3.5 Q18,3,18.5,3 Q19,3,18.5,3 Q18,3,19.5,3 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-round" d="M0.5,5 Q2,5,2,5.5 Q2,6,0.5,6 Q-1,6,-1,5.5 Q-1,5,0,5 Q1,5,0,5 Q0,5,0.5,5 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-round" d="M17.5,7 Q18,7,18,7.5 Q18,8,18.5,8 Q19,8,19,8.5 Q19,9,18.5,9 Q18,9,18,9.5 Q18,10,17,10 Q16,10,16,10.5 Q16,11,14,11 Q12,11,12,11.5 Q12,12,11,12 Q10,12,10,11.5 Q10,11,10.5,11 Q11,11,11,10.5 Q11,10,12.5,10 Q14,10,14,9.5 Q14,9,15,9 Q16,9,16,8.5 Q16,8,16.5,8 Q17,8,17,7.5 Q17,7,17.5,7 Q18,7,17.5,7 Q17,7,17.5,7 z"><title>tall grass</title></path>
				</g>
			</g>
			<g class="layer-P">
				<g class="poi-generic-group">
					<title>Striders</title>
					<use class="poi-generic" href="#--poi" x="16.5" y="10.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="16.475" y="10.55">S</text>
				</g>
				<g class="poi-generic-group">
					<title>Watcher</title>
					<use class="poi-generic" href="#--poi" x="13.5" y="11.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="13.475" y="11.55">W</text>
				</g>
				<g class="poi-generic-group">
					<title>Lumber carts (moving toward the road)</title>
					<use class="poi-generic" href="#--poi" x="7.5" y="5.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="7.475" y="5.55">C</text>
				</g>
				<g class="poi-generic-group">
					<title>The party</title>
					<use class="poi-generic" href="#--poi" x="9.5" y="8.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="9.475" y="8.55">P</text>
				</g>
			</g>
		</svg>
		<figcaption class="points-of-interest avoid-break-before">
			<header>Points of Interest</header>
			<dl>
				<div class="detailed">
					<dt class="poi-id">C</dt>
					<dd class="poi-title"><span class="poi-title">Lumber carts (moving toward the road)</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">P</dt>
					<dd class="poi-title"><span class="poi-title">The party</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">S</dt>
					<dd class="poi-title"><span class="poi-title">Striders</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">W</dt>
					<dd class="poi-title"><span class="poi-title">Watcher</span></dd>
				</div>
			</dl>
		</figcaption>
	</figure>
</section>

<!-- -template map story/iaso/119-timber-and-striders svg -->

The lumber carts will eventually make enough noise to draw the attention of the machines, but you likely have a minute or two to prepare.
If you move quickly and quietly, you have enough time to sneak to the tall grass.

Using your System Adapter, resolve a daytime encounter with the machines.
They are not alerted to your presence, but will be drawn toward the carts if they have not been engaged within 60 seconds.
Remember that a Watcher alerted to your presence will immediately alert all other machines in the area.
In this case, there are no additional machines beyond those you can see.

{:.story-links}
[When the encounter is complete, catch up with the carts at entry 122.](122-lumber-carts.md){:.story-link.story-link-continue}
