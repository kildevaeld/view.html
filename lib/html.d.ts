/**
 * Get value from HTML Elemement
 *
 * @export
 * @param {HTMLElement} el
 * @param {boolean} [coerce=false]
 * @returns
 */
export declare function getValue(el: HTMLElement, coerce?: boolean): any;
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
    attr(key: Object): Html;
    removeAttr(key: string): Html;
    text(): string;
    text(str: string): Html;
    html(): string;
    html(html: string): Html;
    val(): string;
    val(val: any): Html;
    css(attr: string | any, value?: any): Html;
    parent(): Html;
    remove(): Html;
    clone(): Html;
    find(str: string): Html;
    map<T>(fn: (elm: HTMLElement, index?: number) => T): T[];
    forEach(fn: (elm: HTMLElement, index: number) => void): Html;
    on(name: string, callback: (e: Event) => void, useCap?: boolean): Html;
    once(name: string, callback: (e: Event) => void, useCap?: boolean): Html;
    off(name?: string, callback?: (e: Event) => void): Html;
    [Symbol.iterator](): {
        next(): IteratorResult<Element>;
    };
}
export declare function html(query: string | HTMLElement | Element | Html | ArrayLike<Html> | ArrayLike<Node>, context?: string | HTMLElement | ArrayLike<Node> | Element): Html;
