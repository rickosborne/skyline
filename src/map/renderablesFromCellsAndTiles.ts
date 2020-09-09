import {BlockLayoutBounds} from "../template/ScreenText";
import {CARDINAL_OFFSETS, JOIN_CARDINALS_DEFAULT, Tile, TILE_LAYERS, TileRenderer} from "../template/TileSet";
import {edgesFromCell} from "./edgesFromCell";
import {graftEdges} from "./graftEdges";
import {ScreenMapCell, ScreenMapRenderable, ScreenMapRenderableType, ScreenMapShape} from "./MapTypes";
import {outlineEdges} from "./outlineEdges";
import {simplifyPath} from "./simplifyPath";
import {sortCells} from "./sortCells";

export function renderablesFromCellsAndTiles(
  cells: ScreenMapCell[],
  renderer: TileRenderer,
  tiles: Tile[],
	bounds: BlockLayoutBounds,
): ScreenMapRenderable[] {
  const keyForLocation: (x: number, y: number) => string = (x, y) => `${x},${y}`;
  const renderables: ScreenMapRenderable[] = [];
  // let iterations = 0;
  for (let layerId of TILE_LAYERS) {
    const layerCells = cells.filter(cell => cell.layer === layerId);
    const layerCellsByKey = layerCells.reduce((cells, cell) => {
      const key = keyForLocation(cell.coordinate.x, cell.coordinate.y);
      const existing = cells.get(key);
      if (existing != null) {
        throw new Error(`Multiple cells at ${key} on layer ${layerId}: ${JSON.stringify([existing, cell])}`);
      }
      cells.set(key, cell);
      return cells;
    }, new Map<string, ScreenMapCell>());
    for (let tile of tiles) {
      const svgFromShapeFactory = tile.svgFromShape;
      if (svgFromShapeFactory == null) {
        continue;
      }
      const svgFromShape = svgFromShapeFactory(layerId);
      const tileCells = layerCells.filter(cell => cell.tile === tile);
      if (tileCells.length === 0) {
        continue;
      }
      // https://en.wikipedia.org/wiki/Flood_fill
      const offsets = (tile.joinCardinals || JOIN_CARDINALS_DEFAULT).map(cardinal => CARDINAL_OFFSETS[cardinal]);
      const aggregate: (cell: ScreenMapCell, shape: ScreenMapShape) => ScreenMapShape = (cell, shape): ScreenMapShape => {
        if (cell.tile !== tile || cell.shape === shape) {
          // iterations++;
          return shape;
        }
        if (cell.shape != null) {
          shape.cells.push(...cell.shape.cells);
          cell.shape.cells.forEach(cell => cell.shape = shape);
          cell.shape.cells.splice(0, cell.shape.cells.length);
          throw new Error(`Don't know how to graft two shapes!`);
        }
        cell.shape = shape;
        shape.cells.push(cell);
        const todo: ScreenMapCell[] = [cell];
        let focus: ScreenMapCell | undefined;
        const processedKeys = new Set<string>();
        processedKeys.add(keyForLocation(cell.coordinate.x, cell.coordinate.y));
        while ((focus = todo.shift())) {
          for (let offset of offsets) {
            // iterations++;
            const key = keyForLocation(focus.coordinate.x + offset.dx, focus.coordinate.y + offset.dy);
            if (processedKeys.has(key)) {
              continue;
            }
            processedKeys.add(key);
            const adjacent = layerCellsByKey.get(key);
            if (adjacent != null && adjacent.tile === tile && adjacent.shape == null) {
              adjacent.shape = shape;
              shape.cells.push(adjacent);
              graftEdges(shape.edges, edgesFromCell(adjacent));
              todo.push(adjacent);
            }
          }
        }
        try {
          shape.outline = outlineEdges(shape.edges).map(path => simplifyPath(path));
        } catch (e) {
          console.error(`While building ${shape.tile.name}`);
          throw e;
        }
        return shape;
      };
      const shapes = Array.from(new Set<ScreenMapShape>(tileCells.map(cell => {
        if (cell.shape != null) {
          return cell.shape;
        }
        const shape: ScreenMapShape = {
          cells: [],
          edges: edgesFromCell(cell),
          outline: [],
          renderableType: ScreenMapRenderableType.Shape,
          tile,
          layer: layerId,
          toSvgElement: (renderer) => svgFromShape(shape, renderer, bounds),
        };
        return aggregate(cell, shape);
      }).filter(shape => shape.cells.length > 0)).keys()).map(shape => {
        shape.cells.sort(sortCells);
        return shape;
      });
      renderables.push(...shapes);
    }
  }
  renderables.push(...cells.filter(cell => cell.shape == null).sort(sortCells));
  // console.log(`renderablesFromCellsAndTiles ${iterations} iterations for ${cells.length} cells`)
  return renderables;
}
