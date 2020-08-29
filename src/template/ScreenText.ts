export interface BlockLayoutParams {
	header: string;
	keyValueDelimiter?: string;
}

export type BlockLayoutItemBuilder<T> = (item: BlockLayoutItem) => T;

export interface BlockLayoutParamsAndBuilder<T> extends BlockLayoutParams {
	itemBuilder?: BlockLayoutItemBuilder<T>;
}

export interface BlockLayoutBounds {
	bottom: number;
	left: number;
	right: number;
	top: number;
}

export interface BlockLayoutItem {
	key: string;
	params?: Record<string, string>;
	value: string;
}

export interface BlockLayoutItems<T = BlockLayoutItem> {
	bounds: BlockLayoutBounds;
	items: T[];
}

const BLOCK_LAYOUT_KV_DELIMITER_DEFAULT = " ";
const BLOCK_LAYOUT_ITEM_BUILDER_DEFAULT: BlockLayoutItemBuilder<BlockLayoutItem> = item => item;

export class ScreenText {

	protected constructor(
		private readonly lines: string[]
	) {
	}

	public static from(text: string): ScreenText {
		const block = this.trimAndUnindent(text);
		const lines = block.split("\n");
		return new ScreenText(lines);
	}

	public static trimAndUnindent(text: string): string {
		let trimmed = text.replace(/^([ \t]*\n)+/s, "")
			.replace(/(\n[ \t]*)+$/s, "");
		let match: RegExpMatchArray | null;
		if ((match = trimmed.match(/^\s*/))) {
			trimmed = trimmed.replace(new RegExp(`(?:^|\n)${match[0]}`, "g"), "\n").trimStart();
		}
		return trimmed;
	}

	public getBlock(params: BlockLayoutParams, bounds: BlockLayoutBounds): string[] {
		const items: string[] = [];
		const width = bounds.right - bounds.left + 1;
		for (let i = bounds.top + 1; i <= bounds.bottom; i++) {
			items.push(this.lines[i].substr(bounds.left, width).trim());
		}
		return items;
	}

	public getBlockBounds(params: BlockLayoutParams): BlockLayoutBounds | undefined {
		let match: RegExpMatchArray | null;
		const headerLine = this.lines
			.map((line, index) => {
				if ((match = line.match(new RegExp(`\\b${params.header}:?\\b`)))) {
					const left = line.indexOf(match[0]);
					return {
						top: index,
						left,
						right: left + match[0].length,
					};
				}
				return undefined;
			})
			.find(index => index != null);
		if (headerLine == null || headerLine.top >= this.lines.length - 1 || headerLine.left == null) {
			return undefined;
		}
		const left = headerLine.left;
		const top = headerLine.top;
		const indented = ["", " ", "\t"].includes(this.lines[top + 1].substr(left, 1));
		let indent: number | undefined;
		let right: number = headerLine.right;
		let bottom: number = this.lines.length - 1;
		for (let i = top + 1; i <= bottom; i++) {
			const line = this.lines[i];
			const firstCharIsSpace = !!line.substr(left, 1).match(/^\s*$/);
			if (indented !== firstCharIsSpace) {
				bottom = i - 1;
				break;
			}
			if (indented && (indent === undefined) && (match = line.substr(left).match(/^\s*/))) {
				indent = match[0].length;
			}
			if (line.substr(left + (indent || 0)).match(/^(\s|$)/)) {
				bottom = i - 1;
				break;
			}
			const tripSpace = line.indexOf("   ");
			const lineRight = tripSpace < 0 ? line.length : tripSpace;
			if (lineRight > right) {
				right = lineRight;
			}
		}
		return {left, top, right, bottom};
	}

	public getBlockItems<T = BlockLayoutItem>(params: BlockLayoutParamsAndBuilder<T>): BlockLayoutItems<T> | undefined {
		const bounds = this.getBlockBounds(params);
		if (bounds == null) {
			return undefined;
		}
		const block = this.getBlock(params, bounds);
		const builder = params.itemBuilder || BLOCK_LAYOUT_ITEM_BUILDER_DEFAULT;
		const delimiter = params.keyValueDelimiter || BLOCK_LAYOUT_KV_DELIMITER_DEFAULT;
		let match: RegExpMatchArray | null;
		const toItem = function toItem(key: string, value: string): BlockLayoutItem {
			let params: Record<string, string>;
			const result: BlockLayoutItem = {key, value};
			if ((match = value.match(/^(.+?) {2}\((.+?)\)/))) {
				const paramList = match[2].trim();
				result.value = match[1].trim();
				params = {};
				paramList.split(";").forEach(paramPair => {
					const colon = paramPair.indexOf(':');
					let paramKey: string;
					let paramValue: string;
					if (colon > 0) {
						paramKey = paramPair.substr(0, colon).trim();
						paramValue = paramPair.substr(colon + 1).trim();
					} else {
						paramKey = paramPair.trim();
						paramValue = paramKey;
					}
					params[paramKey] = paramValue;
				});
				result.params = params;
			}
			return result;
		};
		const splitString = function splitString(line: string): BlockLayoutItem | undefined {
			const left = line.indexOf(delimiter);
			let key: string;
			let value: string;
			if (left < 0) {
				return undefined;
			} else if (left === 0) {
				key = "";
			} else {
				key = line.substr(0, left).trim();
			}
			value = line.substr(left + delimiter.length).trim();
			return toItem(key, value);
		};
		const items = block.map(line => {
			const item = splitString(line);
			return item == undefined ? undefined : builder(item);
		}).filter(i => i != null) as T[];
		return {
			bounds,
			items,
		};
	}

	public trimmed(): string[] {
		const trimmed = this.lines.map(l => l.trimEnd());
		while (trimmed[0] === "") {
			trimmed.shift();
		}
		while (trimmed[trimmed.length - 1] === "") {
			trimmed.pop();
		}
		return trimmed;
	}

	public withBlank(bounds?: BlockLayoutBounds): ScreenText {
		if (bounds == null) {
			return this;
		}
		const width = bounds.right - bounds.left;
		return new ScreenText(
			this.lines.map((line, lineNumber) => {
				if (lineNumber < bounds.top || lineNumber > bounds.bottom) {
					return line;
				}
				const leftPart = line.substr(0, bounds.left);
				const rightPart = line.substr(bounds.right + 1);
				const middle = " ".repeat(width);
				return `${leftPart}${middle}${rightPart}`;
			}),
		);
	}
}
