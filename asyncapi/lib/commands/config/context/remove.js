"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const Context_1 = require("../../../models/Context");
class ContextRemove extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args } = yield this.parse(ContextRemove);
            const contextName = args['context-name'];
            try {
                yield (0, Context_1.removeContext)(contextName);
                this.log(`${contextName} successfully deleted`);
            }
            catch (err) {
                this.error(err);
            }
        });
    }
}
exports.default = ContextRemove;
ContextRemove.description = 'Delete a context from the store';
ContextRemove.flags = {
    help: core_1.Flags.help({ char: 'h' })
};
ContextRemove.args = [
    { name: 'context-name', description: 'Name of the context to delete', required: true }
];
