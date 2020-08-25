// Skyline.js


document.addEventListener("DOMContentLoaded", function onDomContentLoaded() {
	document.querySelectorAll(".spoiler").forEach(spoilerEl => {
		const parentElement = spoilerEl.parentElement;
		if (parentElement == null) {
			return;
		}
		const isBlock = spoilerEl.classList.contains("block") || ["blockquote", "div"].includes(spoilerEl.tagName.toLowerCase());
		const warningType = isBlock ? "DETAILS" : "SPAN";
		const warningEl = document.createElement(warningType) as HTMLSpanElement;
		if (isBlock) {
			const summaryEl = document.createElement("SUMMARY") as HTMLElement;
			summaryEl.appendChild(document.createTextNode("Spoiler"));
			warningEl.appendChild(summaryEl);
			warningEl.classList.add("block");
			parentElement.insertBefore(warningEl, spoilerEl);
			parentElement.removeChild(spoilerEl);
			warningEl.appendChild(spoilerEl);
			summaryEl.classList.add("spoiler-warning");
		} else {
			const labelEl = document.createElement("LABEL") as HTMLLabelElement;
			const checkboxEl = document.createElement("INPUT") as HTMLInputElement;
			checkboxEl.type = "checkbox";
			checkboxEl.classList.add("spoiler-checkbox");
			labelEl.appendChild(checkboxEl);
			labelEl.classList.add("spoiler-label");
			labelEl.classList.add("block");
			warningEl.append(document.createTextNode(" (spoiler) "));
			parentElement.insertBefore(labelEl, spoilerEl);
			parentElement.removeChild(spoilerEl);
			labelEl.appendChild(warningEl);
			labelEl.appendChild(spoilerEl);
			warningEl.classList.add("spoiler-warning");
		}
	});

	document.querySelectorAll(".fullscreen-able").forEach(fullscreenAble => {
		fullscreenAble.addEventListener("click", () => {
			if (!document.fullscreenElement && fullscreenAble.requestFullscreen) {
				fullscreenAble.requestFullscreen().catch(err => console.warn(err));
			} else if (document.fullscreenElement && document.exitFullscreen) {
				document.exitFullscreen().catch(err => console.warn(err));
			}
		});
	});
});

const DATA_FOOTNOTE_ID = "data-footnote-id";
const DATA_PAGE_NUMBER = "data-page-number";
const DATA_SOURCE = "data-source";
const DATA_SOURCE_FILE = "data-source-file";
const DATA_PAGE_OF = "data-page-of";
const AVOID_BREAK_AFTER = "avoid-break-after";
const COL_SPAN_ALL = "col-span-all";
const DATA_GUTTER_NUM = "data-gutter-num";
const DATA_GUTTER_REF = "data-gutter-ref";
const PAGE_BREAK_BEFORE = "page-break-before";

class DocHelper {
	public documentSeemsOkay = true;
	public readonly homeLink: HTMLAnchorElement;
	public readonly moduleLink: HTMLAnchorElement;
	private nextFootnoteNumber: number = 1;

	constructor(
		private readonly document: HTMLDocument
	) {
		this.homeLink = this.document.getElementById("link-home") as HTMLAnchorElement;
		if (this.homeLink == null) {
			console.error("No home link.");
			this.documentSeemsOkay = false;
		}
		// const baseHref = homeLink.href;
		this.moduleLink = this.document.getElementById("print-module-top-link") as HTMLAnchorElement;
		if (this.moduleLink == null) {
			console.error("No module link.");
			this.documentSeemsOkay = false;
		}
	}

	div(...classNames: string[]) {
		const div = this.document.createElement("DIV") as HTMLDivElement;
		div.classList.add(...classNames);
		return div;
	}

	extractFootnotes(d: Element,): HTMLDivElement[] {
		return (Array.prototype.slice.apply(d.querySelectorAll("a[href]")) as HTMLAnchorElement[])
			.map(link => {
				let footnoteId = link.getAttribute(DATA_FOOTNOTE_ID);
				if (footnoteId != null) {
					const footnote = document.getElementById(footnoteId);
					if (footnote != null) {
						// console.debug(`Found existing footnote`, footnote);
						return footnote as HTMLDivElement;
					}
				}
				if (link.classList.contains('page-ref')) {
					return undefined;
				}
				// console.log(`Making a new footnote for`, link);
				const footnoteNumber = this.nextFootnoteNumber++;
				let href = link.href;
				const footnote = this.div("footnote");
				footnote.id = `fn${footnoteNumber}`;
				if (href.startsWith(this.homeLink.href)) {
					href = href.replace(/\.md$/, '.html');
				}
				footnote.appendChild(document.createTextNode(`${footnoteNumber}.\u00a0${href}`));
				link.setAttribute(DATA_FOOTNOTE_ID, footnote.id);
				link.querySelectorAll('.footnote-bracket').forEach((bracket: HTMLElement) => {
					bracket.innerHTML = `&nbsp;[${footnoteNumber}]`;
				});
				return footnote;
			})
			.filter(fn => fn != null) as HTMLDivElement[];
	}

