"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../base"));
const Studio_1 = require("../../models/Studio");
const SpecificationFile_1 = require("../../models/SpecificationFile");
class StartStudio extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { flags } = yield this.parse(StartStudio);
            const filePath = flags.file || (yield (0, SpecificationFile_1.load)()).getFilePath();
            const port = flags.port;
            (0, Studio_1.start)(filePath, port);
        });
    }
}
exports.default = StartStudio;
StartStudio.description = 'starts a new local instance of Studio';
StartStudio.flags = {
    help: core_1.Flags.help({ char: 'h' }),
    file: core_1.Flags.string({ char: 'f', description: 'path to the AsyncAPI file to link with Studio' }),
    port: core_1.Flags.integer({ char: 'p', description: 'port in which to start Studio' }),
};
StartStudio.args = [];
