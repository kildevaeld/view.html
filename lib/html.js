"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@viewjs/utils");
const types_1 = require("./types");
const events_1 = require("./events");
const utils_2 = require("./utils");
const domDelegateEvents = new Map();
const domEvents = new Map();
class Html {
    static removeAllEventListeners() {
        domEvents.forEach((entries, el) => {
            for (let i = 0, ii = entries.length; i < ii; i++) {
                let entry = entries[i];
                el.removeEventListener(entry.event, entry.callback);
            }
            domEvents.delete(el);
        });
    }
    static _domEvents() {
        return domEvents;
    }
    get length() {
        return this._elements.length;
    }
    constructor(el) {
        if (el && !Array.isArray(el))
            el = [el];
        this._elements = el || [];
    }
    get(n) {
        n = (n === undefined || n < 0) ? 0 : n;
        return n >= this.length ? undefined : this._elements[n];
    }
    addClass(str) {
        if (!str)
            return this;
        var split = str.split(' ');
        return this.forEach((e) => {
            e.classList.add(...split);
        });
    }
    removeClass(str) {
        if (!str)
            return this;
        var split = str.split(' ');
        return this.forEach((e) => {
            e.classList.remove(...split);
        });
    }
    hasClass(str) {
        let split = str.split(' ');
        return this._elements.reduce((p, c) => {
            return split.reduce((pp, cc) => c.classList.contains(cc), false);
        }, false);
    }
    toggleClass(str) {
        if (!str)
            return this;
        var split = str.split(' ');
        this.forEach(m => {
            split.forEach(str => {
                if (m.classList.contains(str))
                    m.classList.remove(str);
                else
                    m.classList.add(str);
            });
        });
        return this;
    }
    attr(key, value) {
        let attr;
        if (typeof key === 'string' && value) {
            attr = { [key]: value };
        }
        else if (typeof key == 'string') {
            if (this.length)
                return this.get(0).getAttribute(key);
        }
        else if (utils_1.isObject(key)) {
            attr = key;
        }
        return this.forEach(e => {
            for (let k in attr) {
                e.setAttribute(k, attr[k]);
            }
        });
    }
    removeAttr(key) {
        return this.forEach(e => {
            e.removeAttribute(key);
        });
    }
    text(str) {
        if (arguments.length === 0) {
            return this.length > 0 ? this.get(0).textContent : null;
        }
        return this.forEach(e => e.textContent = str || '');
    }
    html(html) {
        if (arguments.length === 0) {
            return this.length > 0 ? this.get(0).innerHTML : null;
        }
        return this.forEach(e => e.innerHTML = html);
    }
    val(val) {
        if (arguments.length === 0) {
            return this.length > 0 ? utils_2.getValue(this.get(0)) : null;
        }
        return this.forEach(e => utils_2.setValue(e, val));
    }
    css(attr, value) {
        if (utils_1.isString(attr)) {
            return this.forEach(e => {
                if (attr in e.style)
                    e.style[attr] = String(value);
            });
        }
        else {
            return this.forEach(e => {
                for (let k in attr) {
                    if (k in e.style)
                        e.style[k] = attr[k] || null;
                }
            });
        }
    }
    parent() {
        var out = [];
        this.forEach(e => {
            if (e.parentElement) {
                out.push(e.parentElement);
            }
        });
        return new Html(out);
    }
    remove() {
        return this.forEach(e => {
            if (e.parentElement)
                e.parentElement.removeChild(e);
        });
    }
    focus() {
        return this.forEach(e => {
            e.focus();
        });
    }
    clone() {
        return new Html(this.map(m => m.cloneNode()));
    }
    find(str) {
        var out = [];
        this.forEach(e => {
            out = out.concat(utils_1.slice(e.querySelectorAll(str)));
        });
        return new Html(out);
    }
    map(fn) {
        let out = new Array(this.length);
        this.forEach((e, i) => {
            out[i] = fn(e, i);
        });
        return out;
    }
    filter(predicate) {
        let out = new Array(this.length);
        this.forEach((e, i) => {
            if (predicate(e, i))
                out.push(e);
        });
        return new Html(out);
    }
    forEach(fn) {
        this._elements.forEach(fn);
        return this;
    }
    on(name, callback, useCap, ctx) {
        return this.forEach(e => {
            events_1.addEventListener(e, name, callback, useCap, ctx);
        });
    }
    once(name, callback, useCap, ctx) {
        return this.forEach(e => {
            events_1.addEventListener(e, name, callback, useCap, ctx, true);
        });
    }
    off(name, callback, ctx) {
        return this.forEach(e => {
            events_1.removeEventListener(e, name, callback, ctx);
        });
    }
    delegate(selector, eventName, listener, ctx) {
        return this.forEach(el => {
            let root = el;
            let handler = selector ? function (e) {
                let node = (e.target || e.srcElement);
                // Already handled
                if (e.delegateTarget)
                    return;
                for (; node && node != root; node = node.parentNode) {
                    if (node && utils_1.matches(node, selector)) {
                        e.delegateTarget = node;
                        listener(e);
                    }
                }
            } : function (e) {
                if (e.delegateTarget)
                    return;
                listener(e);
            };
            let useCap = !!~types_1.unbubblebles.indexOf(eventName) && selector != null;
            //debug('%s delegate event %s ', this, eventName);
            el.addEventListener(eventName, handler, useCap);
            domDelegateEvents.set(el, { event: eventName, handler: handler, listener: listener, selector: selector });
            //domDelegateEvents.push({ eventName: eventName, handler: handler, listener: listener, selector: selector });
            return handler;
        });
    }
    undelegate(selector, eventName, listener) {
        return this.forEach(el => {
            var item = domDelegateEvents.get(el);
            if (!item)
                return;
            var match = item.event === eventName &&
                (listener ? item.listener === listener : true) &&
                (selector ? item.selector === selector : true);
            if (!match)
                return;
            el.removeEventListener(item.event, item.handler);
            domDelegateEvents.delete(el);
        });
    }
    // Iterator interface
    [Symbol.iterator]() {
        let pointer = 0;
        let components = this._elements;
        let len = components.length;
        return {
            next() {
                let done = pointer >= len;
                return {
                    done: done,
                    value: done ? null : components[pointer++]
                };
            }
        };
    }
}
exports.Html = Html;
