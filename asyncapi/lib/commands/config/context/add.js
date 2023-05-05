"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const Context_1 = require("../../../models/Context");
class ContextAdd extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args } = yield this.parse(ContextAdd);
            const contextName = args['context-name'];
            const specFilePath = args['spec-file-path'];
            yield (0, Context_1.addContext)(contextName, specFilePath);
            this.log(`Added context "${contextName}".\n\nYou can set it as your current context: asyncapi config context use ${contextName}\nYou can use this context when needed by passing ${contextName} as a parameter: asyncapi validate ${contextName}`);
        });
    }
}
exports.default = ContextAdd;
ContextAdd.description = 'Add or modify a context in the store';
ContextAdd.flags = {
    help: core_1.Flags.help({ char: 'h' })
};
ContextAdd.args = [
    { name: 'context-name', description: 'context name', required: true },
    { name: 'spec-file-path', description: 'file path of the spec file', required: true }
];
