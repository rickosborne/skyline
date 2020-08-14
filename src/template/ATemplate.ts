export abstract class ATemplate<T> {
	abstract canRender(dataType: string, templateId: string): boolean;

	abstract convert(data: any): T;

	abstract render(data: T): string;
}
