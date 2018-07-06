"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const domEvents = new Map();
function addEventListener(target, event, callback, useCap, ctx, once) {
    let entries = domEvents.get(target);
    if (!entries) {
        entries = [];
        domEvents.set(target, entries);
    }
    const bound = !ctx ?
        !once ? void 0 : (e) => {
            callback(e);
            removeEventListener(target, event, bound);
        }
        :
            (...args) => {
                callback.apply(ctx, args);
                if (once)
                    removeEventListener(target, event, bound, ctx);
            };
    target.addEventListener(event, bound || callback, useCap);
    entries.push({
        event: event,
        callback: callback,
        ctx: ctx,
        bound: bound,
        options: useCap,
        once: !!once
    });
}
exports.addEventListener = addEventListener;
function removeEventListener(target, event, callback, ctx) {
    let entries = domEvents.get(target) || [];
    entries = entries.filter(m => {
        if ((!event || event === m.event) &&
            (!callback || callback === m.callback) &&
            (!ctx || ctx === m.ctx)) {
            target.removeEventListener(m.event, m.bound || m.callback, m.options);
            return false;
        }
        return true;
    });
    if (!entries.length)
        domEvents.delete(target);
    else
        domEvents.set(target, entries);
}
exports.removeEventListener = removeEventListener;
