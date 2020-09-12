import {Tile, TileLayer} from "../template/TileSet";
import {cellsFromEnv} from "./cellsFromEnv";
import {cellsFromSymbol} from "./cellsFromSymbol";
import {cellsFromTile} from "./cellsFromTile";
import {idForCellAt} from "./idForCellAt";
import {
  CellGenerationContext,
  ScreenMapCell,
  ScreenMapEnvironmentItem,
  ScreenMapPointOfInterest,
  ScreenMapRenderableType
} from "./MapTypes";

export function cellsFromPoi(
  poi: ScreenMapPointOfInterest,
  symbol: string,
  x: number,
  y: number,
  context: CellGenerationContext,
): ScreenMapCell[] {
  const results: ScreenMapCell[] = [];
  let envItem: ScreenMapEnvironmentItem | undefined;
  let tile: Tile | undefined;
  if (poi.symbol != null && poi.symbol !== symbol) {
    results.push(...cellsFromSymbol(poi.symbol, x, y, context));
    envItem = context.envBySymbol[poi.symbol];
    if (envItem != null) {
      tile = context.tilesByName[envItem.type];
      results.push(cellsFromEnv(envItem, poi.symbol, x, y, poi, context, TileLayer.Background));
    }
  } else if (poi.tile != null) {
    envItem = envItem || context.environment.find(e => e.type === poi.tile);
    tile = tile || context.tilesByName[poi.tile];
    results.push(cellsFromTile(tile, symbol, x, y, TileLayer.Background));
  }
  if (poi.overlay != null) {
    const overlayTile = context.tilesByName[poi.overlay];
    if (overlayTile == null) {
      throw new Error(`No such overlay tile "${poi.overlay}" at "${poi.id}. ${poi.title}"`);
    }
    results.push(cellsFromTile(overlayTile, symbol, x, y, TileLayer.Overlay));
  }
  const result: ScreenMapCell = {
  	id: idForCellAt(x, y),
    coordinate: {x, y},
    layer: TileLayer.PointsOfInterest,
    poi,
    symbol,
    renderableType: ScreenMapRenderableType.Cell,
  }
  if (envItem != null) {
    result.envItem = envItem;
  }
  if (tile != null) {
    result.tile = tile;
  }
  if (context.tileSet.backfillCells != null) {
    results.push(...context.tileSet.backfillCells(result));
  }
  results.push(result);
  return results;
}
