import { Html } from './html';
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
export declare function normalize(query: string | HTMLElement | Element | Html | Node | ArrayLike<Html> | ArrayLike<Node> | ArrayLike<Element>, context?: string | Element, out?: Element[]): Array<HTMLElement>;
