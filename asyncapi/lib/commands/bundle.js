"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../base"));
const bundler_1 = tslib_1.__importDefault(require("@asyncapi/bundler"));
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const SpecificationFile_1 = require("../models/SpecificationFile");
const { writeFile } = fs_1.promises;
class Bundle extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { argv, flags } = yield this.parse(Bundle);
            const output = flags.output;
            let baseFile;
            const outputFormat = path_1.default.extname(argv[0]);
            const AsyncAPIFiles = yield this.loadFiles(argv);
            if (flags.base) {
                baseFile = (yield (0, SpecificationFile_1.load)(flags.base)).text();
            }
            const document = yield (0, bundler_1.default)(AsyncAPIFiles, {
                referenceIntoComponents: flags['reference-into-components'],
                base: baseFile
            });
            if (!output) {
                if (outputFormat === '.yaml' || outputFormat === '.yml') {
                    this.log(document.yml());
                }
                else {
                    this.log(JSON.stringify(document.json()));
                }
            }
            else {
                const format = path_1.default.extname(output);
                if (format === '.yml' || format === '.yaml') {
                    yield writeFile(path_1.default.resolve(process.cwd(), output), document.yml(), {
                        encoding: 'utf-8',
                    });
                }
                if (format === '.json') {
                    yield writeFile(path_1.default.resolve(process.cwd(), output), document.json(), {
                        encoding: 'utf-8',
                    });
                }
                this.log(`Check out your shiny new bundled files at ${output}`);
            }
        });
    }
    loadFiles(filepaths) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const files = [];
            for (const filepath of filepaths) {
                const file = yield (0, SpecificationFile_1.load)(filepath);
                files.push(file.text());
            }
            return files;
        });
    }
}
exports.default = Bundle;
Bundle.description = 'bundle one or multiple asyncapi documents and their references together.';
Bundle.strict = false;
Bundle.examples = [
    'asyncapi bundle ./asyncapi.yaml > final-asyncapi.yaml',
    'asyncapi bundle ./asyncapi.yaml --output final-asyncapi.yaml',
    'asyncapi bundle ./asyncapi.yaml ./features.yaml --reference-into-components',
    'asyncapi bundle ./asyncapi.yaml ./features.yaml --base ./asyncapi.yaml --reference-into-components'
];
Bundle.flags = {
    help: core_1.Flags.help({ char: 'h' }),
    output: core_1.Flags.string({ char: 'o', description: 'The output file name. Omitting this flag the result will be printed in the console.' }),
    'reference-into-components': core_1.Flags.boolean({ char: 'r', description: 'Bundle the message $refs into components object.' }),
    base: core_1.Flags.string({ char: 'b', description: 'Path to the file which will act as a base. This is required when some properties are to needed to be overwritten.' }),
};