	findOrCreate(query: string, created: (div: HTMLDivElement) => void): HTMLDivElement {
		return this.document.querySelector(query) || (() => {
			const d = this.div();
			created(d);
			return d;
		})();
	}

	html<E extends Element>(originalEl: E, ...configurers: ((el: E) => any)[]): E {
		return configurers.reduce((prev, configurer) => {
			const maybeNew = configurer(originalEl);
			return maybeNew == null || !(maybeNew instanceof Element) ? originalEl : (maybeNew as E);
		}, originalEl);
	}

	nearestAncestorLike(el: Element | undefined, predicate: (anc: Element) => boolean): Element | undefined {
		while (el != null) {
			if (predicate(el)) {
				return el;
			}
			el = el.parentElement ? el.parentElement : undefined;
		}
		return undefined;
	}

	pageWith(el: Element): string {
		const page = this.nearestAncestorLike(el, anc => anc.classList.contains("page"));
		if (page == null) {
			console.error(`Could not find page with el:`, el);
			return "!";
		}
		const pageNumber = page.getAttribute(DATA_PAGE_NUMBER);
		if (pageNumber == null) {
			console.error(`Page without number: `, page);
			return "???";
		}
		return pageNumber;
	}

	unwrap(wrapper: Element, eachChild: (childNode: ChildNode, index: number, count: number) => ChildNode = c => c) {
		const children: ChildNode[] = [];
		wrapper.childNodes.forEach(childNode => {
			if (Block.isElementOrNonEmptyText(childNode)) {
				children.push(childNode);
			}
		});
		children.forEach((child, index, all) => {
			wrapper.removeChild(child);
			const newChild = eachChild(child, index, all.length);
			wrapper.parentNode?.insertBefore(newChild, wrapper);
		});
		wrapper.parentNode?.removeChild(wrapper);
	}

	unwrapSourceWrapper(wrapper: Element) {
		const source = wrapper.getAttribute(DATA_SOURCE_FILE) || "";
		wrapper.firstElementChild?.setAttribute(DATA_SOURCE, source);
		this.unwrap(wrapper);
	}
}

enum AppendBlockResult {
	Appended = "Appended",
	Full = "Full",
	Skipped = "Skipped",
}

enum MoveLastToNextResult {
	Moved = "Moved",
	CannotMove = "CannotMove",
	NoLast = "NoLast",
	WouldBeEmpty = "WouldBeEmpty",
}

abstract class Block {
	public readonly identifier: string;

	protected constructor(
		identifier: string,
	) {
		this.identifier = `${this.constructor.name}:${identifier}`;
	}

	abstract get lastAppendedElement(): HTMLElement | undefined;

	abstract get outerElement(): HTMLElement;

	static collectLinkedTo(node: ChildNode): ChildNode[] {
		const linked: ChildNode[] = [node];
		const nonEl: ChildNode[] = [];
		const parent = node.parentNode;
		if (parent == null) {
			return linked;
		}
		let current = node.previousSibling;
		while (current != null) {
			if (current.nodeType === Node.ELEMENT_NODE) {
				const el = current as HTMLElement;
				if (el.classList.contains(AVOID_BREAK_AFTER) && parent.firstElementChild !== el) {
					linked.unshift(current, ...nonEl);
					nonEl.splice(0, nonEl.length);
					current = current.previousSibling;
				} else {
					current = null;
				}
			} else {
				nonEl.unshift(current);
				current = current.previousSibling;
			}
		}
		return linked;
	}

	static elementsOf(nodes: ChildNode[]): HTMLElement[] {
		return nodes.filter(n => n.nodeType === Node.ELEMENT_NODE) as HTMLElement[];
	}

	static elementsOrTextOf(nodes: ChildNode[]): ChildNode[] {
		return nodes.filter(node => this.isElementOrNonEmptyText(node));
	}

	static isAside(...nodes: ChildNode[]): boolean {
		return this.elementsOf(nodes).find(el => el.classList.contains("aside")) != null; // || el.tagName.toUpperCase() === "ASIDE") != null;
	}

	static isElementOrNonEmptyText(node: ChildNode): boolean {
		return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && (node.textContent?.trim() || "").length > 0);
	}

	static needsSpanAll(...nodes: ChildNode[]): boolean {
		return this.elementsOf(nodes).find(el => {
			return el.classList.contains(COL_SPAN_ALL);
		}) != null;
	}

	abstract appendNode(doc: DocHelper, ...nodes: ChildNode[]): AppendBlockResult;

	abstract isEmpty(): boolean;

	abstract moveFrom(doc: DocHelper, linked: ChildNode[], prevWriteBlock: Block): AppendBlockResult;

	abstract moveLastToNext(doc: DocHelper): MoveLastToNextResult;

	abstract wouldBeEmptyIfDetached(els: ChildNode[]): boolean;
}

