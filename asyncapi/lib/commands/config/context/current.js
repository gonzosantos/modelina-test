"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const Context_1 = require("../../../models/Context");
class ContextCurrent extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { current, context } = yield (0, Context_1.getCurrentContext)();
            this.log(`${current}: ${context}`);
        });
    }
}
exports.default = ContextCurrent;
ContextCurrent.description = 'Shows the current context that is being used';
ContextCurrent.flags = {
    help: core_1.Flags.help({ char: 'h' })
};
