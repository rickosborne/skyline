---
title: Map Test
---


<!-- +template map story/iaso/520-embrace svg -->

<!-- map data 69271edc12f68907f89508c301f194ff0d8e1314849e5215b8e4cd98f06701b8
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
				.boulders-box {
					fill: #dd9944;
				}
				.mountain-box {
					fill: #996633;
				}
				.forest-box {
					fill: #33cc33;
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
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="26" y="0"></use>
					<use class="generic-tile" href="#grass" x="27" y="0"></use>
					<use class="generic-tile" href="#grass" x="28" y="0"></use>
					<use class="generic-tile" href="#grass" x="29" y="0"></use>
					<use class="generic-tile" href="#grass" x="30" y="0"></use>
					<use class="generic-tile" href="#grass" x="31" y="0"></use>
					<use class="generic-tile" href="#grass" x="32" y="0"></use>
					<use class="generic-tile" href="#grass" x="38" y="0"></use>
					<use class="generic-tile" href="#grass" x="39" y="0"></use>
					<use class="generic-tile" href="#grass" x="40" y="0"></use>
					<use class="generic-tile" href="#grass" x="24" y="1"></use>
					<use class="generic-tile" href="#grass" x="25" y="1"></use>
					<use class="generic-tile" href="#grass" x="26" y="1"></use>
					<use class="generic-tile" href="#grass" x="27" y="1"></use>
					<use class="generic-tile" href="#grass" x="28" y="1"></use>
					<use class="generic-tile" href="#grass" x="31" y="1"></use>
					<use class="generic-tile" href="#grass" x="39" y="1"></use>
					<use class="generic-tile" href="#grass" x="40" y="1"></use>
					<use class="generic-tile" href="#grass" x="25" y="2"></use>
					<use class="generic-tile" href="#grass" x="26" y="2"></use>
					<use class="generic-tile" href="#grass" x="27" y="2"></use>
					<use class="generic-tile" href="#grass" x="31" y="2"></use>
					<use class="generic-tile" href="#grass" x="32" y="2"></use>
					<use class="generic-tile" href="#grass" x="37" y="2"></use>
					<use class="generic-tile" href="#grass" x="38" y="2"></use>
					<use class="generic-tile" href="#grass" x="39" y="2"></use>
					<use class="generic-tile" href="#grass" x="40" y="2"></use>
					<use class="generic-tile" href="#grass" x="24" y="3"></use>
					<use class="generic-tile" href="#grass" x="25" y="3"></use>
					<use class="generic-tile" href="#grass" x="31" y="3"></use>
					<use class="generic-tile" href="#grass" x="32" y="3"></use>
					<use class="generic-tile" href="#grass" x="33" y="3"></use>
					<use class="generic-tile" href="#grass" x="34" y="3"></use>
					<use class="generic-tile" href="#grass" x="35" y="3"></use>
					<use class="generic-tile" href="#grass" x="36" y="3"></use>
					<use class="generic-tile" href="#grass" x="37" y="3"></use>
					<use class="generic-tile" href="#grass" x="38" y="3"></use>
					<use class="generic-tile" href="#grass" x="31" y="4"></use>
					<use class="generic-tile" href="#grass" x="32" y="4"></use>
					<use class="generic-tile" href="#grass" x="33" y="4"></use>
					<use class="generic-tile" href="#grass" x="34" y="4"></use>
					<use class="generic-tile" href="#grass" x="35" y="4"></use>
					<use class="generic-tile" href="#grass" x="29" y="5"></use>
					<use class="generic-tile" href="#grass" x="30" y="5"></use>
					<use class="generic-tile" href="#grass" x="31" y="5"></use>
				</g>
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="17" y="2"></use>
					<use class="generic-tile" href="#grass" x="18" y="2"></use>
					<use class="generic-tile" href="#grass" x="19" y="2"></use>
					<use class="generic-tile" href="#grass" x="20" y="2"></use>
					<use class="generic-tile" href="#grass" x="15" y="3"></use>
					<use class="generic-tile" href="#grass" x="16" y="3"></use>
					<use class="generic-tile" href="#grass" x="17" y="3"></use>
					<use class="generic-tile" href="#grass" x="18" y="3"></use>
					<use class="generic-tile" href="#grass" x="19" y="3"></use>
					<use class="generic-tile" href="#grass" x="12" y="4"></use>
					<use class="generic-tile" href="#grass" x="13" y="4"></use>
					<use class="generic-tile" href="#grass" x="14" y="4"></use>
					<use class="generic-tile" href="#grass" x="15" y="4"></use>
					<use class="generic-tile" href="#grass" x="16" y="4"></use>
					<use class="generic-tile" href="#grass" x="17" y="4"></use>
					<use class="generic-tile" href="#grass" x="9" y="5"></use>
					<use class="generic-tile" href="#grass" x="10" y="5"></use>
					<use class="generic-tile" href="#grass" x="11" y="5"></use>
					<use class="generic-tile" href="#grass" x="12" y="5"></use>
					<use class="generic-tile" href="#grass" x="13" y="5"></use>
					<use class="generic-tile" href="#grass" x="14" y="5"></use>
					<use class="generic-tile" href="#grass" x="15" y="5"></use>
					<use class="generic-tile" href="#grass" x="10" y="6"></use>
					<use class="generic-tile" href="#grass" x="11" y="6"></use>
					<use class="generic-tile" href="#grass" x="12" y="6"></use>
					<use class="generic-tile" href="#grass" x="13" y="6"></use>
					<use class="generic-tile" href="#grass" x="14" y="6"></use>
				</g>
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="0" y="3"></use>
					<use class="generic-tile" href="#grass" x="1" y="3"></use>
					<use class="generic-tile" href="#grass" x="2" y="3"></use>
					<use class="generic-tile" href="#grass" x="0" y="4"></use>
					<use class="generic-tile" href="#grass" x="1" y="4"></use>
					<use class="generic-tile" href="#grass" x="2" y="4"></use>
					<use class="generic-tile" href="#grass" x="3" y="4"></use>
					<use class="generic-tile" href="#grass" x="0" y="5"></use>
					<use class="generic-tile" href="#grass" x="1" y="5"></use>
					<use class="generic-tile" href="#grass" x="2" y="5"></use>
					<use class="generic-tile" href="#grass" x="3" y="5"></use>
					<use class="generic-tile" href="#grass" x="4" y="5"></use>
					<use class="generic-tile" href="#grass" x="0" y="6"></use>
					<use class="generic-tile" href="#grass" x="1" y="6"></use>
					<use class="generic-tile" href="#grass" x="2" y="6"></use>
				</g>
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="36" y="5"></use>
					<use class="generic-tile" href="#grass" x="37" y="5"></use>
					<use class="generic-tile" href="#grass" x="38" y="5"></use>
					<use class="generic-tile" href="#grass" x="39" y="5"></use>
					<use class="generic-tile" href="#grass" x="40" y="5"></use>
					<use class="generic-tile" href="#grass" x="35" y="6"></use>
					<use class="generic-tile" href="#grass" x="36" y="6"></use>
					<use class="generic-tile" href="#grass" x="37" y="6"></use>
					<use class="generic-tile" href="#grass" x="35" y="7"></use>
					<use class="generic-tile" href="#grass" x="36" y="7"></use>
					<use class="generic-tile" href="#grass" x="36" y="8"></use>
					<use class="generic-tile" href="#grass" x="37" y="8"></use>
				</g>
				<g class="grass-squares"><use class="generic-tile" href="#grass" x="19" y="5"></use></g>
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="20" y="6"></use>
					<use class="generic-tile" href="#grass" x="21" y="6"></use>
					<use class="generic-tile" href="#grass" x="22" y="6"></use>
					<use class="generic-tile" href="#grass" x="23" y="6"></use>
					<use class="generic-tile" href="#grass" x="18" y="7"></use>
					<use class="generic-tile" href="#grass" x="19" y="7"></use>
					<use class="generic-tile" href="#grass" x="20" y="7"></use>
					<use class="generic-tile" href="#grass" x="21" y="7"></use>
					<use class="generic-tile" href="#grass" x="22" y="7"></use>
					<use class="generic-tile" href="#grass" x="23" y="7"></use>
					<use class="generic-tile" href="#grass" x="24" y="7"></use>
					<use class="generic-tile" href="#grass" x="25" y="7"></use>
					<use class="generic-tile" href="#grass" x="17" y="8"></use>
					<use class="generic-tile" href="#grass" x="18" y="8"></use>
					<use class="generic-tile" href="#grass" x="19" y="8"></use>
					<use class="generic-tile" href="#grass" x="20" y="8"></use>
					<use class="generic-tile" href="#grass" x="21" y="8"></use>
					<use class="generic-tile" href="#grass" x="22" y="8"></use>
					<use class="generic-tile" href="#grass" x="23" y="8"></use>
					<use class="generic-tile" href="#grass" x="24" y="8"></use>
					<use class="generic-tile" href="#grass" x="25" y="8"></use>
					<use class="generic-tile" href="#grass" x="26" y="8"></use>
					<use class="generic-tile" href="#grass" x="27" y="8"></use>
				</g>
				<g class="grass-squares"><use class="generic-tile" href="#grass" x="17" y="6"></use></g>
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="27" y="6"></use>
					<use class="generic-tile" href="#grass" x="28" y="6"></use>
					<use class="generic-tile" href="#grass" x="28" y="7"></use>
				</g>
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="4" y="7"></use>
					<use class="generic-tile" href="#grass" x="5" y="7"></use>
					<use class="generic-tile" href="#grass" x="0" y="8"></use>
					<use class="generic-tile" href="#grass" x="1" y="8"></use>
					<use class="generic-tile" href="#grass" x="2" y="8"></use>
					<use class="generic-tile" href="#grass" x="3" y="8"></use>
					<use class="generic-tile" href="#grass" x="4" y="8"></use>
				</g>
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="9" y="7"></use>
					<use class="generic-tile" href="#grass" x="8" y="8"></use>
					<use class="generic-tile" href="#grass" x="9" y="8"></use>
					<use class="generic-tile" href="#grass" x="10" y="8"></use>
				</g>
				<g class="grass-squares">
					<use class="generic-tile" href="#grass" x="32" y="7"></use>
					<use class="generic-tile" href="#grass" x="30" y="8"></use>
					<use class="generic-tile" href="#grass" x="31" y="8"></use>
					<use class="generic-tile" href="#grass" x="32" y="8"></use>
					<use class="generic-tile" href="#grass" x="33" y="8"></use>
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
				<g class="tall-grass-group">
					<path class="tall-grass-box" d="M29,1 h2 v4 h-4 v-1 h-1 v-1 h2 v-1 h1 v-1 h1 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-box" d="M29,7 h2 v1 h-2 v-1 h1 z"><title>tall grass</title></path>
				</g>
				<use class="generic-tile" href="#mountain" x="0" y="0"></use>
				<use class="generic-tile" href="#grass" x="20" y="0"></use>
				<use class="generic-tile" href="#road" x="21" y="0"></use>
				<use class="generic-tile" href="#grass" x="22" y="0"></use>
				<use class="generic-tile" href="#river" x="23" y="0"></use>
				<use class="generic-tile" href="#river" x="24" y="0"></use>
				<use class="generic-tile" href="#grass" x="25" y="0"></use>
				<use class="generic-tile" href="#forest" x="33" y="0"></use>
				<use class="generic-tile" href="#grass" x="19" y="1"></use>
				<use class="generic-tile" href="#grass" x="21" y="1"></use>
				<use class="generic-tile" href="#river" x="22" y="1"></use>
				<use class="generic-tile" href="#river" x="23" y="1"></use>
				<use class="generic-tile" href="#tall-grass" x="29" y="1"></use>
				<use class="generic-tile" href="#grass" x="0" y="2"></use>
				<use class="generic-tile" href="#grass" x="22" y="2"></use>
				<use class="generic-tile" href="#river" x="23" y="2"></use>
				<use class="generic-tile" href="#river" x="24" y="2"></use>
				<use class="generic-tile" href="#grass" x="21" y="3"></use>
				<use class="generic-tile" href="#river" x="22" y="3"></use>
				<use class="generic-tile" href="#river" x="23" y="3"></use>
				<use class="generic-tile" href="#road" x="39" y="3"></use>
				<use class="generic-tile" href="#shallows" x="21" y="4"></use>
				<use class="generic-tile" href="#shallows" x="22" y="4"></use>
				<use class="generic-tile" href="#grass" x="26" y="4"></use>
				<use class="generic-tile" href="#grass" x="40" y="4"></use>
				<use class="generic-tile" href="#grass" x="18" y="5"></use>
				<use class="generic-tile" href="#river" x="20" y="5"></use>
				<use class="generic-tile" href="#river" x="21" y="5"></use>
				<use class="generic-tile" href="#grass" x="22" y="5"></use>
				<use class="generic-tile" href="#river" x="23" y="5"></use>
				<use class="generic-tile" href="#river" x="24" y="5"></use>
				<use class="generic-tile" href="#grass" x="25" y="5"></use>
				<use class="generic-tile" href="#grass" x="16" y="6"></use>
				<use class="generic-tile" href="#river" x="18" y="6"></use>
				<use class="generic-tile" href="#river" x="19" y="6"></use>
				<use class="generic-tile" href="#river" x="24" y="6"></use>
				<use class="generic-tile" href="#river" x="25" y="6"></use>
				<use class="generic-tile" href="#grass" x="26" y="6"></use>
				<use class="generic-tile" href="#boulders" x="32" y="6"></use>
				<use class="generic-tile" href="#forest" x="38" y="6"></use>
				<use class="generic-tile" href="#grass" x="3" y="7"></use>
				<use class="generic-tile" href="#grass" x="8" y="7"></use>
				<use class="generic-tile" href="#grass" x="15" y="7"></use>
				<use class="generic-tile" href="#river" x="16" y="7"></use>
				<use class="generic-tile" href="#river" x="17" y="7"></use>
				<use class="generic-tile" href="#river" x="26" y="7"></use>
				<use class="generic-tile" href="#river" x="27" y="7"></use>
				<use class="generic-tile" href="#tall-grass" x="29" y="7"></use>
				<use class="generic-tile" href="#grass" x="31" y="7"></use>
				<use class="generic-tile" href="#mountain" x="5" y="8"></use>
				<use class="generic-tile" href="#grass" x="14" y="8"></use>
				<use class="generic-tile" href="#river" x="15" y="8"></use>
				<use class="generic-tile" href="#river" x="16" y="8"></use>
				<use class="generic-tile" href="#river" x="28" y="8"></use>
				<use class="generic-tile" href="#river" x="29" y="8"></use>
			</g>
			<g class="layer-O">
				<path class="machine-site-overlay" d="M13,4 h2 v1 l-1,1 h-3 v-1 z"><title>machine site</title></path>
				<path class="machine-site-overlay" d="M35,6 h3 v1 l-1,1 h-2 z"><title>machine site</title></path>
				<use class="generic-tile" href="#machine-site" x="12" y="4"></use>
				<use class="generic-tile" href="#machine-site" x="37" y="5"></use>
			</g>
			<g class="layer-P">
				<g class="poi-generic-group">
					<title>Strider site</title>
					<use class="poi-generic" href="#--poi" x="13" y="5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="12.975" y="5.05">2</text>
				</g>
				<g class="poi-generic-group">
					<title>Grazer site</title>
					<use class="poi-generic" href="#--poi" x="36.5" y="7"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="36.475" y="7.05">3</text>
				</g>
				<g class="poi-generic-group">
					<title>Main Embrace Gate</title>
					<use class="poi-generic" href="#--poi" x="7" y="7"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="6.975" y="7.05">1</text>
				</g>
				<use class="generic-tile" href="#grass" x="12" y="4"></use>
				<g class="poi-generic-group">
					<title>Strider site</title>
					<use class="poi-generic" href="#--poi" x="12.5" y="4.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="12.475" y="4.55">2</text>
				</g>
				<use class="generic-tile" href="#grass" x="37" y="5"></use>
				<g class="poi-generic-group">
					<title>Grazer site</title>
					<use class="poi-generic" href="#--poi" x="37.5" y="5.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="37.475" y="5.55">3</text>
				</g>
				<use class="generic-tile" href="#road" x="6" y="6"></use>
				<g class="poi-generic-group">
					<title>Main Embrace Gate</title>
					<use class="poi-generic" href="#--poi" x="6.5" y="6.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="6.475" y="6.55">1</text>
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
