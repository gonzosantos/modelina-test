"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../../base"));
const Context_1 = require("../../../models/Context");
class ContextList extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const fileContent = yield (0, Context_1.loadContextFile)();
            for (const [contextName, filePath] of Object.entries(fileContent.store)) {
                this.log(`${contextName}: ${filePath}`);
            }
        });
    }
}
exports.default = ContextList;
ContextList.description = 'List all the stored context in the store';
ContextList.flags = {
    help: core_1.Flags.help({ char: 'h' })
};
