export interface DomEventHandler {
    (e: Event): any;
}
export declare function addEventListener(target: EventTarget, event: string, callback: (event: Event) => void, useCap?: boolean | EventListenerOptions, ctx?: any, once?: boolean): void;
export declare function removeEventListener(target: EventTarget, event?: string, callback?: (event: Event) => void, ctx?: any): void;
