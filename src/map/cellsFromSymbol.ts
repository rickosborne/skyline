import {cellsFromEnv} from "./cellsFromEnv";
import {cellsFromPoi} from "./cellsFromPoi";
import {CellGenerationContext, ScreenMapCell} from "./MapTypes";

export function cellsFromSymbol(
  symbol: string,
  x: number,
  y: number,
  context: CellGenerationContext,
): ScreenMapCell[] {
  const results: ScreenMapCell[] = [];
  const poiItem = context.poiBySymbol[symbol];
  if (context.tileSet.isAmbient(symbol)) {
    return results;
  }
  if (poiItem != null) {
    results.push(...cellsFromPoi(poiItem, symbol, x, y, context));
  }
  const envItem = context.envBySymbol[symbol];
  if (envItem != null) {
    results.push(cellsFromEnv(envItem, symbol, x, y, poiItem, context));
  }
  return results;
}
