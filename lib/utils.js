"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@viewjs/utils");
const html_1 = require("./html");
/**
 * Get value from HTML Elemement
 *
 * @export
 * @param {HTMLElement} el
 * @param {boolean} [coerce=false]
 * @returns
 */
function getValue(el, coerce = false) {
    const tagName = el.tagName.toLocaleLowerCase(), type = el.type, isInput = tagName, isCheckbox = /checkbox/.test(type), isSelect = /select/.test(el.nodeName);
    if (isCheckbox) {
        return Boolean(el.checked);
    }
    else if (isSelect) {
        if (!coerce)
            return el.value || '';
        let option = el.options[el.selectedIndex];
        return { value: option.value, text: option.innerText };
    }
    else if (isInput) {
        const input = el;
        return input.value;
    }
    return el.textContent;
}
exports.getValue = getValue;
/**
 * Set value on an HTMLElmenet
 *
 * @export
 * @param {HTMLElement} el
 * @param {*} [value]
 */
function setValue(el, value) {
    const tagName = el.tagName.toLocaleLowerCase(), type = el.type, isInput = tagName, isCheckbox = /checkbox/.test(type), isRadio = /radio/.test(type), isRadioOrCheckbox = isRadio || isCheckbox, isSelect = /select/.test(el.nodeName);
    if (value == null) {
        value = "";
    }
    if (isRadioOrCheckbox) {
        if (isRadio) {
            if (String(value) === String(el.value)) {
                el.checked = true;
            }
        }
        else {
            el.checked = value;
        }
    }
    else if (String(value) !== getValue(el)) {
        if (isInput || isSelect) {
            el.value = value;
        }
        else {
            el.innerHTML = value;
        }
    }
}
exports.setValue = setValue;
const singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;
function parseHTML(html) {
    let parsed = singleTag.exec(html);
    if (parsed) {
        return [document.createElement(parsed[1])];
    }
    var div = document.createElement('div');
    div.innerHTML = html;
    return utils_1.slice(div.children);
}
function isArrayLike(item) {
    return (Array.isArray(item) ||
        (!!item &&
            typeof item === "object" &&
            typeof (item.length) === "number" &&
            (item.length === 0 ||
                (item.length > 0 &&
                    (item.length - 1) in item))));
}
function isIterable(obj) {
    // checks for null and undefined
    if (obj == null) {
        return false;
    }
    return typeof obj[Symbol.iterator] === 'function';
}
function normalize(query, context, out = []) {
    if (utils_1.isString(context)) {
        let q = document.querySelector(context);
        if (!q)
            throw new ReferenceError("could not resolve context " + context);
        context = q;
    }
    if (utils_1.isString(query)) {
        if (query.length > 0 && query[0] === '<' && query[query.length - 1] === ">"
            && query.length >= 3) {
            out.push(...parseHTML(query));
        }
        else {
            const o = (context ? context : document).querySelectorAll(query);
            out.push(...o);
        }
    }
    else if (utils_1.isElement(query)) {
        out.push(query);
    }
    else if (query && query instanceof html_1.Html) {
        out.push(...query);
    }
    else if (isArrayLike(query)) {
        for (let i = 0, ii = query.length; i < ii; i++) {
            normalize(query[i], context, out);
        }
    }
    return out;
}
exports.normalize = normalize;
