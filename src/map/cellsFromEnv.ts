import {TileLayer} from "../template/TileSet";
import {idForCellAt} from "./idForCellAt";
import {
  CellGenerationContext,
  ScreenMapCell,
  ScreenMapEnvironmentItem,
  ScreenMapPointOfInterest,
  ScreenMapRenderableType
} from "./MapTypes";

export function cellsFromEnv(
  envItem: ScreenMapEnvironmentItem,
  symbol: string,
  x: number,
  y: number,
  poiItem: ScreenMapPointOfInterest | undefined,
  context: CellGenerationContext,
  layer?: TileLayer,
): ScreenMapCell {
  const tile = context.tilesByName[envItem.type];
  if (tile == null) {
    throw new Error(`No tile named "${envItem.type}" for Environment symbol "${symbol}" in tile set "${context.tileSet.name}" at (${x}, ${y}).`);
  }
  const result: ScreenMapCell = {
  	id: idForCellAt(x, y),
    coordinate: {x, y},
    layer: layer || tile.layer || TileLayer.Background,
    envItem,
    tile,
    symbol,
    renderableType: ScreenMapRenderableType.Cell,
  };
  if (poiItem != null) {
    result.poi = poiItem;
  }
  return result;
}