class DivBlock extends Block {
	constructor(
		protected readonly div: HTMLDivElement,
		identifier: string,
	) {
		super(identifier);
	}

	get lastAppendedElement(): HTMLElement | undefined {
		return this.div.lastElementChild == null ? undefined : this.div.lastElementChild as HTMLElement;
	}

	get outerElement(): HTMLElement {
		return this.div;
	}

	static buildDiv(doc: DocHelper, identifier: string, ...classNames: string[]): DivBlock {
		return new DivBlock(doc.div(...classNames), identifier);
	}

	appendNode(doc: DocHelper, ...nodes: ChildNode[]): AppendBlockResult {
		nodes.forEach(node => {
			this.div.appendChild(node);
		});
		return AppendBlockResult.Appended;
	}

	isEmpty(): boolean {
		return this.div.childElementCount === 0;
	}

	moveFrom(doc: DocHelper, linked: ChildNode[], prevWriteBlock: Block): AppendBlockResult {
		// console.debug(`moveFrom ${this.identifier} (${this.div.className}) <- ${prevWriteBlock.identifier}`, linked);
		linked.forEach(node => {
			node.parentNode?.removeChild(node);
			this.div.appendChild(node);
		});
		return AppendBlockResult.Appended;
	}

	moveLastToNext(doc: DocHelper): MoveLastToNextResult {
		return MoveLastToNextResult.CannotMove;
	}

	wouldBeEmptyIfDetached(els: ChildNode[]): boolean {
		return this.div.firstElementChild != null && els.includes(this.div.firstElementChild);
	}
}

class WideBlock extends DivBlock {
	static buildWide(doc: DocHelper, identifier: string, ...classNames: string[]): WideBlock {
		const withSpan = classNames.includes(COL_SPAN_ALL) ? classNames : [COL_SPAN_ALL].concat(...classNames);
		return new WideBlock(doc.div(...withSpan), identifier);
	}

	appendNode(doc: DocHelper, ...nodes: ChildNode[]): AppendBlockResult {
		if (!Block.needsSpanAll(nodes[nodes.length - 1])) {
			return AppendBlockResult.Full;
		}
		return super.appendNode(doc, ...nodes);
	}
}

abstract class MultiTargetBlock<W extends Block> extends Block {
	protected constructor(
		protected readonly wrapper: HTMLDivElement,
		protected writeBlock: W | undefined,
		identifier: string,
	) {
		super(identifier);
	}

	get lastAppendedElement(): HTMLElement | undefined {
		return this.writeBlock == null ? undefined : this.writeBlock.lastAppendedElement;
	}

	abstract get lastWriteBlock(): W | undefined;

	get outerElement(): HTMLElement {
		return this.wrapper;
	}

	appendNode(doc: DocHelper, ...nodes: ChildNode[]): AppendBlockResult {
		let writer = this.writerForNodes(...nodes);
		if (writer == null) {
			const el = Block.elementsOf(nodes)[0];
			// console.debug(`appendNode ${this.identifier} No writer yet. Trying to build one for`, el);
			writer = this.buildBlockForEl(doc, el);
			if (writer == null) {
				console.error(`appendNode ${this.identifier} No writer to append to`, nodes);
				return AppendBlockResult.Full;
			}
		}
		// console.debug(`appendNode ${this.identifier} delegating to ${this.writeBlock.identifier}`);
		return writer.appendNode(doc, ...nodes);
	}

	abstract buildBlockForEl(doc: DocHelper, el: HTMLElement): W | undefined;

	moveFrom(doc: DocHelper, linked: ChildNode[], prevWriteBlock: Block): AppendBlockResult {
		if (this.writeBlock == null) {
			console.error(`moveFrom ${this.identifier} missing writer`);
			return AppendBlockResult.Skipped;
		}
		console.debug(`MultiTargetBlock.moveFrom`, linked);
		return this.writeBlock.moveFrom(doc, linked, prevWriteBlock);
	}

