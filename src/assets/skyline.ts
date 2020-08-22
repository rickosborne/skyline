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
const DATA_FOOTNOTE_NUMBER = "data-footnote-number";
const DATA_LINK_ID = "data-link-id";
const DATA_PAGE_NUMBER = "data-page-number";
const DATA_SOURCE = "data-source";
const DATA_SOURCE_FILE = "data-source-file";
const DATA_PAGE_REF = "data-page-ref";
const DATA_PAGE_OF = "data-page-of";
const AVOID_BREAK_AFTER = "avoid-break-after";

class DocHelper {
	public documentSeemsOkay = true;
	public readonly homeLink: HTMLAnchorElement;
	public readonly moduleLink: HTMLAnchorElement;
	private nextElementNumber = 1;
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
					return document.getElementById(footnoteId) as HTMLDivElement;
				}
				const href = link.href;
				if (href.startsWith(this.moduleLink.href)) {
					const ref = href
						.replace(this.moduleLink.href, "")
						.replace(".md", "")
						.replace(/^\//, "")
					;
					link.setAttribute(DATA_PAGE_REF, "####");
					link.setAttribute(DATA_PAGE_OF, ref);
					return undefined;
				}
				const footnoteNumber = this.nextFootnoteNumber++;
				const footnote = this.div("footnote");
				footnote.id = `fn${footnoteNumber}`;
				footnote.appendChild(document.createTextNode(`${footnoteNumber}.\u00a0${href}`));
				footnote.setAttribute(DATA_LINK_ID, this.identify(link));
				link.setAttribute(DATA_FOOTNOTE_ID, footnote.id);
				link.setAttribute(DATA_FOOTNOTE_NUMBER, String(footnoteNumber));
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

	identify(el: HTMLElement): string {
		if (el.id != null) {
			return el.id;
		}
		return (el.id = `ae${this.nextElementNumber++}`);
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
			if (childNode.nodeType === Node.ELEMENT_NODE || (childNode.nodeType === Node.TEXT_NODE && (childNode.textContent?.trim() || "").length > 0)) {
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


class PageManager {
	private nextPageNumber: number = 1;
	private readonly pages: Map<string, TargetPage> = new Map<string, TargetPage>();
	private readonly pagesEl: HTMLDivElement;

	constructor(
		private readonly doc: DocHelper,
	) {
		this.pagesEl = doc.findOrCreate("#pages", p => {
			p.id = "pages";
			document.body.prepend(p);
		});
	}

	createPage(): TargetPage {
		const pageNumber = this.nextPageNumber++;
		const page = this.doc.div("page", pageNumber % 2 ? "page-odd" : "page-even");
		page.id = `page-${pageNumber}`;
		page.setAttribute(DATA_PAGE_NUMBER, String(pageNumber));
		this.pagesEl.appendChild(page);
		const pageNumberDiv = document.createElement("DIV") as HTMLDivElement;
		pageNumberDiv.classList.add("page-number");
		pageNumberDiv.appendChild(this.doc.div("page-number-hex"));
		const pageNumberValue = this.doc.div("page-number-value");
		pageNumberValue.appendChild(document.createTextNode(String(pageNumber)));
		pageNumberDiv.appendChild(pageNumberValue);
		const head = this.doc.div("page-header");
		const body = this.doc.div("page-body");
		const foot = this.doc.div("page-footer");
		page.appendChild(pageNumberDiv);
		page.appendChild(body);
		page.appendChild(head);
		page.appendChild(foot);
		const newPage = {
			page,
			head,
			body,
			foot,
			num: pageNumber,
		};
		this.pages.set(page.id, newPage);
		return newPage;
	}

	findOrCreateLastPage(): TargetPage {
		const targetPage: HTMLDivElement | null = document.querySelector(".page:last-child");
		if (targetPage == null) {
			return this.createPage();
		} else {
			const foundPage = this.pages.get(targetPage.id);
			if (foundPage == null) {
				throw new Error(`Lost track of page: ${targetPage.id}`);
			}
			return foundPage;
		}
	}

	moveToNewPage(oldPage: TargetPage, movedEl: Element, newPage: TargetPage = this.createPage()): TargetPage {
		// push to next page
		const footnotes = this.doc.extractFootnotes(movedEl);
		oldPage.body.removeChild(movedEl);
		newPage.body.prepend(movedEl);
		footnotes.forEach(footnote => {
			const parent = footnote.parentNode;
			if (parent != null && parent !== newPage.foot) {
				parent.removeChild(footnote);
				newPage.foot.appendChild(footnote);
			} else if (parent == null) {
				newPage.foot.appendChild(footnote);
			}
		});
		return newPage;
	}
}

interface TargetPage {
	body: HTMLDivElement;
	foot: HTMLDivElement;
	head: HTMLDivElement;
	num: number;
	page: HTMLDivElement;
}

window.addEventListener("load", () => {
	if (!document.body.classList.contains("print-module")) {
		console.log("Not a printable module.");
		return;
	}
	const docHelper = new DocHelper(document);
	const pageManager = new PageManager(docHelper);
	let reflowTimer: NodeJS.Timeout;

	function stop(err?: string) {
		if (err != null) {
			console.error(err);
		}
		if (reflowTimer != null) {
			clearInterval(reflowTimer)
		}
	}


	function removeOldMainContent() {
		const mainContent = document.getElementById("page");
		if (mainContent != null && mainContent.parentNode != null) {
			mainContent.parentNode.removeChild(mainContent);
		}
	}

	function fixPageRefs() {
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
			el.setAttribute(DATA_PAGE_REF, pageRef || "?");
		});
	}

	function reflowPrintModule() {
		let target = pageManager.findOrCreateLastPage();
		const content = document.getElementById("content");
		if (content == null) {
			stop("No #content");
			return;
		}
		const lastContent = target.body.lastElementChild;
		if (lastContent != null) {
			const lastContentBounds = lastContent.getBoundingClientRect();
			const lastBodyBounds = target.body.getBoundingClientRect();
			const fromBottom = lastBodyBounds.bottom - lastContentBounds.bottom;
			let move = false;
			if (fromBottom < 0) {
				console.debug("Below bottom", fromBottom, lastContent);
				move = true;
			}
			const fromRight = lastBodyBounds.right - lastContentBounds.right;
			if (fromRight < 0) {
				console.debug("Past right", fromRight, lastContent);
				move = true;
			}
			if (lastContent.classList.contains("page-break-before")) {
				console.debug("Declared break", lastContent);
				move = true;
			}
			if (move && lastContent !== target.body.firstElementChild) {
				const oldTarget = target;
				target = pageManager.moveToNewPage(target, lastContent);
				do {
					const lastChild = oldTarget.body.lastChild;
					if (lastChild == null || lastChild.nodeType !== Node.ELEMENT_NODE) {
						break;
					}
					const lastEl = lastChild as Element;
					if (!lastEl.classList.contains(AVOID_BREAK_AFTER) || oldTarget.body.firstElementChild === lastEl) {
						break;  // oh, the humanity
					}
					console.debug(`Avoiding break after`, lastEl);
					pageManager.moveToNewPage(oldTarget, lastEl, target);
				} while (true);
				return;  // continue with reflow after the browser catches up.
			}
		}
		let nextContent = content.firstChild;
		if (nextContent == null) {
			stop();
			removeOldMainContent();
			fixPageRefs();
			return;
		}
		content.removeChild(nextContent);
		if (nextContent.nodeType === Node.COMMENT_NODE) {
			return;
		}
		target.body.appendChild(nextContent);
		if (nextContent.nodeType === Node.ELEMENT_NODE) {
			let nextElement = nextContent as HTMLElement;
			docHelper.extractFootnotes(nextElement).forEach(footnote => {
				target.foot.appendChild(footnote);
			});
		}
	}

	// Avoid lonesome headers
	document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(h => h.classList.add(AVOID_BREAK_AFTER));
	// Make H1s start a new page
	document.querySelectorAll("h1").forEach(h1 => h1.classList.add("page-break-before"));
	// Unwrap source files
	document.querySelectorAll(`[${DATA_SOURCE_FILE}]`).forEach(wrapper => docHelper.unwrapSourceWrapper(wrapper));
	// Open all spoilers
	document.querySelectorAll("details").forEach(details => details.open = true);
	// Unwrap all block quotes
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

	const moduleLinkParent = docHelper.moduleLink.parentNode;
	moduleLinkParent?.removeChild(docHelper.moduleLink);
	moduleLinkParent?.parentNode?.removeChild(moduleLinkParent);
	document.body.appendChild(docHelper.moduleLink);
	reflowTimer = setInterval(reflowPrintModule, 1);
});
