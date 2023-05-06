"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const base_1 = tslib_1.__importDefault(require("../../base"));
const core_1 = require("@oclif/core");
class Generate extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const help = new core_1.Help(this.config);
            help.showHelp(['generate', '--help']);
        });
    }
}
exports.default = Generate;
Generate.description = 'Generate typed models or other things like clients, applications or docs using AsyncAPI Generator templates.';