	moveLastToNext(doc: DocHelper, withMoved?: (moved: ChildNode[], fromBlock: W, toBlock: W) => void): MoveLastToNextResult {
		const last = this.lastAppendedElement;
		if (last == null) {
			// console.error(`moveLastToNext ${this.identifier} no last`);
			return MoveLastToNextResult.NoLast;
		}
		if (this.writeBlock == null) {
			// console.error(`moveLastToNext ${this.identifier} no writer`);
			return MoveLastToNextResult.CannotMove;
		}
		const prevWriteBlock = this.writeBlock;
		const prevDidMove = prevWriteBlock.moveLastToNext(doc);
		// console.debug(`moveLastToNext ${this.identifier} got ${prevDidMove} from ${prevWriteBlock.identifier}`);
		if (prevDidMove === MoveLastToNextResult.Moved || prevDidMove === MoveLastToNextResult.WouldBeEmpty) {
			return prevDidMove;
		}
		const linked = Block.collectLinkedTo(last);
		if (prevWriteBlock.wouldBeEmptyIfDetached(linked)) {
			// console.debug(`moveLastToNext ${this.identifier}: would be empty according to ${prevWriteBlock.identifier}`);
			return MoveLastToNextResult.WouldBeEmpty;
		}
		const nextWriteBlock = this.buildBlockForEl(doc, last);
		if (nextWriteBlock == null) {
			// console.debug(`moveLastToNext ${this.identifier}: no next`);
			return MoveLastToNextResult.CannotMove;
		}
		// console.debug(`${this.identifier}.moveLastToNext ${prevWriteBlock.identifier} => ${nextWriteBlock.identifier}`);
		const didAppend = nextWriteBlock.moveFrom(doc, linked, prevWriteBlock);
		this.writeBlock = nextWriteBlock;
		// console.debug(`moveLastToNext ${this.identifier} didAppend ${didAppend}, writer: ${prevWriteBlock.identifier} -> ${nextWriteBlock.identifier}`);
		switch (didAppend) {
			case AppendBlockResult.Appended:
				if (withMoved != null) {
					withMoved(linked, prevWriteBlock, nextWriteBlock);
				}
				return MoveLastToNextResult.Moved;
			case AppendBlockResult.Full:
				console.error("Unexpectedly full block which supposedly wasn't", this.writeBlock.identifier);
				return MoveLastToNextResult.CannotMove;
			default:
				throw new Error(`Unhandled AppendBlockResult type: ${didAppend}`);
		}
	}

	wouldBeEmptyIfDetached(els: ChildNode[]): boolean {
		return this.writeBlock == null || this.writeBlock.wouldBeEmptyIfDetached(els);
	}

	writerForNodes(...nodes: ChildNode[]): W | undefined {
		return this.writeBlock;
	}
}

class ColumnedBlock extends MultiTargetBlock<DivBlock> {
	public readonly lastWriteBlock: DivBlock;
	private nextGutterNumber = 1;

	constructor(
		wrapper: HTMLDivElement,
		protected readonly left: DivBlock,
		protected readonly right: DivBlock,
		protected readonly gutter: DivBlock,
		identifier: string,
	) {
		super(wrapper, left, identifier);
		this.lastWriteBlock = right;
	}

	static buildColumned(doc: DocHelper, identifier: string, ...classNames: string[]): ColumnedBlock {
		const wrapper = doc.div("columned-wrapper", ...classNames);
		const left = DivBlock.buildDiv(doc, `${identifier}.left`, "columned-left");
		const right = DivBlock.buildDiv(doc, `${identifier}.right`, "columned-right");
		const gutter = DivBlock.buildDiv(doc, `${identifier}.gutter`, "columned-gutter");
		wrapper.appendChild(left.outerElement);
		wrapper.appendChild(right.outerElement);
		wrapper.appendChild(gutter.outerElement);
		return new ColumnedBlock(wrapper, left, right, gutter, identifier);
	}

	appendNode(doc: DocHelper, ...nodes: ChildNode[]): AppendBlockResult {
		const prevEl = this.lastAppendedElement;
		const didAppend = super.appendNode(doc, ...nodes);
		if (didAppend === AppendBlockResult.Appended && prevEl != null && Block.isAside(...nodes)) {
			const gutterId = String(this.nextGutterNumber++);
			prevEl.setAttribute(DATA_GUTTER_REF, gutterId);
			Block.elementsOf(nodes).forEach(el => el.setAttribute(DATA_GUTTER_NUM, gutterId));
		}
		return didAppend;
	}

	buildBlockForEl(doc: DocHelper, el: HTMLElement): DivBlock | undefined {
		if (Block.isAside(el)) {
			if (this.lastAppendedElement != null) {
			}
			return this.gutter;
		} else if (this.writeBlock === this.left) {
			// console.debug(`buildBlockForEl ${this.identifier} Moving to right column`, el);
			this.writeBlock = this.right;
			return this.right;
		}
		return undefined;
	}

	isEmpty(): boolean {
		return this.left.isEmpty() && this.right.isEmpty() && this.gutter.isEmpty();
	}

	writerForNodes(...nodes: ChildNode[]): DivBlock | undefined {
		return Block.isAside(...nodes) ? this.gutter : this.writeBlock;
	}
}

class PageManager extends MultiTargetBlock<PageBlock> {
	public lastWriteBlock: PageBlock;
	private nextPageNumber: number;
	private readonly pages: PageBlock[];

	constructor(
		wrapper: HTMLDivElement,
		firstPage: PageBlock,
		identifier: string,
	) {
		super(wrapper, firstPage, identifier);
		this.lastWriteBlock = firstPage;
		this.pages = [firstPage];
		this.nextPageNumber = this.pages.length + 1;
	}

