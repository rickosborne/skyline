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

interface TargetPage {
	body: HTMLDivElement;
	foot: HTMLDivElement;
	head: HTMLDivElement;
	num: number;
	page: HTMLDivElement;
}

const DATA_PAGE_REF = "data-page-ref";
const DATA_PAGE_OF = "data-page-of";
const AVOID_BREAK_AFTER = 'avoid-break-after';
window.addEventListener("load", () => {
	if (!document.body.classList.contains("print-module")) {
		console.log("Not a printable module.");
		return;
	}
	let reflowTimer: NodeJS.Timeout;
	const homeLink = document.getElementById("link-home") as HTMLAnchorElement;
	if (homeLink == null) {
		console.error("No link home.");
		return;
	}
	// const baseHref = homeLink.href;
	const moduleLink = document.getElementById("print-module-top-link") as HTMLAnchorElement;
	if (moduleLink == null) {
		console.error("No module link.");
		return;
	}
	const moduleHref = moduleLink.href;
	const pages = findOrCreate("#pages", p => {
		p.id = "pages";
		document.body.prepend(p);
	});
	const createPage = (() => {
		let nextPage = 1;
		return function createPage(): TargetPage {
			const pageNumber = nextPage++;
			const page = div("page", pageNumber % 2 ? "page-odd" : "page-even");
			page.id = `page-${pageNumber}`;
			page.setAttribute(DATA_PAGE_NUMBER, String(pageNumber));
			pages.appendChild(page);
			const pageNumberDiv = document.createElement("DIV") as HTMLDivElement;
			pageNumberDiv.classList.add("page-number");
			pageNumberDiv.appendChild(div('page-number-hex'));
			const pageNumberValue = div('page-number-value');
			pageNumberValue.appendChild(document.createTextNode(String(pageNumber)));
			pageNumberDiv.appendChild(pageNumberValue);
			const head = div("page-header");
			const body = div("page-body");
			const foot = div("page-footer");
			page.appendChild(pageNumberDiv);
			page.appendChild(body);
			page.appendChild(head);
			page.appendChild(foot);
			return {
				page,
				head,
				body,
				foot,
				num: pageNumber,
			};
		};
	})();

	function stop(err?: string) {
		if (err != null) {
			console.error(err);
		}
		if (reflowTimer != null) {
			clearInterval(reflowTimer)
		}
	}

	function div(...classNames: string[]) {
		const div = document.createElement("DIV") as HTMLDivElement;
		div.classList.add(...classNames);
		return div;
	}

	function findOrCreate(query: string, created: (div: HTMLDivElement) => void): HTMLDivElement {
		return document.querySelector(query) || (() => {
			const d = div();
			created(d);
			return d;
		})();
	}

	function findExpected(page: HTMLDivElement, className: string): HTMLDivElement {
		const el = page.querySelector(className);
		if (el == null) {
			stop();
			throw new Error(`Expected to find: ${className}`);
		}
		return el as HTMLDivElement;
	}

	function findBody(page: HTMLDivElement): HTMLDivElement {
		return findExpected(page, ".page-body");
	}

	function findFooter(page: HTMLDivElement): HTMLDivElement {
		return findExpected(page, ".page-footer");
	}

	function findHeader(page: HTMLDivElement): HTMLDivElement {
		return findExpected(page, ".page-header");
	}

	const nextFootnoteNumber = (() => {
		let nextNumber = 1;
		return function nextFootnoteNumber() {
			return nextNumber++;
		};
	})();
	const identify = (() => {
		let nextNumber = 1;
		return function identify(el: HTMLElement): string {
			if (el.id != null) {
				return el.id;
			}
			return (el.id = `ae${nextNumber++}`);
		};
	})();

	function extractFootnotes(d: Element): HTMLDivElement[] {
		return (Array.prototype.slice.apply(d.querySelectorAll("a[href]")) as HTMLAnchorElement[])
			.map(link => {
				let footnoteId = link.getAttribute(DATA_FOOTNOTE_ID);
				if (footnoteId != null) {
					return document.getElementById(footnoteId) as HTMLDivElement;
				}
				const href = link.href;
				if (href.startsWith(moduleHref)) {
					const ref = href
						.replace(moduleHref, "")
						.replace(".md", "")
						.replace(/^\//, '')
					;
					link.setAttribute(DATA_PAGE_REF, "####");
					link.setAttribute(DATA_PAGE_OF, ref);
					return undefined;
				}
				const footnoteNumber = nextFootnoteNumber();
				const footnote = div("footnote");
				footnote.id = `fn${footnoteNumber}`;
				footnote.appendChild(document.createTextNode(`${footnoteNumber}.\u00a0${href}`));
				footnote.setAttribute(DATA_LINK_ID, identify(link));
				link.setAttribute(DATA_FOOTNOTE_ID, footnote.id);
				link.setAttribute(DATA_FOOTNOTE_NUMBER, String(footnoteNumber));
				return footnote;
			})
			.filter(fn => fn != null) as HTMLDivElement[];
	}

	function moveToNewPage(oldPage: TargetPage, movedEl: Element, newPage: TargetPage = createPage()): TargetPage {
		// push to next page
		const footnotes = extractFootnotes(movedEl);
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

	function removeOldMainContent() {
		const mainContent = document.getElementById("page");
		if (mainContent != null && mainContent.parentNode != null) {
			mainContent.parentNode.removeChild(mainContent);
		}
	}

	function nearestAncestorLike(el: Element | undefined, predicate: (anc: Element) => boolean): Element | undefined {
		while (el != null) {
			if (predicate(el)) {
				return el;
			}
			el = el.parentElement ? el.parentElement : undefined;
		}
		return undefined;
	}

	function pageWith(el: Element): string {
		const page = nearestAncestorLike(el, anc => anc.classList.contains("page"));
		if (page == null) {
			console.error(`Could not find page with el:`, el);
			return '!';
		}
		const pageNumber = page.getAttribute(DATA_PAGE_NUMBER);
		if (pageNumber == null) {
			console.error(`Page without number: `, page);
			return '???';
		}
		return pageNumber;
	}

	function fixPageRefs() {
		console.debug('fixPageRefs');
		const cache: Record<string, string> = {};
		document.querySelectorAll(`[${DATA_PAGE_OF}]`).forEach(el => {
			const sourceName = el.getAttribute(DATA_PAGE_OF) || "";
			let pageRef: string = cache[sourceName];
			if (pageRef == null) {
				const topEl = document.querySelector(`[data-source="${sourceName}"]`);
				if (topEl == null) {
					console.error(`Missing a page-ref/data-source: `, sourceName);
				} else {
					pageRef = pageWith(topEl);
					if (pageRef == null) {
						console.error(`No ref for page`, sourceName);
					}
					cache[sourceName] = pageRef;
				}
			}
			el.setAttribute(DATA_PAGE_REF, pageRef || "?");
		});
	}

	function unwrap(wrapper: Element, eachChild: (childNode: ChildNode, index: number, count: number) => ChildNode = c => c) {
		const children: ChildNode[] = [];
		wrapper.childNodes.forEach(childNode => {
			if (childNode.nodeType === Node.ELEMENT_NODE || (childNode.nodeType === Node.TEXT_NODE && (childNode.textContent?.trim() || '').length > 0)) {
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

	function unwrapSourceWrapper(wrapper: Element) {
		const source = wrapper.getAttribute(DATA_SOURCE_FILE) || '';
		wrapper.firstElementChild?.setAttribute(DATA_SOURCE, source);
		unwrap(wrapper);
	}

	function reflowPrintModule() {
		let targetPage: HTMLDivElement | null = document.querySelector(".page:last-child");
		let target: TargetPage;
		if (targetPage == null) {
			target = createPage();
		} else {
			target = {
				body: findBody(targetPage),
				foot: findFooter(targetPage),
				head: findHeader(targetPage),
				page: targetPage,
				num: Number(targetPage.getAttribute(DATA_PAGE_NUMBER)),
			};
		}
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
				console.debug('Below bottom', fromBottom, lastContent);
				move = true;
			}
			const fromRight = lastBodyBounds.right - lastContentBounds.right;
			if (fromRight < 0) {
				console.debug('Past right', fromRight, lastContent);
				move = true;
			}
			if (lastContent.classList.contains('page-break-before')) {
				console.debug('Declared break', lastContent);
				move = true;
			}
			if (move && lastContent !== target.body.firstElementChild) {
				const oldTarget = target;
				target = moveToNewPage(target, lastContent);
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
					moveToNewPage(oldTarget, lastEl, target);
				} while(true);
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
			extractFootnotes(nextElement).forEach(footnote => {
				target.foot.appendChild(footnote);
			});
		}
	}

	document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => h.classList.add(AVOID_BREAK_AFTER));
	// Make H1s break
	document.querySelectorAll('h1').forEach(h1 => h1.classList.add('page-break-before'));
	// Unwrap source files
	document.querySelectorAll(`[${DATA_SOURCE_FILE}]`).forEach(wrapper => unwrapSourceWrapper(wrapper));
	// open all spoilers
	document.querySelectorAll("details").forEach(details => details.open = true);
	// Unwrap all blockquotes
	document.querySelectorAll('blockquote').forEach((bq: HTMLElement) => {
		unwrap(bq, (child, index, count) => {
			const wrapper = div('blockquote-part');
			if (index === 0) {
				wrapper.classList.add('blockquote-start');
			}
			if (index === count) {
				wrapper.classList.add('blockquote-end');
			}
			wrapper.appendChild(child);
			return wrapper;
		})
	});

	const moduleLinkParent = moduleLink.parentNode;
	moduleLinkParent?.removeChild(moduleLink);
	moduleLinkParent?.parentNode?.removeChild(moduleLinkParent);
	document.body.appendChild(moduleLink);
	reflowTimer = setInterval(reflowPrintModule, 1);
});

console.log("skyline.js");
