import {h} from "preact";
import {Tile, TileRenderer, TileSet} from "../template/TileSet";
import {ScreenMapCell, ScreenMapRenderable} from "./MapTypes";
import {renderablesFromCellsAndTiles} from "./mapUtil";

export abstract class ATileSet implements Partial<TileSet> {

	abstract get name(): string;

	abstract get poiBackgroundColor(): string;

	abstract get poiBorderColor(): string;

	abstract get poiColor(): string;

	abstract get poiFont(): string;

	abstract get tiles(): Tile[];

	public renderablesFromCells(cells: ScreenMapCell[], renderer: TileRenderer): ScreenMapRenderable[] {
		return renderablesFromCellsAndTiles(cells, renderer, this.tiles);
	}

}
