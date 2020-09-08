---
title: Map Test
---


<!-- +template map story/iaso/520-embrace svg -->

<!-- map data 0f6307761e8d6433dfe7a70fb53265a64ec797f8d024c18288724de7f9b65c3d
Map
  Title: All-Mother's Embrace
  Theme: Outdoor
  Scale: 0.25mi per point
;;;;;;;;;;;;;;;;;;;;.r.ww........fffff...   Environment:
;;;;;;;;;;;;;;;;;;;.r.ww.....::.fffffff..   ; mountain
.;;;;;;;;;;;;;;;;....r.ww...:::..ffff....   w river
...;;;;;;;;;;;;.....r.ww..:::::........rr   . grass
....;;;;;;;;222...rrrssrrr.::::.....rrrr.   : tall grass
.....;;;;..222..rr..ww.ww.rrr...rrrr.3...   f forest
...rrr11rr.....r..ww....ww...rrrbbb333fff   r road
rrr...11..rrrrr.ww........ww.::..bb33ffff   s shallows
.....;;;...c4r.ww...........ww....bb..fff   b boulders
                                            
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
				}
				.boulders-box {
					fill: #dd9944;
				}
				.mountain-box {
					fill: #996633;
				}
				.forest-box {
					fill: #33cc33;
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
				.tall-grass-box {
					fill: #cc3366;
				}
				.machine-site-overlay {
					stroke: #ff0000;
					stroke-width: 0.1px;
					stroke-linejoin: bevel;
					fill: url(#machine-overlay-gradient);
				}
			</style>
			<defs>
				<rect fill="#99ff99" height="1" id="grass" rx="0.1" ry="0.1" stroke="none" width="1"><title>grass</title></rect>
				<rect fill="#dd9944" height="1" id="boulders" rx="0.1" ry="0.1" stroke="none" width="1"><title>boulders</title></rect>
				<rect fill="#996633" height="1" id="mountain" rx="0.1" ry="0.1" stroke="none" width="1"><title>mountain</title></rect>
				<rect fill="#33cc33" height="1" id="forest" rx="0.1" ry="0.1" stroke="none" width="1"><title>forest</title></rect>
				<rect fill="#cc8033" height="1" id="road" rx="0.1" ry="0.1" stroke="none" width="1"><title>road</title></rect>
				<rect fill="#6699ff" height="1" id="river" rx="0.1" ry="0.1" stroke="none" width="1"><title>river</title></rect>
				<rect fill="#99bbff" height="1" id="shallows" rx="0.1" ry="0.1" stroke="none" width="1"><title>shallows</title></rect>
				<rect fill="#cc3366" height="1" id="tall-grass" rx="0.1" ry="0.1" stroke="none" width="1"><title>tall grass</title></rect>
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
					<path class="grass-box" d="M25,0 h8 v1 h-1 v1 h1 v1 h4 v-1 h2 v-1 h-1 v-1 h3 v3 h-2 v1 h-3 v1 h-4 v1 h-3 v-1 h2 v-4 h-2 v1 h-1 v1 h-2 v1 h-2 v-1 h1 v-1 h-1 v-1 h1 v-1 h1 z"><title>grass</title></path>
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
					<path class="grass-box" d="M26,4 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
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
					<path class="grass-box" d="M31,7 h2 v1 h1 v1 h-4 v-1 h1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="grass-group">
					<path class="grass-box" d="M14,8 h1 v1 h-1 v-1 h1 z"><title>grass</title></path>
				</g>
				<g class="boulders-group">
					<path class="boulders-box" d="M32,6 h3 v2 h1 v1 h-2 v-1 h-1 v-1 h-1 v-1 h1 z"><title>boulders</title></path>
				</g>
				<g class="mountain-group">
					<path class="mountain-box" d="M0,0 h20 v1 h-1 v1 h-2 v1 h-2 v1 h-3 v1 h-3 v1 h-4 v-1 h-1 v-1 h-1 v-1 h-2 v-1 h-1 v-2 h1 z"><title>mountain</title></path>
				</g>
				<g class="mountain-group">
					<path class="mountain-box" d="M5,8 h3 v1 h-3 v-1 h1 z"><title>mountain</title></path>
				</g>
				<g class="forest-group">
					<path class="forest-box" d="M33,0 h5 v1 h1 v1 h-2 v1 h-4 v-1 h-1 v-1 h1 v-1 h1 z"><title>forest</title></path>
				</g>
				<g class="forest-group">
					<path class="forest-box" d="M38,6 h3 v3 h-3 v-1 h-1 v-1 h1 v-1 h1 z"><title>forest</title></path>
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
					<path class="tall-grass-box" d="M29,1 h2 v4 h-4 v-1 h-1 v-1 h2 v-1 h1 v-1 h1 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-box" d="M29,7 h2 v1 h-2 v-1 h1 z"><title>tall grass</title></path>
				</g>
			</g>
			<g class="layer-O">
				<path class="machine-site-overlay" d="M12,4 h3 v1 l-1,1 h-3 v-1 z"><title>machine site</title></path>
				<path class="machine-site-overlay" d="M37,5 h1 v2 l-1,1 h-2 v-2 z"><title>machine site</title></path>
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
