import { View, Constructor, triggerMethodOn, isString, isFunction, IView } from 'view';
import { IModel, IModelView } from 'view.data';
import { isEventEmitter, IEventEmitter } from 'mixins.events';

export enum BindingDirection {
    ToView, FromView, Both
};

export interface BindingOptions {
    selector: string;
    direction?: BindingDirection
};

export type Binding = string | BindingOptions;

export type BindingMap = { [key: string]: Binding };

export interface IBindableView<M extends IModel & IEventEmitter> {
    model?: M;
    bindings?: BindingMap;
}


export function withBindings<T extends Constructor<IModelView<M> & IView>, M extends IModel & IEventEmitter>(Base: T, bindings?: BindingMap): T & Constructor<IBindableView<M>> {
    return class extends Base {
        private bindings?: BindingMap;

        constructor(...args: any[]) {
            super(...args);
            if (bindings) this.bindings = bindings;
        }

        // Overload
        setModel(model?: M) {
            this._undelegateModelBindings(this.model);
            this.setModel(model);
            this._delegateModelBindings(model);
            return this;
        }

        render() {
            this._undelegateModelBindings();
            super.render();
            this._delegateModelBindings();

            return this;
        }


        _delegateModelBindings(model?: M) {
            if (!model || !this.bindings) return;

        }

        _undelegateModelBindings(model?: M) {
            if (!model || !this.bindings) return;
        }

        destroy() {
            this._undelegateModelBindings();
            return super.destroy();
        }

    }

}