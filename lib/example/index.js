"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../index");
const view_1 = require("view");
const view_data_1 = require("view.data");
class Data extends view_data_1.Model {
}
class MainView extends index_1.withBindings(view_data_1.withModel(view_1.View)) {
}
exports.MainView = MainView;