	static buildPageManager(doc: DocHelper, identifier: string, ...classNames: string[]): PageManager {
		const pagesEl = doc.findOrCreate("#pages", p => {
			p.id = "pages";
			p.classList.add(...classNames);
			document.body.prepend(p);
		});
		const firstPage = PageBlock.buildPage(doc, 1);
		pagesEl.appendChild(firstPage.outerElement);
		return new PageManager(pagesEl, firstPage, identifier);
	}

	buildBlockForEl(doc: DocHelper, el: HTMLElement): PageBlock | undefined {
		// console.debug(`buildBlockForEl ${this.identifier} for `, el);
		const page = PageBlock.buildPage(doc, this.nextPageNumber++);
		this.pages.push(page);
		this.lastWriteBlock = page;
		this.wrapper.appendChild(page.outerElement);
		return page;
	}

	isEmpty(): boolean {
		return this.pages.length === 0 || this.pages[0].isEmpty();
	}

	moveLastToNext(doc: DocHelper): MoveLastToNextResult {
		return super.moveLastToNext(doc, (moved, fromBlock, toBlock) => {
			Block.elementsOf(moved).forEach(el => {
				doc.extractFootnotes(el).forEach(footnote => {
					toBlock.takeFootnote(footnote);
				});
			});
		});
	}
}

type PageBodyBlock = WideBlock | ColumnedBlock;

class PageBlock extends Block {
	protected readonly blocks: Array<PageBodyBlock> = [];
	protected writeBlock: PageBodyBlock | undefined;

	constructor(
		protected readonly wrapper: HTMLDivElement,
		protected readonly head: HTMLDivElement,
		public readonly body: HTMLDivElement,
		protected readonly foot: HTMLDivElement,
		identifier: string,
	) {
		super(identifier);
	}

	get lastAppendedElement(): HTMLElement | undefined {
		return this.writeBlock == null ? undefined : this.writeBlock.lastAppendedElement;
	}

	get outerElement(): HTMLElement {
		return this.wrapper;
	}

	static buildPage(doc: DocHelper, pageNumber: number, ...classNames: string[]): PageBlock {
		// console.debug(`New page: ${pageNumber}`);
		const page = doc.div("page", pageNumber % 2 ? "page-odd" : "page-even", ...classNames);
		page.id = `page-${pageNumber}`;
		page.setAttribute(DATA_PAGE_NUMBER, String(pageNumber));
		const pageNumberDiv = document.createElement("DIV") as HTMLDivElement;
		pageNumberDiv.classList.add("page-number");
		pageNumberDiv.appendChild(doc.div("page-number-hex"));
		const pageNumberValue = doc.div("page-number-value");
		pageNumberValue.appendChild(document.createTextNode(String(pageNumber)));
		pageNumberDiv.appendChild(pageNumberValue);
		const head = doc.div("page-header");
		const body = doc.div("page-body");
		const foot = doc.div("page-footer");
		page.appendChild(pageNumberDiv);
		page.appendChild(body);
		page.appendChild(head);
		page.appendChild(foot);
		return new PageBlock(page, head, body, foot, page.id);
	}

	appendNode(doc: DocHelper, ...nodes: ChildNode[]): AppendBlockResult {
		// console.debug('Page.appendNode', nodes);
		const keep = Block.elementsOrTextOf(nodes);
		if (keep.length === 0) {
			return AppendBlockResult.Skipped;
		}
		const spanAll = !Block.isAside(...nodes) && Block.needsSpanAll(...nodes);
		let block: PageBodyBlock | undefined = this.writeBlock;
		if (block == null || (block instanceof WideBlock && !spanAll) || (block instanceof ColumnedBlock && spanAll)) {
			block = spanAll ? WideBlock.buildWide(doc, `${this.identifier}[${this.blocks.length}].wide`) : ColumnedBlock.buildColumned(doc, `${this.identifier}[${this.blocks.length}].columned`);
			this.blocks.push(block);
			this.body.appendChild(block.outerElement);
			this.writeBlock = block;
		}
		const didAppend = block.appendNode(doc, ...nodes);
		if (didAppend === AppendBlockResult.Appended) {
			Block.elementsOf(nodes).forEach(el => {
				doc.extractFootnotes(el).forEach(footnote => {
					footnote.parentNode?.removeChild(footnote);
					this.foot.appendChild(footnote);
				});
			});
		}
		return didAppend;
	}

	isEmpty(): boolean {
		return this.blocks.length == 0 || this.blocks[0].isEmpty();
	}

	moveFrom(doc: DocHelper, linked: ChildNode[], prevWriteBlock: Block): AppendBlockResult {
		linked.forEach(n => n.parentNode?.removeChild(n));
		return this.appendNode(doc, ...linked);
	}

