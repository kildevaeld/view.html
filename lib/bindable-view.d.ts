import { Constructor, IView } from 'view';
import { IModel, IModelView } from 'view.data';
import { IEventEmitter } from 'mixins.events';
export declare enum BindingDirection {
    ToView = 0,
    FromView = 1,
    Both = 2,
}
export interface BindingOptions {
    selector: string;
    direction?: BindingDirection;
}
export declare type Binding = string | BindingOptions;
export declare type BindingMap = {
    [key: string]: Binding;
};
export interface IBindableView<M extends IModel & IEventEmitter> {
    model?: M;
    bindings?: BindingMap;
}
export declare function withBindings<T extends Constructor<IModelView<M> & IView>, M extends IModel & IEventEmitter>(Base: T, bindings?: BindingMap): T & Constructor<IBindableView<M>>;
