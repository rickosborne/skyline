"use strict";
// Skyline.js
document.addEventListener("DOMContentLoaded", function onDomContentLoaded() {
    document.querySelectorAll(".spoiler").forEach(function (spoilerEl) {
        var parentElement = spoilerEl.parentElement;
        if (parentElement == null) {
            return;
        }
        var isBlock = spoilerEl.classList.contains("block") || ["blockquote", "div"].includes(spoilerEl.tagName.toLowerCase());
        var warningType = isBlock ? "DETAILS" : "SPAN";
        var warningEl = document.createElement(warningType);
        if (isBlock) {
            var summaryEl = document.createElement("SUMMARY");
            summaryEl.appendChild(document.createTextNode("Spoiler"));
            warningEl.appendChild(summaryEl);
            warningEl.classList.add("block");
            parentElement.insertBefore(warningEl, spoilerEl);
            parentElement.removeChild(spoilerEl);
            warningEl.appendChild(spoilerEl);
            summaryEl.classList.add("spoiler-warning");
        }
        else {
            var labelEl = document.createElement("LABEL");
            var checkboxEl = document.createElement("INPUT");
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
    document.querySelectorAll(".fullscreen-able").forEach(function (fullscreenAble) {
        fullscreenAble.addEventListener("click", function () {
            if (!document.fullscreenElement && fullscreenAble.requestFullscreen) {
                fullscreenAble.requestFullscreen().catch(function (err) { return console.warn(err); });
            }
            else if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen().catch(function (err) { return console.warn(err); });
            }
        });
    });
});
var DATA_FOOTNOTE_ID = "data-footnote-id";
var DATA_FOOTNOTE_NUMBER = "data-footnote-number";
var DATA_LINK_ID = "data-link-id";
var DATA_PAGE_NUMBER = "data-page-number";
var DATA_SOURCE = "data-source";
var DATA_SOURCE_FILE = "data-source-file";
var DATA_PAGE_REF = "data-page-ref";
var DATA_PAGE_OF = "data-page-of";
var AVOID_BREAK_AFTER = "avoid-break-after";
var DocHelper = /** @class */ (function () {
    function DocHelper(document) {
        this.document = document;
        this.documentSeemsOkay = true;
        this.nextElementNumber = 1;
        this.nextFootnoteNumber = 1;
        this.homeLink = this.document.getElementById("link-home");
        if (this.homeLink == null) {
            console.error("No home link.");
            this.documentSeemsOkay = false;
        }
        // const baseHref = homeLink.href;
        this.moduleLink = this.document.getElementById("print-module-top-link");
        if (this.moduleLink == null) {
            console.error("No module link.");
            this.documentSeemsOkay = false;
        }
    }
    DocHelper.prototype.div = function () {
        var _a;
        var classNames = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            classNames[_i] = arguments[_i];
        }
        var div = this.document.createElement("DIV");
        (_a = div.classList).add.apply(_a, classNames);
        return div;
    };
    DocHelper.prototype.extractFootnotes = function (d) {
        var _this = this;
        return Array.prototype.slice.apply(d.querySelectorAll("a[href]"))
            .map(function (link) {
            var footnoteId = link.getAttribute(DATA_FOOTNOTE_ID);
            if (footnoteId != null) {
                return document.getElementById(footnoteId);
            }
            var href = link.href;
            if (href.startsWith(_this.moduleLink.href)) {
                var ref = href
                    .replace(_this.moduleLink.href, "")
                    .replace(".md", "")
                    .replace(/^\//, "");
                link.setAttribute(DATA_PAGE_REF, "####");
                link.setAttribute(DATA_PAGE_OF, ref);
                return undefined;
            }
            var footnoteNumber = _this.nextFootnoteNumber++;
            var footnote = _this.div("footnote");
            footnote.id = "fn" + footnoteNumber;
            footnote.appendChild(document.createTextNode(footnoteNumber + ".\u00A0" + href));
            footnote.setAttribute(DATA_LINK_ID, _this.identify(link));
            link.setAttribute(DATA_FOOTNOTE_ID, footnote.id);
            link.setAttribute(DATA_FOOTNOTE_NUMBER, String(footnoteNumber));
            return footnote;
        })
            .filter(function (fn) { return fn != null; });
    };
    DocHelper.prototype.findOrCreate = function (query, created) {
        var _this = this;
        return this.document.querySelector(query) || (function () {
            var d = _this.div();
            created(d);
            return d;
        })();
    };
    DocHelper.prototype.identify = function (el) {
        if (el.id != null) {
            return el.id;
        }
        return (el.id = "ae" + this.nextElementNumber++);
    };
    DocHelper.prototype.nearestAncestorLike = function (el, predicate) {
        while (el != null) {
            if (predicate(el)) {
                return el;
            }
            el = el.parentElement ? el.parentElement : undefined;
        }
        return undefined;
    };
    DocHelper.prototype.pageWith = function (el) {
        var page = this.nearestAncestorLike(el, function (anc) { return anc.classList.contains("page"); });
        if (page == null) {
            console.error("Could not find page with el:", el);
            return "!";
        }
        var pageNumber = page.getAttribute(DATA_PAGE_NUMBER);
        if (pageNumber == null) {
            console.error("Page without number: ", page);
            return "???";
        }
        return pageNumber;
    };
    DocHelper.prototype.unwrap = function (wrapper, eachChild) {
        var _a;
        if (eachChild === void 0) { eachChild = function (c) { return c; }; }
        var children = [];
        wrapper.childNodes.forEach(function (childNode) {
            var _a;
            if (childNode.nodeType === Node.ELEMENT_NODE || (childNode.nodeType === Node.TEXT_NODE && (((_a = childNode.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "").length > 0)) {
                children.push(childNode);
            }
        });
        children.forEach(function (child, index, all) {
            var _a;
            wrapper.removeChild(child);
            var newChild = eachChild(child, index, all.length);
            (_a = wrapper.parentNode) === null || _a === void 0 ? void 0 : _a.insertBefore(newChild, wrapper);
        });
        (_a = wrapper.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(wrapper);
    };
    DocHelper.prototype.unwrapSourceWrapper = function (wrapper) {
        var _a;
        var source = wrapper.getAttribute(DATA_SOURCE_FILE) || "";
        (_a = wrapper.firstElementChild) === null || _a === void 0 ? void 0 : _a.setAttribute(DATA_SOURCE, source);
        this.unwrap(wrapper);
    };
    return DocHelper;
}());
var PageManager = /** @class */ (function () {
    function PageManager(doc) {
        this.doc = doc;
        this.nextPageNumber = 1;
        this.pages = new Map();
        this.pagesEl = doc.findOrCreate("#pages", function (p) {
            p.id = "pages";
            document.body.prepend(p);
        });
    }
    PageManager.prototype.createPage = function () {
        var pageNumber = this.nextPageNumber++;
        var page = this.doc.div("page", pageNumber % 2 ? "page-odd" : "page-even");
        page.id = "page-" + pageNumber;
        page.setAttribute(DATA_PAGE_NUMBER, String(pageNumber));
        this.pagesEl.appendChild(page);
        var pageNumberDiv = document.createElement("DIV");
        pageNumberDiv.classList.add("page-number");
        pageNumberDiv.appendChild(this.doc.div("page-number-hex"));
        var pageNumberValue = this.doc.div("page-number-value");
        pageNumberValue.appendChild(document.createTextNode(String(pageNumber)));
        pageNumberDiv.appendChild(pageNumberValue);
        var head = this.doc.div("page-header");
        var body = this.doc.div("page-body");
        var foot = this.doc.div("page-footer");
        page.appendChild(pageNumberDiv);
        page.appendChild(body);
        page.appendChild(head);
        page.appendChild(foot);
        var newPage = {
            page: page,
            head: head,
            body: body,
            foot: foot,
            num: pageNumber,
        };
        this.pages.set(page.id, newPage);
        return newPage;
    };
    PageManager.prototype.findOrCreateLastPage = function () {
        var targetPage = document.querySelector(".page:last-child");
        if (targetPage == null) {
            return this.createPage();
        }
        else {
            var foundPage = this.pages.get(targetPage.id);
            if (foundPage == null) {
                throw new Error("Lost track of page: " + targetPage.id);
            }
            return foundPage;
        }
    };
    PageManager.prototype.moveToNewPage = function (oldPage, movedEl, newPage) {
        if (newPage === void 0) { newPage = this.createPage(); }
        // push to next page
        var footnotes = this.doc.extractFootnotes(movedEl);
        oldPage.body.removeChild(movedEl);
        newPage.body.prepend(movedEl);
        footnotes.forEach(function (footnote) {
            var parent = footnote.parentNode;
            if (parent != null && parent !== newPage.foot) {
                parent.removeChild(footnote);
                newPage.foot.appendChild(footnote);
            }
            else if (parent == null) {
                newPage.foot.appendChild(footnote);
            }
        });
        return newPage;
    };
    return PageManager;
}());
window.addEventListener("load", function () {
    var _a;
    if (!document.body.classList.contains("print-module")) {
        console.log("Not a printable module.");
        return;
    }
    var docHelper = new DocHelper(document);
    var pageManager = new PageManager(docHelper);
    var reflowTimer;
    function stop(err) {
        if (err != null) {
            console.error(err);
        }
        if (reflowTimer != null) {
            clearInterval(reflowTimer);
        }
    }
    function removeOldMainContent() {
        var mainContent = document.getElementById("page");
        if (mainContent != null && mainContent.parentNode != null) {
            mainContent.parentNode.removeChild(mainContent);
        }
    }
    function fixPageRefs() {
        var cache = {};
        document.querySelectorAll("[" + DATA_PAGE_OF + "]").forEach(function (el) {
            var sourceName = el.getAttribute(DATA_PAGE_OF) || "";
            var pageRef = cache[sourceName];
            if (pageRef == null) {
                var topEl = document.querySelector("[data-source=\"" + sourceName + "\"]");
                if (topEl == null) {
                    console.error("Missing a page-ref/data-source: ", sourceName);
                }
                else {
                    pageRef = docHelper.pageWith(topEl);
                    if (pageRef == null) {
                        console.error("No ref for page", sourceName);
                    }
                    cache[sourceName] = pageRef;
                }
            }
            el.setAttribute(DATA_PAGE_REF, pageRef || "?");
        });
    }
    function reflowPrintModule() {
        var target = pageManager.findOrCreateLastPage();
        var content = document.getElementById("content");
        if (content == null) {
            stop("No #content");
            return;
        }
        var lastContent = target.body.lastElementChild;
        if (lastContent != null) {
            var lastContentBounds = lastContent.getBoundingClientRect();
            var lastBodyBounds = target.body.getBoundingClientRect();
            var fromBottom = lastBodyBounds.bottom - lastContentBounds.bottom;
            var move = false;
            if (fromBottom < 0) {
                console.debug("Below bottom", fromBottom, lastContent);
                move = true;
            }
            var fromRight = lastBodyBounds.right - lastContentBounds.right;
            if (fromRight < 0) {
                console.debug("Past right", fromRight, lastContent);
                move = true;
            }
            if (lastContent.classList.contains("page-break-before")) {
                console.debug("Declared break", lastContent);
                move = true;
            }
            if (move && lastContent !== target.body.firstElementChild) {
                var oldTarget = target;
                target = pageManager.moveToNewPage(target, lastContent);
                do {
                    var lastChild = oldTarget.body.lastChild;
                    if (lastChild == null || lastChild.nodeType !== Node.ELEMENT_NODE) {
                        break;
                    }
                    var lastEl = lastChild;
                    if (!lastEl.classList.contains(AVOID_BREAK_AFTER) || oldTarget.body.firstElementChild === lastEl) {
                        break; // oh, the humanity
                    }
                    console.debug("Avoiding break after", lastEl);
                    pageManager.moveToNewPage(oldTarget, lastEl, target);
                } while (true);
                return; // continue with reflow after the browser catches up.
            }
        }
        var nextContent = content.firstChild;
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
            var nextElement = nextContent;
            docHelper.extractFootnotes(nextElement).forEach(function (footnote) {
                target.foot.appendChild(footnote);
            });
        }
    }
    // Avoid lonesome headers
    document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(function (h) { return h.classList.add(AVOID_BREAK_AFTER); });
    // Make H1s start a new page
    document.querySelectorAll("h1").forEach(function (h1) { return h1.classList.add("page-break-before"); });
    // Unwrap source files
    document.querySelectorAll("[" + DATA_SOURCE_FILE + "]").forEach(function (wrapper) { return docHelper.unwrapSourceWrapper(wrapper); });
    // Open all spoilers
    document.querySelectorAll("details").forEach(function (details) { return details.open = true; });
    // Unwrap all block quotes
    document.querySelectorAll("blockquote").forEach(function (bq) {
        docHelper.unwrap(bq, function (child, index, count) {
            var wrapper = docHelper.div("blockquote-part");
            if (index === 0) {
                wrapper.classList.add("blockquote-start");
            }
            if (index === count) {
                wrapper.classList.add("blockquote-end");
            }
            wrapper.appendChild(child);
            return wrapper;
        });
    });
    var moduleLinkParent = docHelper.moduleLink.parentNode;
    moduleLinkParent === null || moduleLinkParent === void 0 ? void 0 : moduleLinkParent.removeChild(docHelper.moduleLink);
    (_a = moduleLinkParent === null || moduleLinkParent === void 0 ? void 0 : moduleLinkParent.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(moduleLinkParent);
    document.body.appendChild(docHelper.moduleLink);
    reflowTimer = setInterval(reflowPrintModule, 1);
});
