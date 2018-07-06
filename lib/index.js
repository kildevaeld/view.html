"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(require("./html"));
__export(require("./types"));
__export(require("./events"));
__export(require("./utils"));
const html_1 = require("./html");
const utils_1 = require("./utils");
function html(query, context) {
    return new html_1.Html(utils_1.normalize(query, context));
}
exports.html = html;
