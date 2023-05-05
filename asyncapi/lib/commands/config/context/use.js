"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const Context_1 = require("../../../models/Context");
class ContextUse extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args } = yield this.parse(ContextUse);
            const contextName = args['context-name'];
            yield (0, Context_1.setCurrentContext)(contextName);
            this.log(`${contextName} is set as current`);
        });
    }
}
exports.default = ContextUse;
ContextUse.description = 'Set a context as current';
ContextUse.flags = {
    help: core_1.Flags.help({ char: 'h' })
};
ContextUse.args = [
    { name: 'context-name', description: 'name of the saved context', required: true }
];
