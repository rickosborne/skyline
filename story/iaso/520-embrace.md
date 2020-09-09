---
title: Map Test
---


<!-- +template map story/iaso/520-embrace svg -->

<!-- map data 0310b225a1f6b6f225ce34f759e8bd0bef41399c18fa4f77c24517fcf7ae659b
Map
  Title: All-Mother's Embrace
  Theme: Outdoor
  Scale: 0.25mi per point
;;;;;;;;;;;;;;;;;;;;.r.ww.....:..ffffffff   Environment:
;;;;;;;;;;;;;;;;;;;.r.ww.....::.ffffffff.   ; mountain
.;;;;;;;;;;;;;;;;....r.ww...:::..ffff....   w river
...;;;;;;;;;;;;.....r.ww..:::::........rr   . grass
....;;;;;;;;222...rrrssrrr...::.....rrrr.   : tall grass
.....;;;;..222..rr..ww.ww.rrr...rrrr.3...   f forest
...rrr11rr.....r..ww....ww...rrrbbb333fff   r road
rrr...11..rrrrr.ww........ww.::..bb33ffff   s shallows
.....;;;...c4r.ww...........ww.:..bb..fff   b boulders
                                            
Points of Interest:
1. Main Embrace Gate  (tile: road)
2. Strider site  (tile: grass; overlay: machine site; icon: strider)
3. Grazer site  (tile: grass; overlay: machine site; icon: grazer)
4. Hunting Goods  (icon: merchant)
c. Campfire  (icon: campfire)
-->

