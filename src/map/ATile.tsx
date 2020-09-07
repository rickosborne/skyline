import {h} from "preact";
import {Tile, TileLayer} from "../template/TileSet";

export abstract class ATile implements Partial<Tile> {
	abstract get color(): string;

	abstract get layer(): TileLayer;

	abstract get name(): string;
}
