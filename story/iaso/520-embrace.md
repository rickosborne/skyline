---
title: Map Test
---


<!-- +template map story/iaso/520-embrace svg -->

<!-- map data 9b70addf47675138933b04423b9c6d94a5f1c8c313e096d7ef99275d03ad0b8b
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
				.boulder-box {
					fill: #dd9944;
				}
				.forest-box {
					fill: #33cc33;
				}
				.machine-site-overlay {
					stroke: #ff0000;
					stroke-width: 0.1px;
					stroke-linejoin: bevel;
					fill: url(#machine-overlay-gradient);
				}
				.mountain-box {
					fill: #996633;
				}
				.tall-grass-box {
					fill: #cc3366;
				}
			</style>
			<defs>
				<rect fill="#dd9944" height="1" id="boulders" rx="0.1" ry="0.1" stroke="none" width="1"><title>boulders</title></rect>
				<rect fill="#33cc33" height="1" id="forest" rx="0.1" ry="0.1" stroke="none" width="1"><title>forest</title></rect>
				<rect fill="#99ff99" height="1" id="grass" rx="0.1" ry="0.1" stroke="none" width="1"><title>grass</title></rect>
				<linearGradient gradientUnits="userSpaceOnUse" id="machine-overlay-gradient" spreadMethod="repeat" x1="0" x2="0.2" y1="0" y2="0.2">
					<stop offset="0%" stop-color="#ff0000ff"></stop>
					<stop offset="50%" stop-color="#ff000000"></stop>
				</linearGradient>
				<rect fill="#996633" height="1" id="mountain" rx="0.1" ry="0.1" stroke="none" width="1"><title>mountain</title></rect>
				<rect fill="#cc8033" height="1" id="road" rx="0.1" ry="0.1" stroke="none" width="1"><title>road</title></rect>
				<rect fill="#6699ff" height="1" id="river" rx="0.1" ry="0.1" stroke="none" width="1"><title>river</title></rect>
				<rect fill="#99bbff" height="1" id="shallows" rx="0.1" ry="0.1" stroke="none" width="1"><title>shallows</title></rect>
				<rect fill="#cc3366" height="1" id="tall-grass" rx="0.1" ry="0.1" stroke="none" width="1"><title>tall grass</title></rect>
				<rect fill="transparent" height="1" id="--background" width="1"></rect>
				<circle fill="#ffff99" id="--poi" r="0.7" stroke="#80804d" stroke-width="0.07"></circle>
			</defs>
			<g class="layer-B">
				<g>
					<path class="forest-box" d="M33,0 L34,0 L35,0 L36,0 L37,0 L38,0 L38,1 L39,1 L39,2 L38,2 L37,2 L37,3 L36,3 L35,3 L34,3 L33,3 L33,2 L32,2 L32,1 L33,1 L33,0 L34,0 z"><title>forest</title></path>
				</g>
				<g>
					<path class="forest-box" d="M38,6 L39,6 L40,6 L41,6 L41,7 L41,8 L41,9 L40,9 L39,9 L38,9 L38,8 L37,8 L37,7 L38,7 L38,6 L39,6 z"><title>forest</title></path>
				</g>
				<g class="grass-squares">
					<use href="#grass" x="26" y="0"></use>
					<use href="#grass" x="27" y="0"></use>
					<use href="#grass" x="28" y="0"></use>
					<use href="#grass" x="29" y="0"></use>
					<use href="#grass" x="30" y="0"></use>
					<use href="#grass" x="31" y="0"></use>
					<use href="#grass" x="32" y="0"></use>
					<use href="#grass" x="38" y="0"></use>
					<use href="#grass" x="39" y="0"></use>
					<use href="#grass" x="40" y="0"></use>
					<use href="#grass" x="24" y="1"></use>
					<use href="#grass" x="25" y="1"></use>
					<use href="#grass" x="26" y="1"></use>
					<use href="#grass" x="27" y="1"></use>
					<use href="#grass" x="28" y="1"></use>
					<use href="#grass" x="31" y="1"></use>
					<use href="#grass" x="39" y="1"></use>
					<use href="#grass" x="40" y="1"></use>
					<use href="#grass" x="25" y="2"></use>
					<use href="#grass" x="26" y="2"></use>
					<use href="#grass" x="27" y="2"></use>
					<use href="#grass" x="31" y="2"></use>
					<use href="#grass" x="32" y="2"></use>
					<use href="#grass" x="37" y="2"></use>
					<use href="#grass" x="38" y="2"></use>
					<use href="#grass" x="39" y="2"></use>
					<use href="#grass" x="40" y="2"></use>
					<use href="#grass" x="24" y="3"></use>
					<use href="#grass" x="25" y="3"></use>
					<use href="#grass" x="31" y="3"></use>
					<use href="#grass" x="32" y="3"></use>
					<use href="#grass" x="33" y="3"></use>
					<use href="#grass" x="34" y="3"></use>
					<use href="#grass" x="35" y="3"></use>
					<use href="#grass" x="36" y="3"></use>
					<use href="#grass" x="37" y="3"></use>
					<use href="#grass" x="38" y="3"></use>
					<use href="#grass" x="31" y="4"></use>
					<use href="#grass" x="32" y="4"></use>
					<use href="#grass" x="33" y="4"></use>
					<use href="#grass" x="34" y="4"></use>
					<use href="#grass" x="35" y="4"></use>
					<use href="#grass" x="29" y="5"></use>
					<use href="#grass" x="30" y="5"></use>
					<use href="#grass" x="31" y="5"></use>
				</g>
				<g class="grass-squares">
					<use href="#grass" x="17" y="2"></use>
					<use href="#grass" x="18" y="2"></use>
					<use href="#grass" x="19" y="2"></use>
					<use href="#grass" x="20" y="2"></use>
					<use href="#grass" x="15" y="3"></use>
					<use href="#grass" x="16" y="3"></use>
					<use href="#grass" x="17" y="3"></use>
					<use href="#grass" x="18" y="3"></use>
					<use href="#grass" x="19" y="3"></use>
					<use href="#grass" x="12" y="4"></use>
					<use href="#grass" x="13" y="4"></use>
					<use href="#grass" x="14" y="4"></use>
					<use href="#grass" x="15" y="4"></use>
					<use href="#grass" x="16" y="4"></use>
					<use href="#grass" x="17" y="4"></use>
					<use href="#grass" x="9" y="5"></use>
					<use href="#grass" x="10" y="5"></use>
					<use href="#grass" x="11" y="5"></use>
					<use href="#grass" x="12" y="5"></use>
					<use href="#grass" x="13" y="5"></use>
					<use href="#grass" x="14" y="5"></use>
					<use href="#grass" x="15" y="5"></use>
					<use href="#grass" x="10" y="6"></use>
					<use href="#grass" x="11" y="6"></use>
					<use href="#grass" x="12" y="6"></use>
					<use href="#grass" x="13" y="6"></use>
					<use href="#grass" x="14" y="6"></use>
				</g>
				<g class="grass-squares">
					<use href="#grass" x="0" y="3"></use>
					<use href="#grass" x="1" y="3"></use>
					<use href="#grass" x="2" y="3"></use>
					<use href="#grass" x="0" y="4"></use>
					<use href="#grass" x="1" y="4"></use>
					<use href="#grass" x="2" y="4"></use>
					<use href="#grass" x="3" y="4"></use>
					<use href="#grass" x="0" y="5"></use>
					<use href="#grass" x="1" y="5"></use>
					<use href="#grass" x="2" y="5"></use>
					<use href="#grass" x="3" y="5"></use>
					<use href="#grass" x="4" y="5"></use>
					<use href="#grass" x="0" y="6"></use>
					<use href="#grass" x="1" y="6"></use>
					<use href="#grass" x="2" y="6"></use>
				</g>
				<g class="grass-squares">
					<use href="#grass" x="36" y="5"></use>
					<use href="#grass" x="37" y="5"></use>
					<use href="#grass" x="38" y="5"></use>
					<use href="#grass" x="39" y="5"></use>
					<use href="#grass" x="40" y="5"></use>
					<use href="#grass" x="35" y="6"></use>
					<use href="#grass" x="36" y="6"></use>
					<use href="#grass" x="37" y="6"></use>
					<use href="#grass" x="35" y="7"></use>
					<use href="#grass" x="36" y="7"></use>
					<use href="#grass" x="36" y="8"></use>
					<use href="#grass" x="37" y="8"></use>
				</g>
				<g class="grass-squares"><use href="#grass" x="19" y="5"></use></g>
				<g class="grass-squares">
					<use href="#grass" x="20" y="6"></use>
					<use href="#grass" x="21" y="6"></use>
					<use href="#grass" x="22" y="6"></use>
					<use href="#grass" x="23" y="6"></use>
					<use href="#grass" x="18" y="7"></use>
					<use href="#grass" x="19" y="7"></use>
					<use href="#grass" x="20" y="7"></use>
					<use href="#grass" x="21" y="7"></use>
					<use href="#grass" x="22" y="7"></use>
					<use href="#grass" x="23" y="7"></use>
					<use href="#grass" x="24" y="7"></use>
					<use href="#grass" x="25" y="7"></use>
					<use href="#grass" x="17" y="8"></use>
					<use href="#grass" x="18" y="8"></use>
					<use href="#grass" x="19" y="8"></use>
					<use href="#grass" x="20" y="8"></use>
					<use href="#grass" x="21" y="8"></use>
					<use href="#grass" x="22" y="8"></use>
					<use href="#grass" x="23" y="8"></use>
					<use href="#grass" x="24" y="8"></use>
					<use href="#grass" x="25" y="8"></use>
					<use href="#grass" x="26" y="8"></use>
					<use href="#grass" x="27" y="8"></use>
				</g>
				<g class="grass-squares"><use href="#grass" x="17" y="6"></use></g>
				<g class="grass-squares">
					<use href="#grass" x="27" y="6"></use>
					<use href="#grass" x="28" y="6"></use>
					<use href="#grass" x="28" y="7"></use>
				</g>
				<g class="grass-squares">
					<use href="#grass" x="4" y="7"></use>
					<use href="#grass" x="5" y="7"></use>
					<use href="#grass" x="0" y="8"></use>
					<use href="#grass" x="1" y="8"></use>
					<use href="#grass" x="2" y="8"></use>
					<use href="#grass" x="3" y="8"></use>
					<use href="#grass" x="4" y="8"></use>
				</g>
				<g class="grass-squares">
					<use href="#grass" x="9" y="7"></use>
					<use href="#grass" x="8" y="8"></use>
					<use href="#grass" x="9" y="8"></use>
					<use href="#grass" x="10" y="8"></use>
				</g>
				<g class="grass-squares">
					<use href="#grass" x="32" y="7"></use>
					<use href="#grass" x="30" y="8"></use>
					<use href="#grass" x="31" y="8"></use>
					<use href="#grass" x="32" y="8"></use>
					<use href="#grass" x="33" y="8"></use>
				</g>
				<g>
					<path class="mountain-box" d="M0,0 L1,0 L2,0 L3,0 L4,0 L5,0 L6,0 L7,0 L8,0 L9,0 L10,0 L11,0 L12,0 L13,0 L14,0 L15,0 L16,0 L17,0 L18,0 L19,0 L20,0 L20,1 L19,1 L19,2 L18,2 L17,2 L17,3 L16,3 L15,3 L15,4 L14,4 L13,4 L12,4 L12,5 L11,5 L10,5 L9,5 L9,6 L8,6 L7,6 L6,6 L5,6 L5,5 L4,5 L4,4 L3,4 L3,3 L2,3 L1,3 L1,2 L0,2 L0,1 L0,0 L1,0 z"><title>mountain</title></path>
				</g>
				<g>
					<path class="mountain-box" d="M5,8 L6,8 L7,8 L8,8 L8,9 L7,9 L6,9 L5,9 L5,8 L6,8 z"><title>mountain</title></path>
				</g>
				<g class="road-squares">
					<use href="#road" x="20" y="1"></use>
					<use href="#road" x="21" y="2"></use>
					<use href="#road" x="20" y="3"></use>
					<use href="#road" x="18" y="4"></use>
					<use href="#road" x="19" y="4"></use>
					<use href="#road" x="20" y="4"></use>
					<use href="#road" x="16" y="5"></use>
					<use href="#road" x="17" y="5"></use>
					<use href="#road" x="3" y="6"></use>
					<use href="#road" x="4" y="6"></use>
					<use href="#road" x="5" y="6"></use>
					<use href="#road" x="6" y="6"></use>
					<use href="#road" x="7" y="6"></use>
					<use href="#road" x="8" y="6"></use>
					<use href="#road" x="9" y="6"></use>
					<use href="#road" x="15" y="6"></use>
					<use href="#road" x="0" y="7"></use>
					<use href="#road" x="1" y="7"></use>
					<use href="#road" x="2" y="7"></use>
					<use href="#road" x="6" y="7"></use>
					<use href="#road" x="7" y="7"></use>
					<use href="#road" x="10" y="7"></use>
					<use href="#road" x="11" y="7"></use>
					<use href="#road" x="12" y="7"></use>
					<use href="#road" x="13" y="7"></use>
					<use href="#road" x="14" y="7"></use>
					<use href="#road" x="13" y="8"></use>
				</g>
				<g class="road-squares">
					<use href="#road" x="40" y="3"></use>
					<use href="#road" x="23" y="4"></use>
					<use href="#road" x="24" y="4"></use>
					<use href="#road" x="25" y="4"></use>
					<use href="#road" x="36" y="4"></use>
					<use href="#road" x="37" y="4"></use>
					<use href="#road" x="38" y="4"></use>
					<use href="#road" x="39" y="4"></use>
					<use href="#road" x="26" y="5"></use>
					<use href="#road" x="27" y="5"></use>
					<use href="#road" x="28" y="5"></use>
					<use href="#road" x="32" y="5"></use>
					<use href="#road" x="33" y="5"></use>
					<use href="#road" x="34" y="5"></use>
					<use href="#road" x="35" y="5"></use>
					<use href="#road" x="29" y="6"></use>
					<use href="#road" x="30" y="6"></use>
					<use href="#road" x="31" y="6"></use>
				</g>
				<g>
					<path class="tall-grass-box" d="M29,1 L30,1 L31,1 L31,2 L31,3 L31,4 L31,5 L30,5 L29,5 L28,5 L27,5 L27,4 L26,4 L26,3 L27,3 L28,3 L28,2 L29,2 L29,1 L30,1 z"><title>tall grass</title></path>
				</g>
				<g>
					<path class="tall-grass-box" d="M29,7 L30,7 L31,7 L31,8 L30,8 L29,8 L29,7 L30,7 z"><title>tall grass</title></path>
				</g>
				<use href="#mountain" x="0" y="0"></use>
				<use href="#grass" x="20" y="0"></use>
				<use href="#road" x="21" y="0"></use>
				<use href="#grass" x="22" y="0"></use>
				<use href="#river" x="23" y="0"></use>
				<use href="#river" x="24" y="0"></use>
				<use href="#grass" x="25" y="0"></use>
				<use href="#forest" x="33" y="0"></use>
				<use href="#grass" x="19" y="1"></use>
				<use href="#grass" x="21" y="1"></use>
				<use href="#river" x="22" y="1"></use>
				<use href="#river" x="23" y="1"></use>
				<use href="#tall-grass" x="29" y="1"></use>
				<use href="#grass" x="0" y="2"></use>
				<use href="#grass" x="22" y="2"></use>
				<use href="#river" x="23" y="2"></use>
				<use href="#river" x="24" y="2"></use>
				<use href="#grass" x="21" y="3"></use>
				<use href="#river" x="22" y="3"></use>
				<use href="#river" x="23" y="3"></use>
				<use href="#road" x="39" y="3"></use>
				<use href="#shallows" x="21" y="4"></use>
				<use href="#shallows" x="22" y="4"></use>
				<use href="#grass" x="26" y="4"></use>
				<use href="#grass" x="40" y="4"></use>
				<use href="#grass" x="18" y="5"></use>
				<use href="#river" x="20" y="5"></use>
				<use href="#river" x="21" y="5"></use>
				<use href="#grass" x="22" y="5"></use>
				<use href="#river" x="23" y="5"></use>
				<use href="#river" x="24" y="5"></use>
				<use href="#grass" x="25" y="5"></use>
				<use href="#grass" x="16" y="6"></use>
				<use href="#river" x="18" y="6"></use>
				<use href="#river" x="19" y="6"></use>
				<use href="#river" x="24" y="6"></use>
				<use href="#river" x="25" y="6"></use>
				<use href="#grass" x="26" y="6"></use>
				<use href="#forest" x="38" y="6"></use>
				<use href="#grass" x="3" y="7"></use>
				<use href="#grass" x="8" y="7"></use>
				<use href="#grass" x="15" y="7"></use>
				<use href="#river" x="16" y="7"></use>
				<use href="#river" x="17" y="7"></use>
				<use href="#river" x="26" y="7"></use>
				<use href="#river" x="27" y="7"></use>
				<use href="#tall-grass" x="29" y="7"></use>
				<use href="#grass" x="31" y="7"></use>
				<use href="#mountain" x="5" y="8"></use>
				<use href="#grass" x="14" y="8"></use>
				<use href="#river" x="15" y="8"></use>
				<use href="#river" x="16" y="8"></use>
				<use href="#river" x="28" y="8"></use>
				<use href="#river" x="29" y="8"></use>
			</g>
			<g class="layer-O">
				<g>
					<path class="boulders-box" d="M32,6 L33,6 L34,6 L35,6 L35,7 L35,8 L36,8 L36,9 L35,9 L34,9 L34,8 L33,8 L33,7 L32,7 L32,6 L33,6 z"><title>boulders</title></path>
				</g>
				<path class="machine-site-overlay" d="M13,4 L15,4 L15,5 L14,6 L11,6 L11,5 z"><title>machine site</title></path>
				<path class="machine-site-overlay" d="M35,6 L38,6 L38,7 L37,8 L35,8 z"><title>machine site</title></path>
				<use href="#machine-site" x="12" y="4"></use>
				<use href="#machine-site" x="37" y="5"></use>
				<use href="#boulders" x="32" y="6"></use>
			</g>
			<g class="layer-P">
				<g>
					<title>Strider site</title>
					<use href="#--poi" x="13" y="5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="12.975" y="5.05">2</text>
				</g>
				<g>
					<title>Grazer site</title>
					<use href="#--poi" x="36.5" y="7"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="36.475" y="7.05">3</text>
				</g>
				<g>
					<title>Main Embrace Gate</title>
					<use href="#--poi" x="7" y="7"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="6.975" y="7.05">1</text>
				</g>
				<use href="#grass" x="12" y="4"></use>
				<g>
					<title>Strider site</title>
					<use href="#--poi" x="12.5" y="4.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="12.475" y="4.55">2</text>
				</g>
				<use href="#grass" x="37" y="5"></use>
				<g>
					<title>Grazer site</title>
					<use href="#--poi" x="37.5" y="5.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="37.475" y="5.55">3</text>
				</g>
				<use href="#road" x="6" y="6"></use>
				<g>
					<title>Main Embrace Gate</title>
					<use href="#--poi" x="6.5" y="6.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="6.475" y="6.55">1</text>
				</g>
				<use href="#--background" x="11" y="8"></use>
				<g>
					<title>Campfire</title>
					<use href="#--poi" x="11.5" y="8.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="11.475" y="8.55">c</text>
				</g>
				<use href="#--background" x="12" y="8"></use>
				<g>
					<title>Hunting Goods</title>
					<use href="#--poi" x="12.5" y="8.5"></use>
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
