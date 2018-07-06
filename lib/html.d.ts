import { CSSStyleDeclarationOptions, DelegateEvent } from './types';
import { DomEventHandler } from './events';
/**
 * Get value from HTML Elemement
 *
 * @export
 * @param {HTMLElement} el
 * @param {boolean} [coerce=false]
 * @returns
 */
export declare function getValue(el: HTMLElement, coerce?: boolean): string | boolean | {
    value: string;
    text: string;
} | null;
/**
 * Set value on an HTMLElmenet
 *
 * @export
 * @param {HTMLElement} el
 * @param {*} [value]
 */
export declare function setValue(el: HTMLElement, value?: any): void;
export declare class Html implements Iterable<Element> {
    static query(query: string | HTMLElement | Element | Html | ArrayLike<Html> | ArrayLike<Node>, context?: string | HTMLElement | ArrayLike<Node> | Element): Html;
    static removeAllEventListeners(): void;
    static _domEvents(): Map<Element, {
        event: string;
        callback: (e: Event) => void;
    }[]>;
    private _elements;
    readonly length: number;
    constructor(el?: HTMLElement[] | HTMLElement);
    get(n: number): HTMLElement | undefined;
    addClass(str: string): Html;
    removeClass(str: string): Html;
    hasClass(str: string): boolean;
    toggleClass(str: string): Html;
    attr(key: string, value: string): Html;
    attr(key: string): string;
    attr(key: object): Html;
    removeAttr(key: string): Html;
    text(): string;
    text(str: string): Html;
    html(): string;
    html(html: string): Html;
    val(): string;
    val(val: any): Html;
    css(attr: string | CSSStyleDeclarationOptions, value?: any): Html;
    parent(): Html;
    remove(): Html;
    clone(): Html;
    find(str: string): Html;
    map<T>(fn: (elm: HTMLElement, index?: number) => T): T[];
    forEach(fn: (elm: HTMLElement, index: number) => void): Html;
    on(name: string, callback: DomEventHandler, useCap?: boolean | EventListenerOptions, ctx?: any): Html;
    once(name: string, callback: (e: Event) => void, useCap?: boolean | EventListenerOptions, ctx?: any): Html;
    off(name?: string, callback?: (e: Event) => void, ctx?: any): Html;
    delegate<E extends Element>(selector: string, eventName: string, listener?: (e: DelegateEvent<E>) => void, ctx?: any): Html;
    undelegate(selector: string, eventName?: string | Function, listener?: Function): Html;
    [Symbol.iterator](): {
        next(): IteratorResult<HTMLElement>;
    };
}
export declare function html(query: string | HTMLElement | Element | Html | ArrayLike<Html> | ArrayLike<Node>, context?: string | HTMLElement | ArrayLike<Node> | Element): Html;
