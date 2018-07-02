(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@viewjs/utils')) :
  typeof define === 'function' && define.amd ? define(['exports', '@viewjs/utils'], factory) :
  (factory((global.viewjs = global.viewjs || {}, global.viewjs.html = {}),global.viewjs.utils));
}(this, (function (exports,utils) { 'use strict';

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
      var _type = input.type; // switch (type) {
      //     case "number":
      //         return coerce ? ('valueAsNumber' in input) ? input.valueAsNumber : parseInt(input.value) : input.value;
      //     case "date":
      //         return coerce ? 'valueAsDate' in input ? input.valueAsDate : new Date(input.value) : input.value;
      //     default: return input.value;
      // }

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
  var singleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i,
      slice = Array.prototype.slice;

  function parseHTML(html) {
    var parsed = singleTag.exec(html);

    if (parsed) {
      return document.createElement(parsed[0]);
    }

    var div = document.createElement('div');
    div.innerHTML = html;
    var element = div.firstChild;
    return element;
  }

  var domEvents = new Map();

  var Html =
  /*#__PURE__*/
  function () {
    _createClass(Html, [{
      key: "length",
      get: function get() {
        return this._elements.length;
      }
    }], [{
      key: "query",
      value: function query(_query, context) {
        if (typeof context === 'string') {
          context = document.querySelectorAll(context);
        }

        var html;
        var els;

        if (typeof _query === 'string') {
          if (_query.length > 0 && _query[0] === '<' && _query[_query.length - 1] === ">" && _query.length >= 3) {
            return new Html([parseHTML(_query)]);
          }

          if (context) {
            if (context instanceof HTMLElement) {
              els = slice.call(context.querySelectorAll(_query));
            } else {
              html = new Html(slice.call(context));
              return html.find(_query);
            }
          } else {
            els = slice.call(document.querySelectorAll(_query));
          }
        } else if (_query && _query instanceof Element) {
          els = [_query];
        } else if (_query && _query instanceof NodeList) {
          els = slice.call(_query);
        } else if (_query && Array.isArray(_query)) {
          els = [];

          for (var i = 0, ii = _query.length; i < ii; i++) {
            var e = _query[i];

            if (e instanceof Html) {
              els = els.concat(e._elements);
            } else if (e instanceof Node) {
              els.push(e);
            }
          }
        } else if (_query && _query instanceof Html) {
          return _query;
        }

        return new Html(els);
      }
    }, {
      key: "removeAllEventListeners",
      value: function removeAllEventListeners() {
        domEvents.forEach(function (entries, el) {
          for (var i = 0, ii = entries.length; i < ii; i++) {
            var entry = entries[i];
            el.removeEventListener(entry.event, entry.callback);
          }

          domEvents.delete(el);
        });
      }
    }, {
      key: "_domEvents",
      value: function _domEvents() {
        return domEvents;
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
        if (arguments.length === 2) {
          return this.forEach(function (e) {
            if (attr in e.style) e.style[attr] = String(value);
          });
        } else {
          return this.forEach(function (e) {
            for (var k in attr) {
              if (k in e.style) e.style[k] = String(attr[k]);
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
          out = out.concat(slice.call(e.querySelectorAll(str)));
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
      key: "forEach",
      value: function forEach(fn) {
        this._elements.forEach(fn);

        return this;
      }
    }, {
      key: "on",
      value: function on(name, callback, useCap) {
        return this.forEach(function (e) {
          var entries = domEvents.get(e);

          if (!entries) {
            entries = [];
            domEvents.set(e, entries);
          }

          e.addEventListener(name, callback, useCap);
          entries.push({
            event: name,
            callback: callback
          });
        });
      }
    }, {
      key: "once",
      value: function once(name, callback, useCap) {
        var _this = this;

        return this.on(name, function (e) {
          callback(e);
          setTimeout(function () {
            return _this.off(name, callback);
          });
        }, useCap);
      }
    }, {
      key: "off",
      value: function off(name, callback) {
        if (!name) {
          return this.forEach(function (el) {
            var entries = domEvents.get(el);

            if (entries) {
              entries.forEach(function (e) {
                el.removeEventListener(e.event, e.callback);
              });
              domEvents.delete(el);
            }
          });
        }

        return this.forEach(function (el) {
          var entries = domEvents.get(el);
          if (!entries) return;
          entries.forEach(function (entry, index) {
            if (entry.event === name && (callback ? callback === entry.callback : true)) {
              domEvents.get(el).splice(index, 1);
            }
          });
          if (!domEvents.get(el).length) domEvents.delete(el);
        });
      } // Iterator

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
    return Html.query(query, context);
  }

  //export * from './bindable-view';

  exports.getValue = getValue;
  exports.setValue = setValue;
  exports.html = html;
  exports.Html = Html;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
