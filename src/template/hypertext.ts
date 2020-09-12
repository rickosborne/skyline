import {JSX} from "preact";
import * as prettier from "prettier";

function realElement(jsx: any): jsx is JSX.Element {
	return jsx != null && typeof jsx !== "string" && typeof jsx !== "number" && typeof jsx !== "boolean";
}

function stringify(jsx: string | number | boolean | undefined): string {
	if (jsx == null) {
		return "";
	} else if (typeof jsx === "string") {
		return jsx;
	} else {
		return String(jsx);
	}
}

const IF_CHILDREN = "data-if-children";
const IF_PRESENT = "data-if-present";
const IF_SIBLINGS = "data-if-siblings";
const DATA_SPACE = "data-space";
const DATA_ENDL = "data-endl";
const DATA_TRIM = "data-trim";
const DATA_MARKDOWN = "data-markdown";
const DATA_NBSP = "data-nbsp";

const REMOVED = [
	IF_CHILDREN,
	IF_PRESENT,
	IF_SIBLINGS,
	DATA_SPACE,
	DATA_ENDL,
	DATA_TRIM,
	DATA_NBSP,
	"children"
];

const ATTR_RENAME: Record<string, string> = {
	"xmlns-xlink": "xmlns:xlink",
	"xlink-href": "xlink:href",
};

const REMOVED_IF_FALSY = [
	DATA_MARKDOWN,
];

const VOID_TAGS = [
	"br",
	"hr",
	"img"
];

export function html(
	jsx: JSX.Element | string | number | boolean | undefined,
	nested: boolean = false,
	parentDelim: string = "",
): string {
	if (!realElement(jsx)) {
		return stringify(jsx);
	}
	const props = jsx.props || {};
	const unwrap = !!props["data-unwrap"];
	const delim = props[DATA_NBSP] ? "&nbsp;" : props[DATA_ENDL] ? "\n" : props[DATA_SPACE] ? " " : props[DATA_TRIM] ? "" : parentDelim;
	const onlyIfChildren = !!props[IF_CHILDREN] || unwrap;
	if (IF_PRESENT in props) {
		const ifPresent = props[IF_PRESENT];
		if (!ifPresent || ifPresent === "") {
			return "";
		}
	}
	const attrs = Object.keys(props)
		.filter(key => !REMOVED.includes(key) && (!REMOVED_IF_FALSY.includes(key) || (props[key] && props[key] !== "0")))
		.map(key => ({target: key.replace(/^data-/, ""), value: jsx.props[key]}))
		.sort((a, b) => a.target.localeCompare(b.target))
		.map(attr => `${ATTR_RENAME[attr.target] || attr.target}="${attr.value}"`)
		.join(" ");
	const children = props.children;
	let innerHtml = "";
	if (children != null) {
		const rendered = (Array.isArray(children) ? children : [children])
			.map(child => ({
				mustKeep: realElement(child) && child.props != null ? !child.props[IF_SIBLINGS] : stringify(child) !== "",
				rendered: html(child, true, delim),
			}));
		if (rendered.findIndex(child => child.mustKeep && child.rendered !== "") >= 0) {
			innerHtml = rendered
				.map(child => child.rendered)
				.join(delim)
				.replace(/\s+([.,])/g, "$1")
			;
		} else {
			innerHtml = "";
		}
	}
	if (props[DATA_NBSP]) {
		innerHtml = innerHtml.replace(/\s+/g, "&nbsp;");
	}
	if (onlyIfChildren && innerHtml.match(/^\s*$/s)) {
		return "";
	}
	const endTag = VOID_TAGS.includes(String(jsx.type)) ? "" : `</${jsx.type}>`;
	const tag = unwrap ? innerHtml : `<${jsx.type}${attrs == null || attrs === "" ? "" : (" " + attrs)}>${innerHtml}${endTag}`;
	if (nested) {
		return tag;
	}
	try {
		return prettier.format(tag.replace(/\s+/sg, " "), {
			parser: "html",
			proseWrap: "never",
			useTabs: true,
			printWidth: 9999
		})
			.replace(/\n+$/, "")
			.replace(/(<(\w+)[^>]+markdown="1">)(.+?)<\/\2>/sg, (all, tag, tagName, body) => {
				return `${tag}\n${body}\n</${tagName}>`;
			});
	} catch (e) {
		throw e;
	}
}
