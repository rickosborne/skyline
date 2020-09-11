---
title: Map Test
---


<!-- +template map story/iaso/520-embrace svg -->

<!-- map data de07ea24c0d0ade111a2bf32b3508a5ab12d7c8e6cfc1a5182648be443202438
Map
  Title: All-Mother's Embrace
  Theme: Outdoor
  Scale: 0.25mi per point
;;;;;;;;;;;;;;;;;;;;.r.ww.....:..ffffffff   Environment:
;;;;;;;;;;;;;;;;;;;.r.ww.....::.ffffffff.   ; mountain
.;;;;;;;;;;;;;;;;....r.ww...:::..ffff....   w river
...;;;;;;;;;;;;.....r.ww..:::::........rr   . grass
....;;;;;;;;222...rr.rsrrr...::.....rrrr.   : tall grass
.....;;;;..222..rr..ww.ww.rrr...rrrr.3...   f forest
...rrr11rr.....r..ww....ww...rrrbbb333fff   r road
rrr...11..rrr.r.ww........ww.::..bb33ffff   s shallows
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
				.grass-matte {
					fill: #99ff99;
					filter: url(#grass-filter);
				}
				.boulders-box {
					fill: #dd9944;
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
					fill: #33cc33;
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
					<feGaussianBlur stdDeviation="0.01"></feGaussianBlur>
				</filter>
				<filter id="road-filter"><feGaussianBlur stdDeviation="0.01"></feGaussianBlur></filter>
				<rect fill="#6699ff" height="1" id="river" rx="0.1" ry="0.1" stroke="none" width="1"><title>river</title></rect>
				<rect fill="#99bbff" height="1" id="shallows" rx="0.1" ry="0.1" stroke="none" width="1"><title>shallows</title></rect>
				<filter id="tall-grass-filter">
					<feTurbulence baseFrequency="4" numOctaves="4" result="turbulence" type="turbulence"></feTurbulence>
					<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="1" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap>
					<feGaussianBlur stdDeviation="0.01"></feGaussianBlur>
				</filter>
				<linearGradient gradientUnits="userSpaceOnUse" id="machine-overlay-gradient" spreadMethod="repeat" x1="0" x2="0.2" y1="0" y2="0.2">
					<stop offset="0%" stop-color="#ff0000ff"></stop>
					<stop offset="50%" stop-color="#ff000000"></stop>
				</linearGradient>
				<rect fill="transparent" height="1" id="--background" width="1"></rect>
				<circle fill="#ffff99" id="--poi" r="0.7" stroke="#80804d" stroke-width="0.07"></circle>
			</defs>
			<g class="layer-B">
				<rect class="grass-matte" height="11" width="43" x="-1" y="-1"></rect>
				<g class="boulders-group">
					<path class="boulders-box" d="M32,6 h3 v2 h1 v1 h-2 v-1 h-1 v-1 h-1 v-1 h1 z"><title>boulders</title></path>
				</g>
				<g class="mountain-group">
					<path class="mountain-round" d="M9.5,-1 Q20,-1,20,0 Q20,1,19.5,1 Q19,1,19,1.5 Q19,2,18,2 Q17,2,17,2.5 Q17,3,16,3 Q15,3,15,3.5 Q15,4,13.5,4 Q12,4,12,4.5 Q12,5,10.5,5 Q9,5,9,5.5 Q9,6,7,6 Q5,6,5,5.5 Q5,5,4.5,5 Q4,5,4,4.5 Q4,4,3.5,4 Q3,4,3,3.5 Q3,3,2,3 Q1,3,1,2.5 Q1,2,0,2 Q-1,2,-1,0.5 Q-1,-1,0,-1 Q1,-1,0,-1 Q0,0,9.5,-1 z"><title>mountain</title></path>
				</g>
				<g class="mountain-group">
					<path class="mountain-round" d="M6.5,8 Q8,8,8,9 Q8,10,6.5,10 Q5,10,5,9 Q5,8,5.5,8 Q6,8,5.5,8 Q5,8,6.5,8 z"><title>mountain</title></path>
				</g>
				<g class="forest-group">
					<path class="forest-round" d="M37.5,-1 Q42,-1,42,0 Q42,1,41,1 Q40,1,40,1.5 Q40,2,38.5,2 Q37,2,37,2.5 Q37,3,35,3 Q33,3,33,2.5 Q33,2,32.5,2 Q32,2,32,1.5 Q32,1,32.5,1 Q33,1,33,0 Q33,-1,33.5,-1 Q34,-1,33.5,-1 Q33,0,37.5,-1 z"><title>forest</title></path>
				</g>
				<g class="forest-group">
					<path class="forest-round" d="M40,6 Q42,6,42,8 Q42,10,40,10 Q38,10,38,9 Q38,8,37.5,8 Q37,8,37,7.5 Q37,7,37.5,7 Q38,7,38,6.5 Q38,6,38.5,6 Q39,6,38.5,6 Q38,6,40,6 z"><title>forest</title></path>
				</g>
				<g class="road-journey">
					<path d="M21.3,0 h0.4 Q21.5,0.5,21.3,0 h0.4 Q21.5,0.5,21.7,1 h-0.4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q21.5,0.5,21.3,0 z"><title>road</title></path>
					<path d="M20.7,1 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 q-0.2,0.2,0,0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q20.5,1.5,20.7,1 z"><title>road</title></path>
					<path d="M21,2.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q21.5,2.5,21.3,3 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 q0.2,-0.2,0,-0.4 z"><title>road</title></path>
					<path d="M20.7,3 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 q-0.2,0.2,0,0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 q-0.2,-0.2,-0.4,0 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q20.5,3.5,20.7,3 z"><title>road</title></path>
					<path d="M19,4.3 v0.4 Q18.5,4.5,18.3,5 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q18.5,4.5,19,4.3 z"><title>road</title></path>
					<path d="M19.7,4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q19.5,4.5,19,4.7 v-0.4 Q19.5,4.5,19.7,4 z"><title>road</title></path>
					<path d="M21,4.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q21.5,4.5,22,4.3 v0.4 Q21.5,4.5,21,4.3 z"><title>road</title></path>
					<path d="M17,5.3 v0.4 Q16.5,5.5,16.3,6 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q16.5,5.5,17,5.3 z"><title>road</title></path>
					<path d="M17.7,5 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q17.5,5.5,17,5.7 v-0.4 Q17.5,5.5,17.7,5 z"><title>road</title></path>
					<path d="M4,6.3 v0.4 Q3.5,6.5,3.3,7 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q3.5,6.5,4,6.3 z"><title>road</title></path>
					<path d="M5,6.3 v0.4 Q4.5,6.5,4,6.7 v-0.4 Q4.5,6.5,5,6.3 z"><title>road</title></path>
					<path d="M6,6.3 v0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q5.5,6.5,5,6.7 v-0.4 Q5.5,6.5,6,6.3 z"><title>road</title></path>
					<path d="M7,6.3 v0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 h-0.4 h-0.3 v-0.3 v-0.4 Q6.5,6.5,7,6.3 z"><title>road</title></path>
					<path d="M8,6.3 v0.4 v0.3 h-0.3 h-0.4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 v-0.4 Q7.5,6.5,8,6.3 z"><title>road</title></path>
					<path d="M9,6.3 v0.4 Q8.5,6.5,8.3,7 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 v-0.4 Q8.5,6.5,9,6.3 z"><title>road</title></path>
					<path d="M10,6.7 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q9.5,6.5,9,6.7 v-0.4 Q9.5,6.5,10,6.7 z"><title>road</title></path>
					<path d="M15.7,6 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q15.5,6.5,15.3,7 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q15.5,6.5,15.7,6 z"><title>road</title></path>
					<path d="M1,7.3 v0.4 Q0.5,7.5,0,7.7 v-0.4 Q0.5,7.5,1,7.3 z"><title>road</title></path>
					<path d="M2,7.3 v0.4 Q1.5,7.5,1,7.7 v-0.4 Q1.5,7.5,2,7.3 z"><title>road</title></path>
					<path d="M2.7,7 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q2.5,7.5,2,7.7 v-0.4 Q2.5,7.5,2.7,7 z"><title>road</title></path>
					<path d="M6,7.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 h0.4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 v0.4 Q6.5,7.5,6,7.3 z"><title>road</title></path>
					<path d="M7,7.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 h0.4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q7.5,7.5,7,7.7 v-0.4 z"><title>road</title></path>
					<path d="M10,7.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q10.5,7.5,11,7.3 v0.4 Q10.5,7.5,10,7.3 z"><title>road</title></path>
					<path d="M12,7.3 v0.4 Q11.5,7.5,11,7.7 v-0.4 Q11.5,7.5,12,7.3 z"><title>road</title></path>
					<path d="M13,7.7 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q12.5,7.5,12,7.7 v-0.4 Q12.5,7.5,13,7.7 z"><title>road</title></path>
					<path d="M14.7,7 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q14.5,7.5,14.3,8 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q14.5,7.5,14.7,7 z"><title>road</title></path>
					<path d="M13,8.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 q0.2,0.2,0.4,0 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q13.5,8.5,13.7,9 h-0.4 Q13.5,8.5,13,8.3 z"><title>road</title></path>
					<path d="M21.7,0 h-0.4 Q21.5,-0.5,21.7,0 z"><title>road</title></path>
					<path d="M0,7.3 v0.4 Q-0.5,7.5,0,7.3 z"><title>road</title></path>
					<path d="M13.3,9 h0.4 Q13.5,9.5,13.3,9 z"><title>road</title></path>
				</g>
				<g class="road-journey">
					<path d="M40,3.3 v0.4 v0.3 h-0.3 h-0.4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q39.5,3.5,40,3.3 z"><title>road</title></path>
					<path d="M41,3.3 v0.4 Q40.5,3.5,40.3,4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 v-0.4 Q40.5,3.5,41,3.3 z"><title>road</title></path>
					<path d="M24,4.3 v0.4 Q23.5,4.5,23,4.7 v-0.4 Q23.5,4.5,24,4.3 z"><title>road</title></path>
					<path d="M25,4.3 v0.4 Q24.5,4.5,24,4.7 v-0.4 Q24.5,4.5,25,4.3 z"><title>road</title></path>
					<path d="M26,4.7 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q25.5,4.5,25,4.7 v-0.4 Q25.5,4.5,26,4.7 z"><title>road</title></path>
					<path d="M37,4.3 v0.4 Q36.5,4.5,36.3,5 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q36.5,4.5,37,4.3 z"><title>road</title></path>
					<path d="M38,4.3 v0.4 Q37.5,4.5,37,4.7 v-0.4 Q37.5,4.5,38,4.3 z"><title>road</title></path>
					<path d="M38.7,4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 v0.4 Q38.5,4.5,38,4.7 v-0.4 Q38.5,4.5,38.7,4 z"><title>road</title></path>
					<path d="M39.3,4 h0.4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q39.5,4.5,39,4.7 v-0.4 v-0.3 h0.3 z"><title>road</title></path>
					<path d="M26,5.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q26.5,5.5,27,5.3 v0.4 Q26.5,5.5,26,5.3 z"><title>road</title></path>
					<path d="M28,5.3 v0.4 Q27.5,5.5,27,5.7 v-0.4 Q27.5,5.5,28,5.3 z"><title>road</title></path>
					<path d="M29,5.7 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q28.5,5.5,28,5.7 v-0.4 Q28.5,5.5,29,5.7 z"><title>road</title></path>
					<path d="M33,5.3 v0.4 Q32.5,5.5,32.3,6 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q32.5,5.5,33,5.3 z"><title>road</title></path>
					<path d="M34,5.3 v0.4 Q33.5,5.5,33,5.7 v-0.4 Q33.5,5.5,34,5.3 z"><title>road</title></path>
					<path d="M35,5.3 v0.4 Q34.5,5.5,34,5.7 v-0.4 Q34.5,5.5,35,5.3 z"><title>road</title></path>
					<path d="M35.7,5 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q35.5,5.5,35,5.7 v-0.4 Q35.5,5.5,35.7,5 z"><title>road</title></path>
					<path d="M29,6.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q29.5,6.5,30,6.3 v0.4 Q29.5,6.5,29,6.3 z"><title>road</title></path>
					<path d="M31,6.3 v0.4 Q30.5,6.5,30,6.7 v-0.4 Q30.5,6.5,31,6.3 z"><title>road</title></path>
					<path d="M31.7,6 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q31.5,6.5,31,6.7 v-0.4 Q31.5,6.5,31.7,6 z"><title>road</title></path>
					<path d="M41,3.7 v-0.4 Q41.5,3.5,41,3.7 z"><title>road</title></path>
				</g>
				<g class="river-journey">
					<path d="M23.3,0 h0.4 Q23.5,0.5,23.3,0 h0.4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 v0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 h-0.4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q23.5,0.5,23.3,0 z"><title>river</title></path>
					<path d="M24,0.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 h0.4 Q24.5,0.5,24.3,0 h0.4 Q24.5,0.5,24.7,1 h-0.4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 v-0.4 z"><title>river</title></path>
					<path d="M22.7,1 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 v0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q22.5,1.5,22.7,1 z"><title>river</title></path>
					<path d="M23.3,1 h0.4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 q-0.2,0.2,0,0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 h-0.4 h-0.3 v-0.3 v-0.4 v-0.3 h0.3 z"><title>river</title></path>
					<path d="M23,2.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 h0.4 h0.3 v0.3 v0.4 v0.3 h-0.3 h-0.4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 q0.2,-0.2,0,-0.4 z"><title>river</title></path>
					<path d="M24,2.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q24.5,2.5,24.3,3 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 v-0.4 z"><title>river</title></path>
					<path d="M22.7,3 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 v0.4 v0.3 h-0.3 h-0.4 Q22.5,3.5,22.7,3 z"><title>river</title></path>
					<path d="M23.3,3 h0.4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q23.5,3.5,23.3,4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 v-0.4 v-0.3 h0.3 z"><title>river</title></path>
					<path d="M22.3,4 h0.4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 q-0.2,0.2,0,0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 q-0.2,-0.2,-0.4,0 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q22.5,4.5,22.3,4 z"><title>river</title></path>
					<path d="M21,5.3 v0.4 Q20.5,5.5,20.3,6 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q20.5,5.5,21,5.3 z"><title>river</title></path>
					<path d="M21.7,5 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q21.5,5.5,21,5.7 v-0.4 Q21.5,5.5,21.7,5 z"><title>river</title></path>
					<path d="M23,5.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q23.5,5.5,24,5.3 v0.4 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q23.5,5.5,23,5.3 z"><title>river</title></path>
					<path d="M25,5.7 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 h-0.4 h-0.3 v-0.3 v-0.4 Q24.5,5.5,25,5.7 z"><title>river</title></path>
					<path d="M19,6.3 v0.4 Q18.5,6.5,18.3,7 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q18.5,6.5,19,6.3 z"><title>river</title></path>
					<path d="M19.7,6 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q19.5,6.5,19,6.7 v-0.4 Q19.5,6.5,19.7,6 z"><title>river</title></path>
					<path d="M24,6.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 h0.4 h0.3 v0.3 v0.4 Q24.5,6.5,24,6.3 z"><title>river</title></path>
					<path d="M25,6.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q25.5,6.5,26,6.7 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q25.5,6.5,25,6.7 v-0.4 z"><title>river</title></path>
					<path d="M17,7.3 v0.4 v0.3 h-0.3 h-0.4 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 Q16.5,7.5,17,7.3 z"><title>river</title></path>
					<path d="M17.7,7 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q17.5,7.5,17.3,8 l-0.17,0.13 l-0.26,-0.26 l0.13,-0.17 v-0.4 Q17.5,7.5,17.7,7 z"><title>river</title></path>
					<path d="M26,7.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q26.5,7.5,27,7.3 v0.4 Q26.5,7.5,26,7.3 z"><title>river</title></path>
					<path d="M28,7.7 l0.13,0.17 l-0.26,0.26 l-0.17,-0.13 Q27.5,7.5,27,7.7 v-0.4 Q27.5,7.5,28,7.7 z"><title>river</title></path>
					<path d="M15.7,8 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 v0.4 v0.3 h-0.3 h-0.4 Q15.5,8.5,15.7,8 z"><title>river</title></path>
					<path d="M16.3,8 h0.4 l0.17,-0.13 l0.26,0.26 l-0.13,0.17 Q16.5,8.5,16.7,9 h-0.4 h-0.3 v-0.3 v-0.4 v-0.3 h0.3 z"><title>river</title></path>
					<path d="M28,8.3 l-0.13,-0.17 l0.26,-0.26 l0.17,0.13 Q28.5,8.5,29,8.3 v0.4 v0.3 h-0.3 h-0.4 Q28.5,8.5,28,8.3 z"><title>river</title></path>
					<path d="M29.7,9 h-0.4 h-0.3 v-0.3 v-0.4 Q29.5,8.5,29.7,9 z"><title>river</title></path>
					<path d="M23.7,0 h-0.4 Q23.5,-0.5,23.7,0 z"><title>river</title></path>
					<path d="M24.7,0 h-0.4 Q24.5,-0.5,24.7,0 z"><title>river</title></path>
					<path d="M15.3,9 h0.4 Q15.5,9.5,15.3,9 z"><title>river</title></path>
					<path d="M16.3,9 h0.4 Q16.5,9.5,16.3,9 z"><title>river</title></path>
					<path d="M28.3,9 h0.4 Q28.5,9.5,28.3,9 z"><title>river</title></path>
					<path d="M29.3,9 h0.4 Q29.5,9.5,29.3,9 z"><title>river</title></path>
				</g>
				<g class="shallows-journey">
					<path d="M23,4.3 v0.4 Q22.5,4.5,22,4.7 v-0.4 Q22.5,4.5,23,4.3 z"><title>shallows</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-round" d="M30.5,-1 Q31,-1,31,2 Q31,5,30,5 Q29,5,29,4.5 Q29,4,27.5,4 Q26,4,26,3.5 Q26,3,27,3 Q28,3,28,2.5 Q28,2,28.5,2 Q29,2,29,1.5 Q29,1,29.5,1 Q30,1,30,0 Q30,-1,30.5,-1 Q31,-1,30.5,-1 Q30,0,30.5,-1 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
					<path class="tall-grass-round" d="M30,7 Q31,7,31,7.5 Q31,8,30,8 Q29,8,29,7.5 Q29,7,29.5,7 Q30,7,29.5,7 Q29,7,30,7 z"><title>tall grass</title></path>
				</g>
				<g class="tall-grass-group">
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
				<g class="poi-generic-group">
					<title>Campfire</title>
					<use class="poi-generic" href="#--poi" x="11.5" y="8.5"></use>
					<text class="poi" dominant-baseline="middle" fill="#000000" font-size="1px" text-anchor="middle" x="11.475" y="8.55">c</text>
				</g>
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
