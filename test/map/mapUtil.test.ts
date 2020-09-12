import {expect} from "chai";
import "mocha";
import {cellsFromMapLines} from "../../src/map/cellsFromMapLines";
import {
	CellGenerationContext,
	Coordinate,
	isCell,
	isShape,
	ScreenMapEnvironmentItem,
	ScreenMapRenderableType
} from "../../src/map/MapTypes";
import {OfficeFloor, OfficeWall, OldOnesIndoorDelve} from "../../src/map/OldOnesIndoorDelve";
import {renderablesFromCellsAndTiles} from "../../src/map/renderablesFromCellsAndTiles";
import {BlockLayoutBounds} from "../../src/template/ScreenText";
import {Tile, TileRenderer} from "../../src/template/TileSet";


const MAP_LINES = `
+++++++      +
+**+**+ ***
+*****+    ***
 +++++
`.split("\n")
	.filter(line => line != null && line.trim().length > 0);

const BOUNDS: BlockLayoutBounds = {
	top: 0,
	left: 0,
	bottom: MAP_LINES.length,
	right: Math.max(...MAP_LINES.map(l => l.length)),
};

const OFFICE_FLOOR_ENV: ScreenMapEnvironmentItem = {
	type: "office floor",
	symbol: "*",
};
const OFFICE_WALL_ENV: ScreenMapEnvironmentItem = {
	type: "office wall",
	symbol: "+"
};
const OLD_ONES_TILE_SET = new OldOnesIndoorDelve();
const OFFICE_FLOOR_TILE = OLD_ONES_TILE_SET.tiles.filter(tile => tile instanceof OfficeFloor)[0] as Tile;
const OFFICE_WALL_TILE = OLD_ONES_TILE_SET.tiles.filter(tile => tile instanceof OfficeWall)[0] as Tile;
const CONTEXT: CellGenerationContext = {
	envBySymbol: {
		"*": OFFICE_FLOOR_ENV,
		"+": OFFICE_WALL_ENV
	},
	environment: [OFFICE_FLOOR_ENV, OFFICE_WALL_ENV],
	poiBySymbol: {},
	tilesByName: {
		"office floor": OFFICE_FLOOR_TILE,
		"office wall": OFFICE_WALL_TILE,
	},
	tileSet: OLD_ONES_TILE_SET
};

describe("mapUtil", () => {
	describe("renderablesFromCellsAndTiles", () => {
		it("starts with a parsed map", () => expect(MAP_LINES).is.not.null);

		describe("cellsFromMapLines", () => {
			const cells = cellsFromMapLines(MAP_LINES, CONTEXT).sort((a, b) => {
				if (a.coordinate.y === b.coordinate.y) {
					return a.coordinate.x - b.coordinate.x;
				}
				return a.coordinate.y - b.coordinate.y;
			});
			expect(cells).is.instanceOf(Array);
			const renderables = renderablesFromCellsAndTiles(cells, undefined as unknown as TileRenderer, OLD_ONES_TILE_SET.tiles, BOUNDS);
			expect(renderables).is.instanceOf(Array);
			const coordinates = renderables.map(renderable => ({
				type: renderable.renderableType,
				tile: renderable.tile?.name,
				cells: isShape(renderable) ? renderable.cells.map(cell => cell.coordinate) : isCell(renderable) ? renderable.coordinate : undefined
			}));
			const actualMessage = JSON.stringify(coordinates, null, 2)
				.replace(/"([a-zA-Z]+)":/g, "$1:")
				.replace(/{\s*x:\s*(\d+),\s*y:\s*(\d+)\s*}/g, "{x: $1, y: $2}");
			expect(coordinates, actualMessage).deep.equals([
				{
					type: "Shape",
					tile: "office floor",
					cells: [
						{x: 1, y: 1},
						{x: 2, y: 1},
						{x: 4, y: 1},
						{x: 5, y: 1},
						{x: 1, y: 2},
						{x: 2, y: 2},
						{x: 3, y: 2},
						{x: 4, y: 2},
						{x: 5, y: 2}
					]
				}, {
					type: "Shape",
					tile: "office floor",
					cells: [
						{x: 8, y: 1},
						{x: 9, y: 1},
						{x: 10, y: 1}
					]
				}, {
					type: "Shape",
					tile: "office floor",
					cells: [
						{x: 11, y: 2},
						{x: 12, y: 2},
						{x: 13, y: 2}
					]
				}, {
					type: "Shape",
					tile: "office wall",
					cells: [
						{x: 0, y: 0},
						{x: 1, y: 0},
						{x: 2, y: 0},
						{x: 3, y: 0},
						{x: 4, y: 0},
						{x: 5, y: 0},
						{x: 6, y: 0},
						{x: 0, y: 1},
						{x: 3, y: 1},
						{x: 6, y: 1},
						{x: 0, y: 2},
						{x: 6, y: 2},
						{x: 1, y: 3},
						{x: 2, y: 3},
						{x: 3, y: 3},
						{x: 4, y: 3},
						{x: 5, y: 3}
					]
				}, {
					type: "Shape",
					tile: "office wall",
					cells: [
						{x: 13, y: 0}
					]
				}
			] as Array<{ type: ScreenMapRenderableType; cells: undefined | Coordinate | Coordinate[]; tile?: string; }>);
		});
	});
});
