"use strict";
// Skyline.js
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
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
var COL_SPAN_ALL = "col-span-all";
var DATA_GUTTER_NUM = "data-gutter-num";
var DATA_GUTTER_REF = "data-gutter-ref";
var PAGE_BREAK_BEFORE = "page-break-before";
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
            if (Block.isElementOrNonEmptyText(childNode)) {
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
var AppendBlockResult;
(function (AppendBlockResult) {
    AppendBlockResult["Appended"] = "Appended";
    AppendBlockResult["Full"] = "Full";
    AppendBlockResult["Skipped"] = "Skipped";
})(AppendBlockResult || (AppendBlockResult = {}));
var MoveLastToNextResult;
(function (MoveLastToNextResult) {
    MoveLastToNextResult["Moved"] = "Moved";
    MoveLastToNextResult["CannotMove"] = "CannotMove";
    MoveLastToNextResult["NoLast"] = "NoLast";
    MoveLastToNextResult["WouldBeEmpty"] = "WouldBeEmpty";
})(MoveLastToNextResult || (MoveLastToNextResult = {}));
var Block = /** @class */ (function () {
    function Block(identifier) {
        this.identifier = this.constructor.name + ":" + identifier;
    }
    Block.collectLinkedTo = function (node) {
        var linked = [node];
        var nonEl = [];
        var parent = node.parentNode;
        if (parent == null) {
            return linked;
        }
        var current = node.previousSibling;
        while (current != null) {
            if (current.nodeType === Node.ELEMENT_NODE) {
                var el = current;
                if (el.classList.contains(AVOID_BREAK_AFTER) && parent.firstElementChild !== el) {
                    linked.push.apply(linked, __spreadArrays(nonEl, [current]));
                    nonEl.splice(0, nonEl.length);
                    current = current.previousSibling;
                }
                else {
                    current = null;
                }
            }
            else {
                nonEl.push(current);
                current = current.previousSibling;
            }
        }
        return linked;
    };
    Block.elementsOf = function (nodes) {
        return nodes.filter(function (n) { return n.nodeType === Node.ELEMENT_NODE; });
    };
    Block.elementsOrTextOf = function (nodes) {
        var _this = this;
        return nodes.filter(function (node) { return _this.isElementOrNonEmptyText(node); });
    };
    Block.isAside = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        return this.elementsOf(nodes).find(function (el) { return el.classList.contains("aside"); }) != null; // || el.tagName.toUpperCase() === "ASIDE") != null;
    };
    Block.isElementOrNonEmptyText = function (node) {
        var _a;
        return node.nodeType === Node.ELEMENT_NODE || (node.nodeType === Node.TEXT_NODE && (((_a = node.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || "").length > 0);
    };
    Block.needsSpanAll = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        return this.elementsOf(nodes).find(function (el) {
            return el.classList.contains(COL_SPAN_ALL);
        }) != null;
    };
    return Block;
}());
var DivBlock = /** @class */ (function (_super) {
    __extends(DivBlock, _super);
    function DivBlock(div, identifier) {
        var _this = _super.call(this, identifier) || this;
        _this.div = div;
        return _this;
    }
    Object.defineProperty(DivBlock.prototype, "lastAppendedElement", {
        get: function () {
            return this.div.lastElementChild == null ? undefined : this.div.lastElementChild;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(DivBlock.prototype, "outerElement", {
        get: function () {
            return this.div;
        },
        enumerable: false,
        configurable: true
    });
    DivBlock.buildDiv = function (doc, identifier) {
        var classNames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classNames[_i - 2] = arguments[_i];
        }
        return new DivBlock(doc.div.apply(doc, classNames), identifier);
    };
    DivBlock.prototype.appendNode = function (doc) {
        var _this = this;
        var nodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            nodes[_i - 1] = arguments[_i];
        }
        nodes.forEach(function (node) {
            _this.div.appendChild(node);
        });
        return AppendBlockResult.Appended;
    };
    DivBlock.prototype.isEmpty = function () {
        return this.div.childElementCount === 0;
    };
    DivBlock.prototype.moveFrom = function (doc, linked, prevWriteBlock) {
        var _this = this;
        // console.debug(`moveFrom ${this.identifier} (${this.div.className}) <- ${prevWriteBlock.identifier}`, linked);
        linked.reverse().forEach(function (node) {
            var _a;
            (_a = node.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(node);
            _this.div.appendChild(node);
        });
        return AppendBlockResult.Appended;
    };
    DivBlock.prototype.moveLastToNext = function (doc) {
        return MoveLastToNextResult.CannotMove;
    };
    DivBlock.prototype.wouldBeEmptyIfDetached = function (els) {
        return this.div.firstElementChild != null && els.includes(this.div.firstElementChild);
    };
    return DivBlock;
}(Block));
var WideBlock = /** @class */ (function (_super) {
    __extends(WideBlock, _super);
    function WideBlock() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    WideBlock.buildWide = function (doc, identifier) {
        var _a;
        var classNames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classNames[_i - 2] = arguments[_i];
        }
        var withSpan = classNames.includes(COL_SPAN_ALL) ? classNames : (_a = [COL_SPAN_ALL]).concat.apply(_a, classNames);
        return new WideBlock(doc.div.apply(doc, withSpan), identifier);
    };
    WideBlock.prototype.appendNode = function (doc) {
        var nodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            nodes[_i - 1] = arguments[_i];
        }
        if (!Block.needsSpanAll(nodes[nodes.length - 1])) {
            return AppendBlockResult.Full;
        }
        return _super.prototype.appendNode.apply(this, __spreadArrays([doc], nodes));
    };
    return WideBlock;
}(DivBlock));
var MultiTargetBlock = /** @class */ (function (_super) {
    __extends(MultiTargetBlock, _super);
    function MultiTargetBlock(wrapper, writeBlock, identifier) {
        var _this = _super.call(this, identifier) || this;
        _this.wrapper = wrapper;
        _this.writeBlock = writeBlock;
        return _this;
    }
    Object.defineProperty(MultiTargetBlock.prototype, "lastAppendedElement", {
        get: function () {
            return this.writeBlock == null ? undefined : this.writeBlock.lastAppendedElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(MultiTargetBlock.prototype, "outerElement", {
        get: function () {
            return this.wrapper;
        },
        enumerable: false,
        configurable: true
    });
    MultiTargetBlock.prototype.appendNode = function (doc) {
        var nodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            nodes[_i - 1] = arguments[_i];
        }
        var writer = this.writerForNodes.apply(this, nodes);
        if (writer == null) {
            var el = Block.elementsOf(nodes)[0];
            // console.debug(`appendNode ${this.identifier} No writer yet. Trying to build one for`, el);
            writer = this.buildBlockForEl(doc, el);
            if (writer == null) {
                console.error("appendNode " + this.identifier + " No writer to append to", nodes);
                return AppendBlockResult.Full;
            }
        }
        // console.debug(`appendNode ${this.identifier} delegating to ${this.writeBlock.identifier}`);
        return writer.appendNode.apply(writer, __spreadArrays([doc], nodes));
    };
    MultiTargetBlock.prototype.moveFrom = function (doc, linked, prevWriteBlock) {
        if (this.writeBlock == null) {
            console.error("moveFrom " + this.identifier + " missing writer");
            return AppendBlockResult.Skipped;
        }
        return this.writeBlock.moveFrom(doc, linked, prevWriteBlock);
    };
    MultiTargetBlock.prototype.moveLastToNext = function (doc, withMoved) {
        var last = this.lastAppendedElement;
        if (last == null) {
            // console.error(`moveLastToNext ${this.identifier} no last`);
            return MoveLastToNextResult.NoLast;
        }
        if (this.writeBlock == null) {
            // console.error(`moveLastToNext ${this.identifier} no writer`);
            return MoveLastToNextResult.CannotMove;
        }
        var prevWriteBlock = this.writeBlock;
        var prevDidMove = prevWriteBlock.moveLastToNext(doc);
        // console.debug(`moveLastToNext ${this.identifier} got ${prevDidMove} from ${prevWriteBlock.identifier}`);
        if (prevDidMove === MoveLastToNextResult.Moved || prevDidMove === MoveLastToNextResult.WouldBeEmpty) {
            return prevDidMove;
        }
        var linked = Block.collectLinkedTo(last);
        if (prevWriteBlock.wouldBeEmptyIfDetached(linked)) {
            // console.debug(`moveLastToNext ${this.identifier}: would be empty according to ${prevWriteBlock.identifier}`);
            return MoveLastToNextResult.WouldBeEmpty;
        }
        var nextWriteBlock = this.buildBlockForEl(doc, last);
        if (nextWriteBlock == null) {
            // console.debug(`moveLastToNext ${this.identifier}: no next`);
            return MoveLastToNextResult.CannotMove;
        }
        // console.debug(`${this.identifier}.moveLastToNext ${prevWriteBlock.identifier} => ${nextWriteBlock.identifier}`);
        var didAppend = nextWriteBlock.moveFrom(doc, linked, prevWriteBlock);
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
                throw new Error("Unhandled AppendBlockResult type: " + didAppend);
        }
    };
    MultiTargetBlock.prototype.wouldBeEmptyIfDetached = function (els) {
        return this.writeBlock == null || this.writeBlock.wouldBeEmptyIfDetached(els);
    };
    MultiTargetBlock.prototype.writerForNodes = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        return this.writeBlock;
    };
    return MultiTargetBlock;
}(Block));
var ColumnedBlock = /** @class */ (function (_super) {
    __extends(ColumnedBlock, _super);
    function ColumnedBlock(wrapper, left, right, gutter, identifier) {
        var _this = _super.call(this, wrapper, left, identifier) || this;
        _this.left = left;
        _this.right = right;
        _this.gutter = gutter;
        _this.nextGutterNumber = 1;
        _this.lastWriteBlock = right;
        return _this;
    }
    ColumnedBlock.buildColumned = function (doc, identifier) {
        var classNames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classNames[_i - 2] = arguments[_i];
        }
        var wrapper = doc.div.apply(doc, __spreadArrays(["columned-wrapper"], classNames));
        var left = DivBlock.buildDiv(doc, identifier + ".left", "columned-left");
        var right = DivBlock.buildDiv(doc, identifier + ".right", "columned-right");
        var gutter = DivBlock.buildDiv(doc, identifier + ".gutter", "columned-gutter");
        wrapper.appendChild(left.outerElement);
        wrapper.appendChild(right.outerElement);
        wrapper.appendChild(gutter.outerElement);
        return new ColumnedBlock(wrapper, left, right, gutter, identifier);
    };
    ColumnedBlock.prototype.appendNode = function (doc) {
        var nodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            nodes[_i - 1] = arguments[_i];
        }
        var prevEl = this.lastAppendedElement;
        var didAppend = _super.prototype.appendNode.apply(this, __spreadArrays([doc], nodes));
        if (didAppend === AppendBlockResult.Appended && prevEl != null && Block.isAside.apply(Block, nodes)) {
            var gutterId_1 = String(this.nextGutterNumber++);
            prevEl.setAttribute(DATA_GUTTER_REF, gutterId_1);
            Block.elementsOf(nodes).forEach(function (el) { return el.setAttribute(DATA_GUTTER_NUM, gutterId_1); });
        }
        return didAppend;
    };
    ColumnedBlock.prototype.buildBlockForEl = function (doc, el) {
        if (Block.isAside(el)) {
            if (this.lastAppendedElement != null) {
            }
            return this.gutter;
        }
        else if (this.writeBlock === this.left) {
            // console.debug(`buildBlockForEl ${this.identifier} Moving to right column`, el);
            this.writeBlock = this.right;
            return this.right;
        }
        return undefined;
    };
    ColumnedBlock.prototype.isEmpty = function () {
        return this.left.isEmpty() && this.right.isEmpty() && this.gutter.isEmpty();
    };
    ColumnedBlock.prototype.writerForNodes = function () {
        var nodes = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            nodes[_i] = arguments[_i];
        }
        return Block.isAside.apply(Block, nodes) ? this.gutter : this.writeBlock;
    };
    return ColumnedBlock;
}(MultiTargetBlock));
var PageManager = /** @class */ (function (_super) {
    __extends(PageManager, _super);
    function PageManager(wrapper, firstPage, identifier) {
        var _this = _super.call(this, wrapper, firstPage, identifier) || this;
        _this.lastWriteBlock = firstPage;
        _this.pages = [firstPage];
        _this.nextPageNumber = _this.pages.length + 1;
        return _this;
    }
    PageManager.buildPageManager = function (doc, identifier) {
        var classNames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classNames[_i - 2] = arguments[_i];
        }
        var pagesEl = doc.findOrCreate("#pages", function (p) {
            var _a;
            p.id = "pages";
            (_a = p.classList).add.apply(_a, classNames);
            document.body.prepend(p);
        });
        var firstPage = PageBlock.buildPage(doc, 1);
        pagesEl.appendChild(firstPage.outerElement);
        return new PageManager(pagesEl, firstPage, identifier);
    };
    PageManager.prototype.buildBlockForEl = function (doc, el) {
        // console.debug(`buildBlockForEl ${this.identifier} for `, el);
        var page = PageBlock.buildPage(doc, this.nextPageNumber++);
        this.pages.push(page);
        this.lastWriteBlock = page;
        this.wrapper.appendChild(page.outerElement);
        return page;
    };
    PageManager.prototype.isEmpty = function () {
        return this.pages.length === 0 || this.pages[0].isEmpty();
    };
    PageManager.prototype.moveLastToNext = function (doc) {
        return _super.prototype.moveLastToNext.call(this, doc, function (moved, fromBlock, toBlock) {
            Block.elementsOf(moved).forEach(function (el) {
                doc.extractFootnotes(el).forEach(function (footnote) {
                    toBlock.takeFootnote(footnote);
                });
            });
        });
    };
    return PageManager;
}(MultiTargetBlock));
var PageBlock = /** @class */ (function (_super) {
    __extends(PageBlock, _super);
    function PageBlock(wrapper, head, body, foot, identifier) {
        var _this = _super.call(this, identifier) || this;
        _this.wrapper = wrapper;
        _this.head = head;
        _this.body = body;
        _this.foot = foot;
        _this.blocks = [];
        return _this;
    }
    Object.defineProperty(PageBlock.prototype, "lastAppendedElement", {
        get: function () {
            return this.writeBlock == null ? undefined : this.writeBlock.lastAppendedElement;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PageBlock.prototype, "outerElement", {
        get: function () {
            return this.wrapper;
        },
        enumerable: false,
        configurable: true
    });
    PageBlock.buildPage = function (doc, pageNumber) {
        var classNames = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            classNames[_i - 2] = arguments[_i];
        }
        // console.debug(`New page: ${pageNumber}`);
        var page = doc.div.apply(doc, __spreadArrays(["page", pageNumber % 2 ? "page-odd" : "page-even"], classNames));
        page.id = "page-" + pageNumber;
        page.setAttribute(DATA_PAGE_NUMBER, String(pageNumber));
        var pageNumberDiv = document.createElement("DIV");
        pageNumberDiv.classList.add("page-number");
        pageNumberDiv.appendChild(doc.div("page-number-hex"));
        var pageNumberValue = doc.div("page-number-value");
        pageNumberValue.appendChild(document.createTextNode(String(pageNumber)));
        pageNumberDiv.appendChild(pageNumberValue);
        var head = doc.div("page-header");
        var body = doc.div("page-body");
        var foot = doc.div("page-footer");
        page.appendChild(pageNumberDiv);
        page.appendChild(body);
        page.appendChild(head);
        page.appendChild(foot);
        return new PageBlock(page, head, body, foot, page.id);
    };
    PageBlock.prototype.appendNode = function (doc) {
        var _this = this;
        var nodes = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            nodes[_i - 1] = arguments[_i];
        }
        // console.debug('Page.appendNode', nodes);
        var keep = Block.elementsOrTextOf(nodes);
        if (keep.length === 0) {
            return AppendBlockResult.Skipped;
        }
        var spanAll = !Block.isAside.apply(Block, nodes) && Block.needsSpanAll.apply(Block, nodes);
        var block = this.writeBlock;
        if (block == null || (block instanceof WideBlock && !spanAll) || (block instanceof ColumnedBlock && spanAll)) {
            block = spanAll ? WideBlock.buildWide(doc, this.identifier + "[" + this.blocks.length + "].wide") : ColumnedBlock.buildColumned(doc, this.identifier + "[" + this.blocks.length + "].columned");
            this.blocks.push(block);
            this.body.appendChild(block.outerElement);
            this.writeBlock = block;
        }
        var didAppend = block.appendNode.apply(block, __spreadArrays([doc], nodes));
        if (didAppend === AppendBlockResult.Appended) {
            Block.elementsOf(nodes).forEach(function (el) {
                doc.extractFootnotes(el).forEach(function (footnote) {
                    var _a;
                    (_a = footnote.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(footnote);
                    _this.foot.appendChild(footnote);
                });
            });
        }
        return didAppend;
    };
    PageBlock.prototype.isEmpty = function () {
        return this.blocks.length == 0 || this.blocks[0].isEmpty();
    };
    PageBlock.prototype.moveFrom = function (doc, linked, prevWriteBlock) {
        linked.forEach(function (n) { var _a; return (_a = n.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(n); });
        return this.appendNode.apply(this, __spreadArrays([doc], linked));
    };
    PageBlock.prototype.moveLastToNext = function (doc) {
        if (this.writeBlock instanceof ColumnedBlock) {
            // try to add to the existing block
            // console.debug(`moveLastToNext ${this.identifier} to existing ColumnedBlock`);
            return this.writeBlock.moveLastToNext(doc);
        }
        // wide blocks need a new page
        return MoveLastToNextResult.CannotMove;
    };
    PageBlock.prototype.takeFootnote = function (footnote) {
        var _a;
        (_a = footnote.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(footnote);
        this.foot.appendChild(footnote);
    };
    PageBlock.prototype.wouldBeEmptyIfDetached = function (els) {
        return this.writeBlock != null && this.writeBlock.wouldBeEmptyIfDetached(els) && this.blocks[0] === this.writeBlock;
    };
    return PageBlock;
}(Block));
var RenderingTask = /** @class */ (function () {
    function RenderingTask(title) {
        this.title = title;
    }
    RenderingTask.prototype.finish = function () {
    };
    RenderingTask.prototype.prepare = function () {
    };
    return RenderingTask;
}());
var OnceTask = /** @class */ (function (_super) {
    __extends(OnceTask, _super);
    function OnceTask(title, task, isComplete, estimatedCompletion) {
        if (isComplete === void 0) { isComplete = false; }
        if (estimatedCompletion === void 0) { estimatedCompletion = isComplete ? 1.0 : 0; }
        var _this = _super.call(this, title) || this;
        _this.task = task;
        _this.isComplete = isComplete;
        _this.estimatedCompletion = 0;
        _this.estimatedCompletion = estimatedCompletion;
        return _this;
    }
    OnceTask.prototype.step = function () {
        this.errorMessage = this.task() || undefined;
        this.isComplete = true;
        this.estimatedCompletion = 1.0;
    };
    return OnceTask;
}(RenderingTask));
var RenderingTaskManager = /** @class */ (function () {
    function RenderingTaskManager() {
        var tasks = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            tasks[_i] = arguments[_i];
        }
        this.tasks = tasks;
    }
    RenderingTaskManager.prototype.start = function () {
        var todo = this.tasks.slice();
        var startTime = Date.now();
        var lastTask;
        function nextTask() {
            var task = todo[0];
            if (task == null) {
                console.debug("Done after " + (Date.now() - startTime) / 1000);
                return;
            }
            if (lastTask !== task) {
                console.debug("Prepare " + task.title);
                task.prepare();
            }
            lastTask = task;
            var okay = false;
            try {
                task.step();
                if (task.errorMessage == null) {
                    okay = true;
                }
                else {
                    console.error("Task " + task.title + " failed: ", task.errorMessage);
                }
            }
            catch (e) {
                console.error("Task " + task.title + " threw: ", e);
            }
            finally {
                if (task.isComplete) {
                    task.finish();
                    todo.shift();
                }
                if (okay) {
                    setTimeout(nextTask, 1);
                }
            }
        }
        setTimeout(nextTask, 1);
    };
    return RenderingTaskManager;
}());
window.addEventListener("load", function () {
    if (!document.body.classList.contains("print-module")) {
        // console.info("Not a printable module.");
        return;
    }
    var docHelper = new DocHelper(document);
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
    function adjustGutterItems() {
        document.querySelectorAll(".page").forEach(function (page) {
            page.querySelectorAll("[" + DATA_GUTTER_NUM + "]").forEach(function (aside) {
                var gutterId = aside.getAttribute(DATA_GUTTER_NUM) || "";
                var target = page.querySelector("[" + DATA_GUTTER_REF + "=\"" + gutterId + "\"]");
                var wrapper = target == null ? null : docHelper.nearestAncestorLike(target, function (el) { return el.classList.contains("columned-wrapper"); });
                console.log("Repositioning", aside, target);
                if (target == null || wrapper == null) {
                    console.error("Lost track of gutter target " + gutterId);
                    return;
                }
                var targetRect = target.getBoundingClientRect();
                var bodyRect = wrapper.getBoundingClientRect();
                var asideRect = aside.getBoundingClientRect();
                var fromTopOfTarget = 0;
                console.debug("target body aside", targetRect, bodyRect, asideRect);
                if (asideRect.height < targetRect.height) {
                    fromTopOfTarget = (targetRect.height - asideRect.height) / 2;
                    console.debug("centering", fromTopOfTarget);
                }
                var fromTopOfBody = targetRect.top - bodyRect.top;
                console.debug("fromTopOfBody", fromTopOfBody);
                // asideRect.top += fromTopOfTarget + fromTopOfBody;
                aside.style.top = Math.max(0, (fromTopOfTarget + fromTopOfBody)) + "px";
            });
        });
    }
    // noinspection JSUnusedLocalSymbols
    function markEmptyGutters() {
        document.querySelectorAll(".page-body").forEach(function (body) {
            var allEmpty = true;
            body.querySelectorAll(".columned-gutter").forEach(function (g) { return allEmpty = allEmpty && (g.childElementCount === 0); });
            if (allEmpty) {
                body.classList.add("empty-gutters");
            }
        });
    }
    var ReflowTask = /** @class */ (function (_super) {
        __extends(ReflowTask, _super);
        function ReflowTask() {
            var _this = _super.call(this, "Render print layout.") || this;
            _this.estimatedCompletion = 0;
            _this.isComplete = false;
            _this.pageManager = PageManager.buildPageManager(docHelper, "$");
            _this.todo = [];
            _this.totalCount = 0;
            return _this;
        }
        ReflowTask.prototype.prepare = function () {
            var _a;
            var _b;
            var content = document.getElementById("content");
            if (content == null) {
                this.errorMessage = "No #content";
                return;
            }
            var allChildren = [];
            content.childNodes.forEach(function (child) { return allChildren.push(child); });
            (_a = this.todo).push.apply(_a, allChildren.filter(function (child) {
                return child.nodeType === Node.ELEMENT_NODE || (child.nodeType === Node.TEXT_NODE && child.textContent != null && child.textContent.length > 0);
            }));
            (_b = content.parentNode) === null || _b === void 0 ? void 0 : _b.removeChild(content);
            this.totalCount = this.todo.length;
        };
        ReflowTask.prototype.step = function () {
            var lastContent = this.pageManager.lastAppendedElement;
            var lastPageBody = this.pageManager.lastWriteBlock.body;
            if (lastContent != null && lastPageBody != null) {
                // console.debug("Inspecting last content", lastContent);
                var lastContentBounds = lastContent.getBoundingClientRect();
                var lastBodyBounds = lastPageBody.getBoundingClientRect();
                var fromBottom = lastBodyBounds.bottom - lastContentBounds.bottom;
                // const reasons: string[] = [];
                var move = false;
                if (fromBottom < 0) {
                    // reasons.push(`Below Bottom ${fromBottom}`);
                    move = true;
                }
                var fromRight = lastBodyBounds.right - lastContentBounds.right;
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
                }
                else {
                    // console.debug("Seems okay", lastContent);
                }
            }
            var nextContent = this.todo.shift();
            if (nextContent == null) {
                this.isComplete = true;
                this.estimatedCompletion = 1.0;
            }
            else {
                this.pageManager.appendNode(docHelper, nextContent);
                this.estimatedCompletion = 1.0 - (this.todo.length / this.totalCount);
            }
        };
        return ReflowTask;
    }(RenderingTask));
    var taskManager = new RenderingTaskManager(new OnceTask("Clean up screen-centric structures, part 1.", function () {
        var _a;
        var moduleLinkParent = docHelper.moduleLink.parentNode;
        moduleLinkParent === null || moduleLinkParent === void 0 ? void 0 : moduleLinkParent.removeChild(docHelper.moduleLink);
        (_a = moduleLinkParent === null || moduleLinkParent === void 0 ? void 0 : moduleLinkParent.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(moduleLinkParent);
        document.body.appendChild(docHelper.moduleLink);
    }), new OnceTask("Identify major sections.", function () {
        document.querySelectorAll("[" + DATA_SOURCE_FILE + "]").forEach(function (wrapper) { return docHelper.unwrapSourceWrapper(wrapper); });
    }), new OnceTask("Identify block quote introductions.", function () {
        document.querySelectorAll("blockquote, details").forEach(function (bq) {
            var prev = bq.previousElementSibling;
            if (prev != null && prev.tagName.toUpperCase() === "P" && prev.lastChild != null && prev.lastChild.textContent != null && prev.lastChild.textContent.endsWith(":")) {
                prev.classList.add(AVOID_BREAK_AFTER);
            }
        });
    }), new OnceTask("Add page breaks at major headings.", function () {
        document.querySelectorAll("h1").forEach(function (h1) { return h1.classList.add(COL_SPAN_ALL, PAGE_BREAK_BEFORE); });
    }), new OnceTask("Ensure headings are not orphaned.", function () {
        document.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach(function (h) { return h.classList.add(AVOID_BREAK_AFTER); });
    }), new OnceTask("Reveal all spoilers.", function () {
        document.querySelectorAll("details").forEach(function (details) { return details.open = true; });
    }), new OnceTask("Let block quotes span columns and pages.", function () {
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
    }), new ReflowTask(), new OnceTask("Clean up screen-centric structures, part 2.", function () { return removeOldMainContent(); }), new OnceTask("Fix up page references.", function () { return fixPageRefs(); }), new OnceTask("Mark pages with empty gutters.", function () { return markEmptyGutters(); }), new OnceTask("Relocate sidebar blocks.", function () { return adjustGutterItems(); }));
    taskManager.start();
});