<section>
	<figure>
		<svg viewBox="0 0 41 9" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
				.boulders-box {
					fill: #dd9944;
				}
				.mountain-round {
					fill: #996633;
					filter: url(#mountain-filter);
				}
				.mountain-back {
					fill: #99ff99;
					filter: url(#grass-filter);
				}
				.forest-round {
					fill: #33cc33;
					filter: url(#forest-filter);
				}
				.forest-back {
					fill: #99ff99;
					filter: url(#grass-filter);
				}
				.road-box {
					fill: #cc8033;
				}
				.river-box {
					fill: #6699ff;
				}
				.shallows-box {
					fill: #99bbff;
				}
				.tall-grass-round {
					fill: #cc3366;
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
				<rect fill="#dd9944" height="1" id="boulders" rx="0.1" ry="0.1" stroke="none" width="1"><title>boulders</title></rect>
				<filter id="mountain-filter">
					<feTurbulence baseFrequency="0.4" numOctaves="6" result="noise" type="fractalNoise"></feTurbulence>
					<feDiffuseLighting in="noise" lighting-color="white" result="diffLight" surfaceScale="100"><feDistantLight azimuth="135" elevation="50" /></feDiffuseLighting>
					<feTurbulence baseFrequency="1" numOctaves="2" result="turbulence" type="turbulence"></feTurbulence>
					<feDisplacementMap in="SourceGraphic" in2="turbulence" result="bump" scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
					<feComposite in="diffLight" in2="bump" operator="in" result="textured"></feComposite>
					<feComposite in="bump" in2="textured" k2="1.5" k3="-0.5" operator="arithmetic"></feComposite>
				</filter>
				<filter id="forest-filter">
					<feTurbulence baseFrequency="4" numOctaves="1" result="turbulence" type="turbulence"></feTurbulence>
					<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
				</filter>
				<rect fill="#cc8033" height="1" id="road" rx="0.1" ry="0.1" stroke="none" width="1"><title>road</title></rect>
				<rect fill="#6699ff" height="1" id="river" rx="0.1" ry="0.1" stroke="none" width="1"><title>river</title></rect>
				<rect fill="#99bbff" height="1" id="shallows" rx="0.1" ry="0.1" stroke="none" width="1"><title>shallows</title></rect>
				<filter id="tall-grass-filter">
					<feTurbulence baseFrequency="4" numOctaves="4" result="turbulence" type="turbulence"></feTurbulence>
					<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
				</filter>
				<linearGradient gradientUnits="userSpaceOnUse" id="machine-overlay-gradient" spreadMethod="repeat" x1="0" x2="0.2" y1="0" y2="0.2">
					<stop offset="0%" stop-color="#ff0000ff"></stop>
					<stop offset="50%" stop-color="#ff000000"></stop>
				</linearGradient>
				<rect fill="transparent" height="1" id="--background" width="1"></rect>
				<circle fill="#ffff99" id="--poi" r="0.7" stroke="#80804d" stroke-width="0.07"></circle>
			</defs>
			<g class="layer-B">
				<g class="grass-group">
					<path class="grass-box" d="M20,0 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M22,0 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M25,0 h5 v1 h-1 v1 h-1 v1 h-2 v1 h-2 v-1 h1 v-1 h-1 v-1 h1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M31,0 h2 v1 h-1 v1 h1 v1 h4 v-1 h3 v-1 h1 v2 h-2 v1 h-3 v1 h-4 v1 h-3 v-1 h2 v-5 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M19,1 h1 v1 h1 v1 h-1 v1 h-2 v1 h-2 v1 h-1 v1 h-5 v-1 h-1 v-1 h3 v-1 h3 v-1 h2 v-1 h2 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M21,1 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M0,2 h1 v1 h2 v1 h1 v1 h1 v1 h-2 v1 h-3 v-5 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M22,2 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M21,3 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M26,4 h3 v1 h-3 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M40,4 h1 v2 h-3 v1 h-1 v1 h1 v1 h-2 v-1 h-1 v-2 h1 v-1 h4 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M18,5 h2 v1 h-2 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M22,5 h1 v1 h1 v1 h2 v1 h2 v1 h-11 v-1 h1 v-1 h2 v-1 h2 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M25,5 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M16,6 h2 v1 h-2 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M26,6 h3 v2 h-1 v-1 h-2 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M3,7 h3 v1 h-1 v1 h-5 v-1 h3 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M8,7 h2 v1 h1 v1 h-3 v-2 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M15,7 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M31,7 h2 v1 h1 v1 h-2 v-1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M14,8 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M30,8 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="boulders-group">
					<path class="boulders-box" d="M32,6 h3 v2 h1 v1 h-2 v-1 h-1 v-1 h-1 v-1 h1 z"><title>boulders</title></path>
				</g>
				<g class="mountain-group">
					<path class="mountain-back" d="M0,0 h20 v1 h-1 v1 h-2 v1 h-2 v1 h-3 v1 h-3 v1 h-4 v-1 h-1 v-1 h-1 v-1 h-2 v-1 h-1 v-2 h1 z"><title>mountain</title></path>
					<path class="mountain-round" d="M9.5,-1 Q20,-1,20,0 Q20,1,19.5,1 Q19,1,19,1.5 Q19,2,18,2 Q17,2,17,2.5 Q17,3,16,3 Q15,3,15,3.5 Q15,4,13.5,4 Q12,4,12,4.5 Q12,5,10.5,5 Q9,5,9,5.5 Q9,6,7,6 Q5,6,5,5.5 Q5,5,4.5,5 Q4,5,4,4.5 Q4,4,3.5,4 Q3,4,3,3.5 Q3,3,2,3 Q1,3,1,2.5 Q1,2,0,2 Q-1,2,-1,0.5 Q-1,-1,0,-1 Q1,-1,0,-1 Q0,0,9.5,-1 z"><title>mountain</title></path>
				</g>
				<g class="mountain-group">
					<path class="mountain-back" d="M5,8 h3 v1 h-3 v-1 h1 z"><title>mountain</title></path>
					<path class="mountain-round" d="M6.5,8 Q8,8,8,9 Q8,10,6.5,10 Q5,10,5,9 Q5,8,5.5,8 Q6,8,5.5,8 Q5,8,6.5,8 z"><title>mountain</title></path>
				</g>
				<g class="forest-group">
					<path class="forest-back" d="M33,0 h8 v1 h-1 v1 h-3 v1 h-4 v-1 h-1 v-1 h1 v-1 h1 z"><title>forest</title></path>
					<path class="forest-round" d="M37.5,-1 Q42,-1,42,0 Q42,1,41,1 Q40,1,40,1.5 Q40,2,38.5,2 Q37,2,37,2.5 Q37,3,35,3 Q33,3,33,2.5 Q33,2,32.5,2 Q32,2,32,1.5 Q32,1,32.5,1 Q33,1,33,0 Q33,-1,33.5,-1 Q34,-1,33.5,-1 Q33,0,37.5,-1 z"><title>forest</title></path>
				</g>
				<g class="forest-group">
					<path class="forest-back" d="M38,6 h3 v3 h-3 v-1 h-1 v-1 h1 v-1 h1 z"><title>forest</title></path>
					<path class="forest-round" d="M40,6 Q42,6,42,8 Q42,10,40,10 Q38,10,38,9 Q38,8,37.5,8 Q37,8,37,7.5 Q37,7,37.5,7 Q38,7,38,6.5 Q38,6,38.5,6 Q39,6,38.5,6 Q38,6,40,6 z"><title>forest</title></path>
				</g>
				<g class="road-squares">
					<use class="generic-tile" href="#road" x="21" y="0"></use>
					<use class="generic-tile" href="#road" x="20" y="1"></use>
					<use class="generic-tile" href="#road" x="21" y="2"></use>
					<use class="generic-tile" href="#road" x="20" y="3"></use>
					<use class="generic-tile" href="#road" x="18" y="4"></use>
					<use class="generic-tile" href="#road" x="19" y="4"></use>
					<use class="generic-tile" href="#road" x="20" y="4"></use>
					<use class="generic-tile" href="#road" x="16" y="5"></use>
					<use class="generic-tile" href="#road" x="17" y="5"></use>
					<use class="generic-tile" href="#road" x="3" y="6"></use>
					<use class="generic-tile" href="#road" x="4" y="6"></use>
					<use class="generic-tile" href="#road" x="5" y="6"></use>
					<use class="generic-tile" href="#road" x="6" y="6"></use>
					<use class="generic-tile" href="#road" x="7" y="6"></use>
					<use class="generic-tile" href="#road" x="8" y="6"></use>
					<use class="generic-tile" href="#road" x="9" y="6"></use>
					<use class="generic-tile" href="#road" x="15" y="6"></use>
					<use class="generic-tile" href="#road" x="0" y="7"></use>
					<use class="generic-tile" href="#road" x="1" y="7"></use>
					<use class="generic-tile" href="#road" x="2" y="7"></use>
					<use class="generic-tile" href="#road" x="6" y="7"></use>
					<use class="generic-tile" href="#road" x="7" y="7"></use>
					<use class="generic-tile" href="#road" x="10" y="7"></use>
					<use class="generic-tile" href="#road" x="11" y="7"></use>
					<use class="generic-tile" href="#road" x="12" y="7"></use>
					<use class="generic-tile" href="#road" x="13" y="7"></use>
					<use class="generic-tile" href="#road" x="14" y="7"></use>
					<use class="generic-tile" href="#road" x="13" y="8"></use>
				</g>
				<g class="road-squares">
					<use class="generic-tile" href="#road" x="39" y="3"></use>
					<use class="generic-tile" href="#road" x="40" y="3"></use>
					<use class="generic-tile" href="#road" x="23" y="4"></use>
					<use class="generic-tile" href="#road" x="24" y="4"></use>
					<use class="generic-tile" href="#road" x="25" y="4"></use>
					<use class="generic-tile" href="#road" x="36" y="4"></use>
					<use class="generic-tile" href="#road" x="37" y="4"></use>
					<use class="generic-tile" href="#road" x="38" y="4"></use>
					<use class="generic-tile" href="#road" x="39" y="4"></use>
					<use class="generic-tile" href="#road" x="26" y="5"></use>
					<use class="generic-tile" href="#road" x="27" y="5"></use>
					<use class="generic-tile" href="#road" x="28" y="5"></use>
					<use class="generic-tile" href="#road" x="32" y="5"></use>
					<use class="generic-tile" href="#road" x="33" y="5"></use>
					<use class="generic-tile" href="#road" x="34" y="5"></use>
					<use class="generic-tile" href="#road" x="35" y="5"></use>
					<use class="generic-tile" href="#road" x="29" y="6"></use>
					<use class="generic-tile" href="#road" x="30" y="6"></use>
					<use class="generic-tile" href="#road" x="31" y="6"></use>
				</g>
				<g class="river-group">
					<path class="river-box" d="M23,0 h2 v1 h-1 v1 h1 v1 h-1 v1 h-2 v-1 h1 v-1 h-1 v-1 h1 v-1 h1 z"><title>river</title></path>
				</g>
				<g class="river-group">
					<path class="river-box" d="M20,5 h2 v1 h-2 v-1 h1 z"><title>river</title></path>
					<path class="river-box" d="M19,6 h1 v1 h-2 v-1 h1 z"><title>river</title></path>
					<path class="river-box" d="M17,7 h1 v1 h-1 v1 h-2 v-1 h1 v-1 h1 z"><title>river</title></path>
				</g>
				<g class="river-group">
					<path class="river-box" d="M23,5 h2 v1 h1 v1 h-2 v-1 h-1 v-1 h1 z"><title>river</title></path>
					<path class="river-box" d="M26,7 h2 v1 h-2 v-1 z"><title>river</title></path>
					<path class="river-box" d="M28,8 h2 v1 h-2 v-1 z"><title>river</title></path>
				</g>
				<g class="shallows-group">
					<path class="shallows-box" d="M21,4 h2 v1 h-2 v-1 h1 z"><title>shallows</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-back" d="M30,0 h1 v5 h-2 v-1 h-3 v-1 h2 v-1 h1 v-1 h1 v-1 h1 z"><title>tall grass</title></path>
					<path class="tall-grass-round" d="M30.5,-1 Q31,-1,31,2 Q31,5,30,5 Q29,5,29,4.5 Q29,4,27.5,4 Q26,4,26,3.5 Q26,3,27,3 Q28,3,28,2.5 Q28,2,28.5,2 Q29,2,29,1.5 Q29,1,29.5,1 Q30,1,30,0 Q30,-1,30.5,-1 Q31,-1,30.5,-1 Q30,0,30.5,-1 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-back" d="M29,7 h2 v1 h-2 v-1 h1 z"><title>tall grass</title></path>
					<path class="tall-grass-round" d="M30,7 Q31,7,31,7.5 Q31,8,30,8 Q29,8,29,7.5 Q29,7,29.5,7 Q30,7,29.5,7 Q29,7,30,7 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-back" d="M31,8 h1 v1 h-1 v-1 h1 z"><title>tall grass</title></path>
					<path class="tall-grass-round" d="M31.5,8 Q32,8,32,9 Q32,10,31.5,10 Q31,10,31,9 Q31,8,31.5,8 Q32,8,31.5,8 Q31,8,31.5,8 z"><title>tall grass</title></path>
				</g>
			</g>
			<g class="layer-O">
				<path class="machine-site-overlay" d="M13.5,4 Q15,4,15,4.5 Q15,5,14.5,5.5 Q14,6,12.5,6 Q11,6,11,5.5 Q11,5,11.5,4.5 Q12,4,13.5,4 z"><title>machine site</title></path>
				<path class="machine-site-overlay" d="M37.5,5 Q38,5,38,6 Q38,7,37.5,7.5 Q37,8,36,8 Q35,8,35,7 Q35,6,36,5.5 Q37,5,37.5,5 z"><title>machine site</title></path>
			</g>
			<g class="layer-P">
				<g class="poi-generic-group">
					<title>Strider site</title>
					<use class="poi-generic" href="#--poi" x="13" y="5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="12.975" y="5.05">2</text>
				</g>
				<g class="poi-generic-group">
					<title>Grazer site</title>
					<use class="poi-generic" href="#--poi" x="36.5" y="6.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="36.475" y="6.55">3</text>
				</g>
				<g class="poi-generic-group">
					<title>Main Embrace Gate</title>
					<use class="poi-generic" href="#--poi" x="7" y="7"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="6.975" y="7.05">1</text>
				</g>
				<use class="tile-background" href="#--background" x="11" y="8"></use>
				<g class="poi-generic-group">
					<title>Campfire</title>
					<use class="poi-generic" href="#--poi" x="11.5" y="8.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="11.475" y="8.55">c</text>
				</g>
				<use class="tile-background" href="#--background" x="12" y="8"></use>
				<g class="poi-generic-group">
					<title>Hunting Goods</title>
					<use class="poi-generic" href="#--poi" x="12.5" y="8.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="12.475" y="8.55">4</text>
				</g>
			</g>
		</svg>
		<figcaption class="points-of-interest avoid-break-before">
			<header>Points of Interest</header>
			<dl>
				<div class="detailed">
					<dt class="poi-id">1</dt>
					<dd class="poi-title"><span class="poi-title">Main Embrace Gate</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">2</dt>
					<dd class="poi-title"><span class="poi-title">Strider site</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">3</dt>
					<dd class="poi-title"><span class="poi-title">Grazer site</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">4</dt>
					<dd class="poi-title"><span class="poi-title">Hunting Goods</span></dd>
				</div>
				<div class="detailed">
					<dt class="poi-id">c</dt>
					<dd class="poi-title"><span class="poi-title">Campfire</span></dd>
				</div>
			</dl>
		</figcaption>
	</figure>
</section>

<!-- -template map story/iaso/520-embrace svg -->