	moveLastToNext(doc: DocHelper): MoveLastToNextResult {
		if (this.writeBlock instanceof ColumnedBlock) {
			// try to add to the existing block
			// console.debug(`moveLastToNext ${this.identifier} to existing ColumnedBlock`);
			return this.writeBlock.moveLastToNext(doc);
		}
		// wide blocks need a new page
		return MoveLastToNextResult.CannotMove;
	}

	takeFootnote(footnote: HTMLDivElement): void {
		footnote.parentNode?.removeChild(footnote);
		this.foot.appendChild(footnote);
	}

	wouldBeEmptyIfDetached(els: ChildNode[]): boolean {
		return this.writeBlock != null && this.writeBlock.wouldBeEmptyIfDetached(els) && this.blocks[0] === this.writeBlock;
	}
}

abstract class RenderingTask {
	protected constructor(
		public readonly title: string,
	) {
	}

	abstract get errorMessage(): string | undefined;

	abstract get estimatedCompletion(): number;

	abstract get isComplete(): boolean;

	finish(): void {
	}

	prepare(): void {
	}

	abstract step(): void;
}

class OnceTask extends RenderingTask {
	public errorMessage: string | undefined;
	public estimatedCompletion: number = 0;

	constructor(
		title: string,
		protected readonly task: () => string | undefined | void,
		public isComplete: boolean = false,
		estimatedCompletion: number = isComplete ? 1.0 : 0,
	) {
		super(title);
		this.estimatedCompletion = estimatedCompletion;
	}

	step(): void {
		this.errorMessage = this.task() || undefined;
		this.isComplete = true;
		this.estimatedCompletion = 1.0;
	}
}

type RenderingTaskListener = (taskTitle: string, estimatedCompletion: number, errorMessage?: string | undefined) => void;

class RenderingTaskManager {
	protected readonly listeners: RenderingTaskListener[] = [];
	protected readonly tasks: RenderingTask[];

	constructor(
		...tasks: RenderingTask[]
	) {
		this.tasks = tasks;
	}

	public addListener(listener: RenderingTaskListener): void {
		this.listeners.push(listener);
	}

	public start() {
		const todo = this.tasks.slice();
		const startTime = Date.now();
		let lastTask: RenderingTask | undefined;
		const manager = this;

		function nextTask(): void {
			const task = todo[0];
			if (task == null) {
				console.debug(`Done after ${(Date.now() - startTime) / 1000}`);
				return;
			}
			if (lastTask !== task) {
				// console.debug(`Prepare ${task.title}`);
				manager.listeners.forEach(l => l(task.title, 0));
				task.prepare();
			}
			lastTask = task;
			let okay: boolean = false;
			try {
				task.step();
				if (task.errorMessage == null) {
					manager.listeners.forEach(l => l(task.title, task.estimatedCompletion));
					okay = true;
				} else {
					manager.listeners.forEach(l => l(task.title, task.estimatedCompletion, task.errorMessage));
					console.error(`Task ${task.title} failed: `, task.errorMessage);
				}
			} catch (e) {
				manager.listeners.forEach(l => l(task.title, task.estimatedCompletion, task.errorMessage));
				console.error(`Task ${task.title} threw: `, e);
			} finally {
				if (task.isComplete) {
					manager.listeners.forEach(l => l(task.title, 1.0));
					task.finish();
					todo.shift();
				}
				if (okay) {
					setTimeout(nextTask, 1);
				}
			}
		}

		setTimeout(nextTask, 1);
	}
}

