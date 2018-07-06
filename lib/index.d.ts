export * from './html';
export * from './types';
export * from './events';
export * from './utils';
import { Html } from './html';
export declare function html(query: string | HTMLElement | Element | Html | ArrayLike<Html> | ArrayLike<Node>, context?: string | HTMLElement | Element): Html;
