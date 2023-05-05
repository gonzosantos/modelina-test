"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/ban-ts-comment */
const fs_1 = require("fs");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../base"));
const validation_error_1 = require("../errors/validation-error");
const SpecificationFile_1 = require("../models/SpecificationFile");
const specification_file_1 = require("../errors/specification-file");
const converter_1 = require("@asyncapi/converter");
// @ts-ignore
const specs_1 = tslib_1.__importDefault(require("@asyncapi/specs"));
const latestVersion = Object.keys(specs_1.default).pop();
class Convert extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args, flags } = yield this.parse(Convert);
            const filePath = args['spec-file'];
            let specFile;
            let convertedFile;
            let convertedFileFormatted;
            try {
                // LOAD FILE
                specFile = yield (0, SpecificationFile_1.load)(filePath);
                // CONVERSION
                convertedFile = (0, converter_1.convert)(specFile.text(), flags['target-version']);
                if (convertedFile) {
                    if (specFile.getFilePath()) {
                        this.log(`File ${specFile.getFilePath()} successfully converted!`);
                    }
                    else if (specFile.getFileURL()) {
                        this.log(`URL ${specFile.getFileURL()} successfully converted!`);
                    }
                }
                if (typeof convertedFile === 'object') {
                    convertedFileFormatted = JSON.stringify(convertedFile, null, 4);
                }
                else {
                    convertedFileFormatted = convertedFile;
                }
                if (flags.output) {
                    yield fs_1.promises.writeFile(`${flags.output}`, convertedFileFormatted, { encoding: 'utf8' });
                }
                else {
                    this.log(convertedFileFormatted);
                }
            }
            catch (err) {
                if (err instanceof specification_file_1.SpecificationFileNotFound) {
                    this.error(new validation_error_1.ValidationError({
                        type: 'invalid-file',
                        filepath: filePath
                    }));
                }
                else {
                    this.error(err);
                }
            }
        });
    }
}
exports.default = Convert;
Convert.description = 'Convert asyncapi documents older to newer versions';
Convert.flags = {
    help: core_1.Flags.help({ char: 'h' }),
    output: core_1.Flags.string({ char: 'o', description: 'path to the file where the result is saved' }),
    'target-version': core_1.Flags.string({ char: 't', description: 'asyncapi version to convert to', default: latestVersion })
};
Convert.args = [
    { name: 'spec-file', description: 'spec path, url, or context-name', required: false },
];