window.addEventListener("load", () => {
	if (!document.body.classList.contains("print-module")) {
		// console.info("Not a printable module.");
		return;
	}
	const docHelper = new DocHelper(document);

	class ReflowTask extends RenderingTask {
		public errorMessage: string | undefined;
		public estimatedCompletion: number = 0;
		public isComplete: boolean = false;
		protected readonly pageManager: PageManager = PageManager.buildPageManager(docHelper, "$");
		protected readonly todo: ChildNode[] = [];
		protected totalCount: number = 0;

		constructor() {
			super("Render print layout.");
		}

		prepare() {
			const content = document.getElementById("content");
			if (content == null) {
				this.errorMessage = "No #content";
				return;
			}
			const allChildren: ChildNode[] = [];
			content.childNodes.forEach(child => allChildren.push(child));
			this.todo.push(...allChildren.filter(child => {
				return child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent != null && child.textContent.length > 0);
			}));
			content.parentNode?.removeChild(content);
			this.totalCount = this.todo.length;
		}

		step(): void {
			const lastContent = this.pageManager.lastAppendedElement;
			const lastPageBody = this.pageManager.lastWriteBlock.body;
			if (lastContent != null && lastPageBody != null) {
				// console.debug("Inspecting last content", lastContent);
				const lastContentBounds = lastContent.getBoundingClientRect();
				const lastBodyBounds = lastPageBody.getBoundingClientRect();
				const fromBottom = lastBodyBounds.bottom - lastContentBounds.bottom;
				// const reasons: string[] = [];
				let move = false;
				if (fromBottom < 0) {
					// reasons.push(`Below Bottom ${fromBottom}`);
					move = true;
				}
				const fromRight = lastBodyBounds.right - lastContentBounds.right;
				if (fromRight < 0) {
					// reasons.push(`Past Right ${fromRight}`);
					move = true;
				}
				if (lastContent.classList.contains(PAGE_BREAK_BEFORE)) {
					// reasons.push(`Declared break`);
					move = true;
				}
				if (move) {
					// console.debug("Moving", reasons, lastContent);
					this.pageManager.moveLastToNext(docHelper);
				} else {
					// console.debug("Seems okay", lastContent);
				}
			}
			let nextContent = this.todo.shift();
			if (nextContent == null) {
				this.isComplete = true;
				this.estimatedCompletion = 1.0;
			} else {
				this.pageManager.appendNode(docHelper, nextContent);
				this.estimatedCompletion = 1.0 - (this.todo.length / this.totalCount);
			}
		}
	}

	const taskManager = new RenderingTaskManager(
		new OnceTask("Prepare print rendering overlay", () => {
			const printRender = docHelper.html(docHelper.div("print-render"), printRender => {
				const renderTitle = docHelper.div("print-render-title");
				renderTitle.appendChild(document.createTextNode("Preparing for Print/PDF"));
				printRender.appendChild(renderTitle);
				const renderProgress = docHelper.div("print-render-progress");
				const renderStatus = docHelper.div("print-render-status");
				renderStatus.innerText = "...";
				renderProgress.appendChild(renderStatus);
				const renderPercent = docHelper.div("print-render-percent");
				renderProgress.appendChild(renderPercent);
				printRender.appendChild(renderProgress);
				const renderMessage = docHelper.div("print-render-message");
				renderMessage.appendChild(document.createTextNode("One moment, please, while the module is made print-ready.  This usually takes under 15 seconds."));
				printRender.appendChild(renderMessage);
				taskManager.addListener((taskTitle: string, estimatedCompletion: number, errorMessage: string | undefined) => {
					if (errorMessage != null) {
						renderStatus.innerText = taskTitle;
						renderMessage.innerText = errorMessage;
						renderMessage.classList.add("error");
					} else {
						renderPercent.innerText = Math.floor(estimatedCompletion * 100) + "%";
						renderStatus.innerText = taskTitle;
					}
				});
			});
			const renderMask = docHelper.div("print-render-mask");
			renderMask.appendChild(printRender);
			document.body.appendChild(renderMask);
		}),
		new OnceTask("Clean up screen-centric structures, part 1.", () => {
			const moduleLinkParent = docHelper.moduleLink.parentNode;
			moduleLinkParent?.removeChild(docHelper.moduleLink);
			moduleLinkParent?.parentNode?.removeChild(moduleLinkParent);
			document.body.appendChild(docHelper.moduleLink);
		}),
		new OnceTask("Identify major sections.", () => {
			document.querySelectorAll(`[${DATA_SOURCE_FILE}]`).forEach(wrapper => docHelper.unwrapSourceWrapper(wrapper));
		}),
		new OnceTask("Identify block quote introductions.", () => {
			document.querySelectorAll("blockquote, details").forEach(bq => {
				const prev = bq.previousElementSibling;
				if (prev != null && prev.tagName.toUpperCase() === "P" && prev.lastChild != null && prev.lastChild.textContent != null && prev.lastChild.textContent.endsWith(":")) {
					prev.classList.add(AVOID_BREAK_AFTER);
				}
			});
		}),
		new OnceTask("Add page breaks at major headings.", () => {
			document.querySelectorAll("h1").forEach(h1 => h1.classList.add(COL_SPAN_ALL, PAGE_BREAK_BEFORE))
		}),
		new OnceTask("Ensure headings are not orphaned.", () => {
			document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(h => h.classList.add(AVOID_BREAK_AFTER));
		}),
		new OnceTask("Reveal all spoilers.", () => {
			document.querySelectorAll("details").forEach(details => details.open = true);
		}),
		new OnceTask("Let block quotes span columns and pages.", () => {
			document.querySelectorAll("blockquote").forEach((bq: HTMLElement) => {
				docHelper.unwrap(bq, (child, index, count) => {
					const wrapper = docHelper.div("blockquote-part");
					if (index === 0) {
						wrapper.classList.add("blockquote-start");
					}
					if (index === count) {
						wrapper.classList.add("blockquote-end");
					}
					wrapper.appendChild(child);
					return wrapper;
				})
			});
		}),
		new OnceTask("Expand links to page references.", () => {
			// Because Firefox makes any css::after content print like butt for some reason.
			document.querySelectorAll("a[href]").forEach((link: HTMLAnchorElement): void => {
				const href = link.href;
				if (href.startsWith(docHelper.moduleLink.href)) {
					const refSpan = document.createElement("SPAN");
					refSpan.innerText = " (page\u00a0####)";
					link.appendChild(refSpan);
					const ref = href
						.replace(docHelper.moduleLink.href, "")
						.replace(".md", "")
						.replace(/^\//, "")
					;
					if (ref !== '') {
						refSpan.setAttribute(DATA_PAGE_OF, ref);
						link.classList.add('page-ref');
					}
				} else {
					const footnoteSpan = document.createElement("SPAN");
					footnoteSpan.classList.add('footnote-bracket');
					footnoteSpan.innerHTML = `&nbsp;[##]`;
					link.appendChild(footnoteSpan);
					if (!(link.rel || '').includes("external")) {
						link.rel = "external"
					}
				}
			});
		}),
		new ReflowTask(),
		new OnceTask("Clean up screen-centric structures, part 2.", () => {
			const mainContent = document.getElementById("page");
			if (mainContent != null && mainContent.parentNode != null) {
				mainContent.parentNode.removeChild(mainContent);
			}
		}),
		new OnceTask("Fix up page references.", () => {
			const cache: Record<string, string> = {};
			document.querySelectorAll(`[${DATA_PAGE_OF}]`).forEach(el => {
				const sourceName = el.getAttribute(DATA_PAGE_OF) || "";
				let pageRef: string = cache[sourceName];
				if (pageRef == null) {
					const topEl = document.querySelector(`[data-source="${sourceName}"]`);
					if (topEl == null) {
						console.error(`Missing a page-ref/data-source: `, sourceName);
					} else {
						pageRef = docHelper.pageWith(topEl);
						if (pageRef == null) {
							console.error(`No ref for page`, sourceName);
						}
						cache[sourceName] = pageRef;
					}
				}
				const numberedPage = docHelper.nearestAncestorLike(el, e => e.getAttribute(DATA_PAGE_NUMBER) != null);
				const currentPageNumber = numberedPage?.getAttribute(DATA_PAGE_NUMBER);
				if (currentPageNumber === pageRef) {
					el.classList.add('same-page');
				}
				if (el.tagName.toUpperCase() !== 'A') {
					el.innerHTML = ` (page\u00a0${pageRef})`;
				}
			});
		}),
		new OnceTask("Mark pages with empty gutters.", () => void (document
			.querySelectorAll(".page-body")
			.forEach((body: Element) => {
				let allEmpty = true;
				body.querySelectorAll(".columned-gutter").forEach(g => allEmpty = allEmpty && (g.childElementCount === 0));
				body.classList.add(allEmpty ? "empty-gutters" : "full-gutters");
			}))),
		new OnceTask("Relocate sidebar blocks.", () => {
			document.querySelectorAll(".page").forEach(page => {
				page.querySelectorAll(`[${DATA_GUTTER_NUM}]`).forEach(aside => {
					const gutterId = aside.getAttribute(DATA_GUTTER_NUM) || "";
					const target = page.querySelector(`[${DATA_GUTTER_REF}="${gutterId}"]`);
					const wrapper = target == null ? null : docHelper.nearestAncestorLike(target, el => el.classList.contains("columned-wrapper"));
					// console.log("Repositioning", aside, target);
					if (target == null || wrapper == null) {
						console.error(`Lost track of gutter target ${gutterId}`);
						return;
					}
					const targetRect = target.getBoundingClientRect();
					const bodyRect = wrapper.getBoundingClientRect();
					const asideRect = aside.getBoundingClientRect();
					let fromTopOfTarget = 0;
					// console.debug(`target body aside`, targetRect, bodyRect, asideRect);
					if (asideRect.height < targetRect.height) {
						fromTopOfTarget = (targetRect.height - asideRect.height) / 2;
						// console.debug("centering", fromTopOfTarget);
					}
					const fromTopOfBody = targetRect.top - bodyRect.top;
					// console.debug(`fromTopOfBody`, fromTopOfBody);
					// asideRect.top += fromTopOfTarget + fromTopOfBody;
					(aside as HTMLElement).style.top = Math.max(0, (fromTopOfTarget + fromTopOfBody)) + "px";
					aside.parentElement?.classList.add("absolute");  // for now
				});
			});
		}),
		new OnceTask("Everything looks okay!", () => {
			const renderMask = document.querySelector(".print-render-mask");
			if (renderMask != null) {
				renderMask.classList.add("print-render-done");
				const renderMessage = renderMask.querySelector(".print-render-message");
				if (renderMessage != null) {
					(renderMessage as HTMLElement).innerText = "Tap or click to clear this message, then use your browser to print as normal.";
				}
				renderMask.addEventListener("click", e => {
					e.preventDefault();
					e.cancelBubble = true;
					document.body.removeChild(renderMask);
				});
			}
			document.body.appendChild(docHelper.html(docHelper.div("ready-to-print"),
				d => d.id = "ready-to-print"));
		}),
	);

	taskManager.start();
});
