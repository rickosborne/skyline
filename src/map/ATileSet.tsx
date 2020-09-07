import {h} from "preact";
import {Tile, TileSet} from "../template/TileSet";

export abstract class ATileSet implements Partial<TileSet> {
	abstract get backgroundColor(): number;

	abstract get name(): string;

	abstract get poiBackgroundColor(): string;

	abstract get poiBorderColor(): string;

	abstract get poiColor(): string;

	abstract get poiFont(): string;

	abstract get tiles(): Tile[];

}
