import {expect} from "chai";
import "mocha";
import {ScreenMapEnvironmentItem, ScreenMapMetadata, ScreenMapPointOfInterest} from "../../src/map/MapTypes";
import {
	ScreenMap
} from "../../src/template/ScreenMap";

const INDOOR = `

    Map
      Title: Mother's Watch Ruins, Level I
      Theme: Old Ones Indoor Delve
      Scale: 5ft per point
                                                       Environment:
              +------------+                           . office floor
             /:::w.......>..\\                          D office door
            |::1.........+...|                         + office wall
    +-------+w...........]...+-----+-----+----------+  - office wall
    |....................]...D.....D.....D.........c|  / office wall
    |....................]...+-----+^^+--+..........|  \\ office wall
    +-------+............]...|     |^^|22|..........|  | office wall
            |............+...|     |.....+----------+  ] railing
             \\...........>../      +-----+             ^ stairs  (rotate: 270)
              +------------+                           c crate
                                                       : rocks
                                                       w puddle
                                                       > stairs
    Points of Interest:
    1. Entrance  (tile: office floor)
    2. Stairs to Level II  (tile: stairs; link: Mother's Watch Ruins, Level II)

`;

describe("ScreenMap", () => {
	const outdoor = ScreenMap.from(INDOOR);

	if (outdoor == null) {
		throw new Error("Parsed map is null");
	}

	it("parses the metadata", () => {
		expect(outdoor.metadata).deep.equals(<ScreenMapMetadata>{
			title: "Mother's Watch Ruins, Level I",
			theme: "Old Ones Indoor Delve",
			scaleValue: 5,
			scaleUnit: "ft",
		});
	});

	it("parses the environment", () => {
		expect(outdoor.environment).deep.equals(<ScreenMapEnvironmentItem[]>[
			{symbol: ".", type: "office floor"},
			{symbol: "D", type: "office door"},
			{symbol: "+", type: "office wall"},
			{symbol: "-", type: "office wall"},
			{symbol: "/", type: "office wall"},
			{symbol: "\\", type: "office wall"},
			{symbol: "|", type: "office wall"},
			{symbol: "]", type: "railing"},
			{symbol: "^", type: "stairs", rotate: 270},
			{symbol: "c", type: "crate"},
			{symbol: ":", type: "rocks"},
			{symbol: "w", type: "puddle"},
			{"symbol": ">", "type": "stairs"}
		]);
	});

	it("parses the poi", () => {
		expect(outdoor.points).deep.equals(<ScreenMapPointOfInterest[]>[
			{id: "1", title: "Entrance", tile: "office floor", "coordinates": [{"x": 11, "y": 2}]},
			{
				id: "2", title: "Stairs to Level II", tile: "stairs", link: "Mother's Watch Ruins, Level II", "coordinates": [
					{"x": 35, "y": 6},
					{"x": 36, "y": 6},
				]
			}
		]);
	});

	it("extracts the map", () => {
		expect(outdoor.mapLines).deep.equals([
			"          +------------+",
			"         /:::w.......>..\\",
			"        |::1.........+...|",
			"+-------+w...........]...+-----+-----+----------+",
			"|....................]...D.....D.....D.........c|",
			"|....................]...+-----+^^+--+..........|",
			"+-------+............]...|     |^^|22|..........|",
			"        |............+...|     |.....+----------+",
			"         \\...........>../      +-----+",
			"          +------------+"
		]);
	});
});
