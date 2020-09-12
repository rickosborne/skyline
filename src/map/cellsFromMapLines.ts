import {Type} from "../engine/type/Type";
import {cellsFromSymbol} from "./cellsFromSymbol";
import {CellGenerationContext, ScreenMapCell} from "./MapTypes";

export function cellsFromMapLines(
	mapLines: string[],
	context: CellGenerationContext,
): ScreenMapCell[] {
	return mapLines.flatMap((line, y) => line.split("").flatMap((symbol, x): undefined | ScreenMapCell | ScreenMapCell[] => {
		return cellsFromSymbol(symbol, x, y, context);
	})).filter(Type.isNotNull) as ScreenMapCell[]
}
