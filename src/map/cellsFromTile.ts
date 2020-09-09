import {Tile, TileLayer} from "../template/TileSet";
import {ScreenMapCell, ScreenMapRenderableType} from "./MapTypes";

export function cellsFromTile(
  tile: Tile,
  symbol: string,
  x: number,
  y: number,
  layer: TileLayer = TileLayer.Background
): ScreenMapCell {
  return {
    coordinate: {x, y},
    layer,
    tile,
    symbol,
    renderableType: ScreenMapRenderableType.Cell,
  };
}
