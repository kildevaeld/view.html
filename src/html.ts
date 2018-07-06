import { isObject, isString, isElement, slice, matches } from '@viewjs/utils';
import { CSSStyleDeclarationOptions, DelegateEvent, unbubblebles } from './types';
import { addEventListener, removeEventListener, DomEventHandler } from './events';

interface DomDelegateEvent {
    event: string;
    listener: DomEventHandler;
    handler: any;
    selector: string;
}


const domDelegateEvents: Map<EventTarget, DomDelegateEvent> = new Map();


/**
 * Get value from HTML Elemement
 * 
 * @export
 * @param {HTMLElement} el 
 * @param {boolean} [coerce=false] 
 * @returns 
 */
export function getValue(el: HTMLElement, coerce: boolean = false) {
    const tagName = el.tagName.toLocaleLowerCase(),
        type = (<any>el).type,
        isInput = tagName, isCheckbox = /checkbox/.test(type),
        isSelect = /select/.test(el.nodeName);

    if (isCheckbox) {
        return Boolean((el as HTMLInputElement).checked);
    } else if (isSelect) {
        if (!coerce) return (el as HTMLInputElement).value || '';
        let option = (el as HTMLSelectElement).options[(el as HTMLSelectElement).selectedIndex];
        return { value: option.value, text: option.innerText };
    } else if (isInput) {
        const input = (el as HTMLInputElement)
        return input.value;
    }

    return el.textContent;

}

/**
 * Set value on an HTMLElmenet
 * 
 * @export
 * @param {HTMLElement} el 
 * @param {*} [value] 
 */
export function setValue(el: HTMLElement, value?: any) {
    const tagName = el.tagName.toLocaleLowerCase(),
        type = (<any>el).type,
        isInput = tagName, isCheckbox = /checkbox/.test(type),
        isRadio = /radio/.test(type),
        isRadioOrCheckbox = isRadio || isCheckbox,
        isSelect = /select/.test(el.nodeName);

    if (value == null) {
        value = "";
    }

    if (isRadioOrCheckbox) {
        if (isRadio) {
            if (String(value) === String((<any>el).value)) {
                (el as HTMLInputElement).checked = true;
            }
        } else {
            (el as HTMLInputElement).checked = value;
        }
    } else if (String(value) !== getValue(el)) {
        if (isInput || isSelect) {
            (el as HTMLInputElement).value = value;
        } else {
            el.innerHTML = value
        }
    }

}


const singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

function parseHTML(html: string): HTMLElement {
    let parsed = singleTag.exec(html);
    if (parsed) {
        return document.createElement(parsed[0]);
    }
    var div = document.createElement('div');
    div.innerHTML = html;
    var element = div.firstChild;
    return element as HTMLElement;
}

const domEvents: Map<Element, { event: string; callback: (e: Event) => void }[]> = new Map();


export class Html implements Iterable<Element> {

    static query(query: string | HTMLElement | Element | Html | ArrayLike<Html> | ArrayLike<Node>, context?: string | HTMLElement | ArrayLike<Node> | Element): Html {
        if (isString(context)) {
            context = document.querySelectorAll(<string>context);
        }
        let html: Html;
        let els: HTMLElement[] | undefined;
        if (isString(query)) {

            if (query.length > 0 && query[0] === '<' && query[query.length - 1] === ">"
                && query.length >= 3) {
                return new Html([parseHTML(query)]);
            }

            if (context) {
                if (context instanceof HTMLElement) {
                    els = slice(context.querySelectorAll(query));
                } else {
                    html = new Html(slice.call(context));
                    return html.find(query);
                }
            } else {
                els = slice(document.querySelectorAll(query));
            }
        } else if (query && query instanceof Element) {
            els = [query as HTMLElement];
        } else if (query && query instanceof NodeList) {
            els = slice(query) as any;
        } else if (query && Array.isArray(query)) {
            els = [];
            for (let i = 0, ii = query.length; i < ii; i++) {
                let e = query[i];
                if (e instanceof Html) {
                    els = els.concat(e._elements);
                } else if (e instanceof Node) {
                    els.push(e as HTMLElement);
                }
            }
        } else if (query && query instanceof Html) {
            return query;
        }

        return new Html(els);
    }

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

    private _elements: HTMLElement[];

    get length(): number {
        return this._elements.length;
    }

    constructor(el?: HTMLElement[] | HTMLElement) {
        if (el && !Array.isArray(el)) el = [el]
        this._elements = el || [];
    }

    get(n: number): HTMLElement | undefined {
        n = (n === undefined || n < 0) ? 0 : n;
        return n >= this.length ? undefined : this._elements[n];
    }

    addClass(str: string): Html {
        if (!str) return this;
        var split = str.split(' ');
        return this.forEach((e) => {
            e.classList.add(...split)
        });
    }

    removeClass(str: string): Html {
        if (!str) return this;
        var split = str.split(' ');
        return this.forEach((e) => {
            e.classList.remove(...split);
        });
    }

    hasClass(str: string): boolean {
        let split = str.split(' ');
        return this._elements.reduce<boolean>((p, c) => {
            return split.reduce<boolean>((pp, cc) => c.classList.contains(cc), false)
        }, false);
    }

    toggleClass(str: string): Html {
        if (!str) return this;
        var split = str.split(' ');
        this.forEach(m => {
            split.forEach(str => {
                if (m.classList.contains(str))
                    m.classList.remove(str);
                else m.classList.add(str);
            })
        });
        return this;
    }


