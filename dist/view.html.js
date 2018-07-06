(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@viewjs/utils')) :
  typeof define === 'function' && define.amd ? define(['exports', '@viewjs/utils'], factory) :
  (factory((global.viewjs = global.viewjs || {}, global.viewjs.html = {}),global.viewjs.utils));
}(this, (function (exports,utils) { 'use strict';

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
  }

  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

      return arr2;
    }
  }

  function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
  }

  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
  }

  var unbubblebles = 'focus blur change'.split(' ');

  var domEvents = new Map();
  function addEventListener(target, event, callback, useCap, ctx, once) {
    var entries = domEvents.get(target);

    if (!entries) {
      entries = [];
      domEvents.set(target, entries);
    }

    var bound = !ctx ? !once ? void 0 : function (e) {
      callback(e);
      removeEventListener(target, event, bound);
    } : function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      callback.apply(ctx, args);
      if (once) removeEventListener(target, event, bound, ctx);
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
  function removeEventListener(target, event, callback, ctx) {
    var entries = domEvents.get(target) || [];
    entries = entries.filter(function (m) {
      if ((!event || event === m.event) && (!callback || callback === m.callback) && (!ctx || ctx === m.ctx)) {
        target.removeEventListener(m.event, m.bound || m.callback, m.options);
        return false;
      }

      return true;
    });
    if (!entries.length) domEvents.delete(target);else domEvents.set(target, entries);
  }

  /**
   * Get value from HTML Elemement
   *
   * @export
   * @param {HTMLElement} el
   * @param {boolean} [coerce=false]
   * @returns
   */

  function getValue(el) {
    var coerce = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    var tagName = el.tagName.toLocaleLowerCase(),
        type = el.type,
        isInput = tagName,
        isCheckbox = /checkbox/.test(type),
        isSelect = /select/.test(el.nodeName);

    if (isCheckbox) {
      return Boolean(el.checked);
    } else if (isSelect) {
      if (!coerce) return el.value || '';
      var option = el.options[el.selectedIndex];
      return {
        value: option.value,
        text: option.innerText
      };
    } else if (isInput) {
      var input = el;
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

  function setValue(el, value) {
    var tagName = el.tagName.toLocaleLowerCase(),
        type = el.type,
        isInput = tagName,
        isCheckbox = /checkbox/.test(type),
        isRadio = /radio/.test(type),
        isRadioOrCheckbox = isRadio || isCheckbox,
        isSelect = /select/.test(el.nodeName);

    if (value == null) {
      value = "";
    }

    if (isRadioOrCheckbox) {
      if (isRadio) {
        if (String(value) === String(el.value)) {
          el.checked = true;
        }
      } else {
        el.checked = value;
      }
    } else if (String(value) !== getValue(el)) {
      if (isInput || isSelect) {
        el.value = value;
      } else {
        el.innerHTML = value;
      }
    }
  }
  var singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

  function parseHTML(html) {
    var parsed = singleTag.exec(html);

    if (parsed) {
      return [document.createElement(parsed[1])];
    }

    var div = document.createElement('div');
    div.innerHTML = html;
    return utils.slice(div.children);
  }

  function isArrayLike(item) {
    return Array.isArray(item) || !!item && _typeof(item) === "object" && typeof item.length === "number" && (item.length === 0 || item.length > 0 && item.length - 1 in item);
  }

  function normalize(query, context) {
    var out = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

    if (utils.isString(context)) {
      var q = document.querySelector(context);
      if (!q) throw new ReferenceError("could not resolve context " + context);
      context = q;
    }

    if (utils.isString(query)) {
      if (query.length > 0 && query[0] === '<' && query[query.length - 1] === ">" && query.length >= 3) {
        out.push.apply(out, _toConsumableArray(parseHTML(query)));
      } else {
        var o = (context ? context : document).querySelectorAll(query);
        out.push.apply(out, _toConsumableArray(o));
      }
    } else if (utils.isElement(query)) {
      out.push(query);
    } else if (query && query instanceof Html) {
      out.push.apply(out, _toConsumableArray(query));
    } else if (isArrayLike(query)) {
      for (var i = 0, ii = query.length; i < ii; i++) {
        normalize(query[i], context, out);
      }
    }

    return out;
  }

  var domDelegateEvents = new Map();
  var domEvents$1 = new Map();

  var Html =
  /*#__PURE__*/
  function () {
    _createClass(Html, [{
      key: "length",
      get: function get() {
        return this._elements.length;
      }
    }], [{
      key: "removeAllEventListeners",
      value: function removeAllEventListeners() {
        domEvents$1.forEach(function (entries, el) {
          for (var i = 0, ii = entries.length; i < ii; i++) {
            var entry = entries[i];
            el.removeEventListener(entry.event, entry.callback);
          }

          domEvents$1.delete(el);
        });
      }
    }, {
      key: "_domEvents",
      value: function _domEvents() {
        return domEvents$1;
      }
    }]);

    function Html(el) {
      _classCallCheck(this, Html);

      if (el && !Array.isArray(el)) el = [el];
      this._elements = el || [];
    }

    _createClass(Html, [{
      key: "get",
      value: function get(n) {
        n = n === undefined || n < 0 ? 0 : n;
        return n >= this.length ? undefined : this._elements[n];
      }
    }, {
      key: "addClass",
      value: function addClass(str) {
        if (!str) return this;
        var split = str.split(' ');
        return this.forEach(function (e) {
          var _e$classList;

          (_e$classList = e.classList).add.apply(_e$classList, _toConsumableArray(split));
        });
      }
    }, {
      key: "removeClass",
      value: function removeClass(str) {
        if (!str) return this;
        var split = str.split(' ');
        return this.forEach(function (e) {
          var _e$classList2;

          (_e$classList2 = e.classList).remove.apply(_e$classList2, _toConsumableArray(split));
        });
      }
    }, {
      key: "hasClass",
      value: function hasClass(str) {
        var split = str.split(' ');
        return this._elements.reduce(function (p, c) {
          return split.reduce(function (pp, cc) {
            return c.classList.contains(cc);
          }, false);
        }, false);
      }
    }, {
      key: "toggleClass",
      value: function toggleClass(str) {
        if (!str) return this;
        var split = str.split(' ');
        this.forEach(function (m) {
          split.forEach(function (str) {
            if (m.classList.contains(str)) m.classList.remove(str);else m.classList.add(str);
          });
        });
        return this;
      }
    }, {
      key: "attr",
      value: function attr(key, value) {
        var attr;

        if (typeof key === 'string' && value) {
          attr = _defineProperty({}, key, value);
        } else if (typeof key == 'string') {
          if (this.length) return this.get(0).getAttribute(key);
        } else if (utils.isObject(key)) {
          attr = key;
        }

        return this.forEach(function (e) {
          for (var k in attr) {
            e.setAttribute(k, attr[k]);
          }
        });
      }
    }, {
      key: "removeAttr",
      value: function removeAttr(key) {
        return this.forEach(function (e) {
          e.removeAttribute(key);
        });
      }
    }, {
      key: "text",
      value: function text(str) {
        if (arguments.length === 0) {
          return this.length > 0 ? this.get(0).textContent : null;
        }

        return this.forEach(function (e) {
          return e.textContent = str || '';
        });
      }
    }, {
      key: "html",
      value: function html(_html) {
        if (arguments.length === 0) {
          return this.length > 0 ? this.get(0).innerHTML : null;
        }

        return this.forEach(function (e) {
          return e.innerHTML = _html;
        });
      }
    }, {
      key: "val",
      value: function val(_val) {
        if (arguments.length === 0) {
          return this.length > 0 ? getValue(this.get(0)) : null;
        }

        return this.forEach(function (e) {
          return setValue(e, _val);
        });
      }
    }, {
      key: "css",
      value: function css(attr, value) {
        if (utils.isString(attr)) {
          return this.forEach(function (e) {
            if (attr in e.style) e.style[attr] = String(value);
          });
        } else {
          return this.forEach(function (e) {
            for (var k in attr) {
              if (k in e.style) e.style[k] = attr[k] || null;
            }
          });
        }
      }
    }, {
      key: "parent",
      value: function parent() {
        var out = [];
        this.forEach(function (e) {
          if (e.parentElement) {
            out.push(e.parentElement);
          }
        });
        return new Html(out);
      }
    }, {
      key: "remove",
      value: function remove() {
        return this.forEach(function (e) {
          if (e.parentElement) e.parentElement.removeChild(e);
        });
      }
    }, {
      key: "focus",
      value: function focus() {
        return this.forEach(function (e) {
          e.focus();
        });
      }
    }, {
      key: "clone",
      value: function clone() {
        return new Html(this.map(function (m) {
          return m.cloneNode();
        }));
      }
    }, {
      key: "find",
      value: function find(str) {
        var out = [];
        this.forEach(function (e) {
          out = out.concat(utils.slice(e.querySelectorAll(str)));
        });
        return new Html(out);
      }
    }, {
      key: "map",
      value: function map(fn) {
        var out = new Array(this.length);
        this.forEach(function (e, i) {
          out[i] = fn(e, i);
        });
        return out;
      }
    }, {
      key: "filter",
      value: function filter(predicate) {
        var out = new Array(this.length);
        this.forEach(function (e, i) {
          if (predicate(e, i)) out.push(e);
        });
        return new Html(out);
      }
    }, {
      key: "forEach",
      value: function forEach(fn) {
        this._elements.forEach(fn);

        return this;
      }
    }, {
      key: "on",
      value: function on(name, callback, useCap, ctx) {
        return this.forEach(function (e) {
          addEventListener(e, name, callback, useCap, ctx);
        });
      }
    }, {
      key: "once",
      value: function once(name, callback, useCap, ctx) {
        return this.forEach(function (e) {
          addEventListener(e, name, callback, useCap, ctx, true);
        });
      }
    }, {
      key: "off",
      value: function off(name, callback, ctx) {
        return this.forEach(function (e) {
          removeEventListener(e, name, callback, ctx);
        });
      }
    }, {
      key: "delegate",
      value: function delegate(selector, eventName, listener, ctx) {
        return this.forEach(function (el) {
          var root = el;
          var handler = selector ? function (e) {
            var node = e.target || e.srcElement; // Already handled

            if (e.delegateTarget) return;

            for (; node && node != root; node = node.parentNode) {
              if (node && utils.matches(node, selector)) {
                e.delegateTarget = node;
                listener(e);
              }
            }
          } : function (e) {
            if (e.delegateTarget) return;
            listener(e);
          };
          var useCap = !!~unbubblebles.indexOf(eventName) && selector != null; //debug('%s delegate event %s ', this, eventName);

          el.addEventListener(eventName, handler, useCap);
          domDelegateEvents.set(el, {
            event: eventName,
            handler: handler,
            listener: listener,
            selector: selector
          }); //domDelegateEvents.push({ eventName: eventName, handler: handler, listener: listener, selector: selector });

          return handler;
        });
      }
    }, {
      key: "undelegate",
      value: function undelegate(selector, eventName, listener) {
        return this.forEach(function (el) {
          var item = domDelegateEvents.get(el);
          if (!item) return;
          var match = item.event === eventName && (listener ? item.listener === listener : true) && (selector ? item.selector === selector : true);
          if (!match) return;
          el.removeEventListener(item.event, item.handler);
          domDelegateEvents.delete(el);
        });
      } // Iterator interface

    }, {
      key: Symbol.iterator,
      value: function value() {
        var pointer = 0;
        var components = this._elements;
        var len = components.length;
        return {
          next: function next() {
            var done = pointer >= len;
            return {
              done: done,
              value: done ? null : components[pointer++]
            };
          }
        };
      }
    }]);

    return Html;
  }();

  function html(query, context) {
    return new Html(normalize(query, context));
  }

  exports.html = html;
  exports.Html = Html;
  exports.unbubblebles = unbubblebles;
  exports.addEventListener = addEventListener;
  exports.removeEventListener = removeEventListener;
  exports.getValue = getValue;
  exports.setValue = setValue;
  exports.normalize = normalize;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
