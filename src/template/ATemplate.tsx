import {h} from "preact";
import {RandomQuantity} from "../schema/machine";
import {html} from "./hypertext";
import {ifLines} from "./util";

export abstract class ATemplate<T> {
	abstract canRender(dataType: string, templateId: string, params: Record<string, string>): boolean;

	abstract convert(data: any, params: Record<string, string>): T;

	abstract getData(dataType: string, dataName: string, params: Record<string, string>): object | undefined;

	abstract render(data: T, params: Record<string, string>): string;

	public renderDetailedItem(title: string, details: string | string[] | undefined | null): string {
		return html(
			<div class="detailed" data-if-children>
				<dt data-if-siblings>{title}</dt>
				<dd data-markdown="1" data-if-children>{ifLines(details)}</dd>
			</div>
		);
	}

	public renderDetailedList<T>(data: T, entries: { [key: string]: (target: T) => string | string[] | undefined | null }): string {
		return ifLines(Object.entries(entries)
			.map(([title, accessor]) => this.renderDetailedItem(title, accessor(data))));
	}

	public renderQuantity(qty: number | RandomQuantity | undefined, suffix: string = ''): string {
		if (qty == null) {
			return '';
		} else if (typeof qty === 'number') {
			return String(qty) + suffix;
		} else {
			return `${qty.min}&#8209;${qty.max}${suffix}`;
		}
	}
}