    attr(key: string, value: string): Html;
    attr(key: string): string;
    attr(key: object): Html;
    attr(key: string | object, value?: any): any {
        let attr: any;
        if (typeof key === 'string' && value) {
            attr = { [key]: value };
        } else if (typeof key == 'string') {
            if (this.length) return this.get(0)!.getAttribute(<string>key);
        } else if (isObject(key)) {
            attr = key;
        }
        return this.forEach(e => {
            for (let k in attr) {
                e.setAttribute(k, attr[k]);
            }
        });
    }

    removeAttr(key: string) {
        return this.forEach(e => {
            e.removeAttribute(key);
        });
    }

    text(): string;
    text(str: string): Html;
    text(str?: string): any {
        if (arguments.length === 0) {
            return this.length > 0 ? this.get(0)!.textContent : null;
        }
        return this.forEach(e => e.textContent = str || '');
    }

    html(): string;
    html(html: string): Html;
    html(html?: any): any {
        if (arguments.length === 0) {
            return this.length > 0 ? this.get(0)!.innerHTML : null;
        }
        return this.forEach(e => e.innerHTML = html);
    }

    val(): string;
    val(val: any): Html;
    val(val?: any): any {
        if (arguments.length === 0) {
            return this.length > 0 ? getValue(this.get(0)!) : null;
        }
        return this.forEach(e => setValue(e, val));
    }


    css(attr: string | CSSStyleDeclarationOptions, value?: any) {
        if (isString(attr)) {
            return this.forEach(e => {
                if (attr in e.style) e.style[attr as any] = String(value);
            });
        } else {
            return this.forEach(e => {
                for (let k in attr) {
                    if (k in e.style) (e.style as any)[k] = attr[k] || null;
                }
            });
        }

    }

    parent(): Html {
        var out: any[] = [];
        this.forEach(e => {
            if (e.parentElement) {
                out.push(e.parentElement);
            }
        })
        return new Html(out);
    }

    remove(): Html {
        return this.forEach(e => {
            if (e.parentElement) e.parentElement.removeChild(e);
        })
    }

    focus() {
        return this.forEach(e => {
            e.focus();
        });
    }

    clone(): Html {
        return new Html(this.map(m => m.cloneNode() as HTMLElement))
    }

    find(str: string): Html {
        var out: any = [];
        this.forEach(e => {
            out = out.concat(slice.call(e.querySelectorAll(str)));
        });
        return new Html(out);
    }

    map<T>(fn: (elm: HTMLElement, index?: number) => T): T[] {
        let out: T[] = new Array(this.length)
        this.forEach((e, i) => {
            out[i] = fn(e, i);
        });
        return out;
    }

    filter(predicate: (elm: HTMLElement, index?: number) => boolean) {
        let out: HTMLElement[] = new Array(this.length)
        this.forEach((e, i) => {
            if (predicate(e, i))
                out.push(e);
        });
        return Html.query(out);
    }

    forEach(fn: (elm: HTMLElement, index: number) => void): Html {
        this._elements.forEach(fn);
        return this;
    }

    on(name: string, callback: DomEventHandler, useCap?: boolean | EventListenerOptions, ctx?: any) {
        return this.forEach(e => {
            addEventListener(e, name, callback, useCap, ctx);
        });
    }

    once(name: string, callback: (e: Event) => void, useCap?: boolean | EventListenerOptions, ctx?: any) {
        return this.forEach(e => {
            addEventListener(e, name, callback, useCap, ctx, true);
        })
    }

    off(name?: string, callback?: (e: Event) => void, ctx?: any) {
        return this.forEach(e => {
            removeEventListener(e, name, callback, ctx);
        });
    }

    delegate<E extends Element>(selector: string, eventName: string, listener?: (e: DelegateEvent<E>) => void, ctx?: any) {

        return this.forEach(el => {
            let root = el;
            let handler = selector ? function (e: DelegateEvent) {
                let node = (e.target || e.srcElement) as Node | null;
                // Already handled
                if (e.delegateTarget) return;

                for (; node && node != root; node = node!.parentNode) {
                    if (node && matches((node as Element), selector as string)) {
                        e.delegateTarget = node as any;
                        listener!(e as any);
                    }
                }
            } : function (e: any) {
                if (e.delegateTarget) return;
                listener!(e);
            };

            let useCap = !!~unbubblebles.indexOf(eventName) && selector != null;
            //debug('%s delegate event %s ', this, eventName);
            el!.addEventListener(eventName, handler as any, useCap);

            domDelegateEvents.set(el, { event: eventName, handler: handler as any, listener: listener as any, selector: selector });
            //domDelegateEvents.push({ eventName: eventName, handler: handler, listener: listener, selector: selector });
            return handler;
        });



    }

    undelegate(selector: string, eventName?: string | Function, listener?: Function) {
        return this.forEach(el => {

            var item = domDelegateEvents.get(el);
            if (!item) return;

            var match = item.event === eventName &&
                (listener ? item.listener === listener : true) &&
                (selector ? item.selector === selector : true);

            if (!match) return;

            el!.removeEventListener(item.event, item.handler);

            domDelegateEvents.delete(el);

        });
    }

    // Iterator interface
    [Symbol.iterator]() {

        let pointer = 0;
        let components = this._elements;
        let len = components.length;
        return {
            next(): IteratorResult<HTMLElement> {
                let done = pointer >= len;
                return {
                    done: done,
                    value: done ? null : components[pointer++]
                } as any;
            }

        }
    }

}

export function html(query: string | HTMLElement | Element | Html | ArrayLike<Html> | ArrayLike<Node>, context?: string | HTMLElement | ArrayLike<Node> | Element): Html {
    return Html.query(query, context);
}