"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../../base"));
class Context extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const Help = yield (0, core_1.loadHelpClass)(this.config);
            const help = new Help(this.config);
            help.showHelp(['config', 'context', '--help']);
        });
    }
}
exports.default = Context;
