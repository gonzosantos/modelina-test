"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const glee_1 = tslib_1.__importDefault(require("./glee"));
class NewProject extends glee_1.default {
    constructor(argv, config) {
        super(argv, config);
        this.commandName = 'project';
    }
}
exports.default = NewProject;
