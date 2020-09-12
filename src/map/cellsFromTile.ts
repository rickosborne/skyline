import {Tile, TileLayer} from "../template/TileSet";
import {idForCellAt} from "./idForCellAt";
import {ScreenMapCell, ScreenMapRenderableType} from "./MapTypes";

export function cellsFromTile(
  tile: Tile,
  symbol: string,
  x: number,
  y: number,
  layer: TileLayer = TileLayer.Background
): ScreenMapCell {
  return {
  	id: idForCellAt(x, y),
    coordinate: {x, y},
    layer,
    tile,
    symbol,
    renderableType: ScreenMapRenderableType.Cell,
  };
}
