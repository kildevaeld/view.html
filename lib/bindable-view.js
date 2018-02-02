"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BindingDirection;
(function (BindingDirection) {
    BindingDirection[BindingDirection["ToView"] = 0] = "ToView";
    BindingDirection[BindingDirection["FromView"] = 1] = "FromView";
    BindingDirection[BindingDirection["Both"] = 2] = "Both";
})(BindingDirection = exports.BindingDirection || (exports.BindingDirection = {}));
;
;
function withBindings(Base, bindings) {
    return class extends Base {
        constructor(...args) {
            super(...args);
            if (bindings)
                this.bindings = bindings;
        }
        // Overload
        setModel(model) {
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
        _delegateModelBindings(model) {
            if (!model || !this.bindings)
                return;
        }
        _undelegateModelBindings(model) {
            if (!model || !this.bindings)
                return;
        }
        destroy() {
            this._undelegateModelBindings();
            return super.destroy();
        }
    };
}
exports.withBindings = withBindings;
