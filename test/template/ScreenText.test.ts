import {expect} from "chai";
import "mocha";
import {BlockLayoutItems, ScreenText} from "../../src/template/ScreenText";

const OUTDOOR = `

    Map
      Title: All-Mother's Embrace
      Theme: Nora Lands
      Scale: 0.25mi per point
    ;;;;;;;;;;;;;;;;;;;;.r.ww........fffff...   Environment:
    ;;;;;;;;;;;;;;;;;;;.r.ww.....::.fffffff..   ; mountain
    .;;;;;;;;;;;;;;;;....r.ww...:::..ffff....   w river
    ...;;;;;;;;;;;;.....r.ww..:::::........rr   . plain
    ....;;;;;;;;222...rrrssrrr.::::.....rrrr.   : tall grass
    .....;;;;..222..rr..ww.ww.rrr...rrrr.3...   f trees
    ...rrr11rr.....r..ww....ww...rrrbbb333fff   r road
    rrr...11..rrrrr.ww........ww.::..bb33ffff   s shallows
    .....;;;...c4r.ww...........ww....bb..fff   b boulders
                                                c campfire
    Points of Interest:
    1. Main Embrace Gate  (tile: wood; rotate: 90)
    2. Strider site  (tile: plain; overlay: machine site; icon: strider)
    3. Grazer site  (tile: plain; overlay: machine site; icon: grazer)
    4. Hunting Goods  (icon: merchant)

`;

describe("ScreenText", () => {
	const outdoor = ScreenText.from(OUTDOOR);

	it("finds the map block", () => {
		expect(outdoor.getBlockItems({header: "Map", keyValueDelimiter: ":"})).deep.equals(<BlockLayoutItems>{
			bounds: {top: 0, right: 29, bottom: 3, left: 0},
			items: [
				{key: "Title", value: "All-Mother's Embrace",},
				{key: "Theme", value: "Nora Lands",},
				{key: "Scale", value: "0.25mi per point",},
			],
		});
	});

	it("finds the environment block", () => {
		expect(outdoor.getBlockItems({header: "Environment", keyValueDelimiter: " "})).deep.equals(<BlockLayoutItems>{
			bounds: {top: 4, right: 55, bottom: 13, left: 44},
			items: [
				{key: ";", value: "mountain",},
				{key: "w", value: "river",},
				{key: ".", value: "plain",},
				{key: ":", value: "tall grass",},
				{key: "f", value: "trees",},
				{key: "r", value: "road",},
				{key: "s", value: "shallows",},
				{key: "b", value: "boulders",},
				{key: "c", value: "campfire",},
			],
		});
	});

	it("finds the POI block", () => {
		expect(outdoor.getBlockItems({
			header: "Points of Interest",
			keyValueDelimiter: "."
		})).deep.equals(<BlockLayoutItems>{
			bounds: {top: 14, right: 68, bottom: 18, left: 0},
			items: [
				{"key": "1", "value": "Main Embrace Gate", "params": {"rotate": "90", "tile": "wood"}},
				{
					"key": "2",
					"value": "Strider site",
					"params": {"icon": "strider", "overlay": "machine site", "tile": "plain",}
				},
				{"key": "3", "value": "Grazer site", "params": {"icon": "grazer", "overlay": "machine site", "tile": "plain",}},
				{"key": "4", "value": "Hunting Goods", "params": {"icon": "merchant"}}
			],
		});
	});
});
