"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../base"));
const parser_1 = require("../parser");
const SpecificationFile_1 = require("../models/SpecificationFile");
const globals_1 = require("../globals");
const flags_1 = require("../flags");
class Validate extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args, flags } = yield this.parse(Validate); //NOSONAR
            const filePath = args['spec-file'];
            const watchMode = flags.watch;
            const specFile = yield (0, SpecificationFile_1.load)(filePath);
            if (watchMode) {
                (0, globals_1.specWatcher)({ spec: specFile, handler: this, handlerName: 'validate' });
            }
            yield (0, parser_1.validate)(this, specFile, flags);
        });
    }
}
exports.default = Validate;
Validate.description = 'validate asyncapi file';
Validate.flags = Object.assign({ help: core_1.Flags.help({ char: 'h' }), watch: (0, flags_1.watchFlag)() }, (0, parser_1.validationFlags)());
Validate.args = [
    { name: 'spec-file', description: 'spec path, url, or context-name', required: false },
];
