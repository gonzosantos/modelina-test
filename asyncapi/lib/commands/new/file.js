"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const fs_1 = require("fs");
const base_1 = tslib_1.__importDefault(require("../../base"));
const inquirer = tslib_1.__importStar(require("inquirer"));
const Studio_1 = require("../../models/Studio");
const path_1 = require("path");
const { writeFile, readFile } = fs_1.promises;
const DEFAULT_ASYNCAPI_FILE_NAME = 'asyncapi.yaml';
const DEFAULT_ASYNCAPI_TEMPLATE = 'default-example.yaml';
class NewFile extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { flags } = yield this.parse(NewFile); // NOSONAR
            const isTTY = process.stdout.isTTY;
            if (!flags['no-tty'] && isTTY) {
                return this.runInteractive();
            }
            const fileName = flags['file-name'] || DEFAULT_ASYNCAPI_FILE_NAME;
            const template = flags['example'] || DEFAULT_ASYNCAPI_TEMPLATE;
            yield this.createAsyncapiFile(fileName, template);
            if (flags.studio) {
                if (isTTY) {
                    (0, Studio_1.start)(fileName, flags.port || Studio_1.DEFAULT_PORT);
                }
                else {
                    this.warn('Warning: --studio flag was passed but the terminal is not interactive. Ignoring...');
                }
            }
        });
    }
    /* eslint-disable sonarjs/cognitive-complexity */
    runInteractive() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { flags } = yield this.parse(NewFile); // NOSONAR
            let fileName = flags['file-name'];
            let selectedTemplate = flags['example'];
            let openStudio = flags.studio;
            let examples = [];
            const questions = [];
            if (!fileName) {
                questions.push({
                    name: 'filename',
                    message: 'name of the file?',
                    type: 'input',
                    default: DEFAULT_ASYNCAPI_FILE_NAME,
                });
            }
            try {
                const exampleFiles = yield readFile((0, path_1.resolve)(__dirname, '../../assets/examples/examples.json'), { encoding: 'utf8' });
                examples = JSON.parse(exampleFiles);
            }
            catch (error) {
                // no examples found
            }
            if (!selectedTemplate && examples.length > 0) {
                questions.push({
                    name: 'use-example',
                    message: 'would you like to start your new file from one of our examples?',
                    type: 'confirm',
                    default: true,
                });
                questions.push({
                    type: 'list',
                    name: 'selectedTemplate',
                    message: 'What example would you like to use?',
                    choices: examples,
                    when: (answers) => {
                        return answers['use-example'];
                    },
                });
            }
            if (openStudio === undefined) {
                questions.push({
                    name: 'studio',
                    message: 'open in Studio?',
                    type: 'confirm',
                    default: true,
                });
            }
            if (questions.length) {
                const answers = yield inquirer.prompt(questions);
                if (!fileName) {
                    fileName = answers.filename;
                }
                if (!selectedTemplate) {
                    selectedTemplate = answers.selectedTemplate;
                }
                if (openStudio === undefined) {
                    openStudio = answers.studio;
                }
            }
            fileName = fileName || DEFAULT_ASYNCAPI_FILE_NAME;
            selectedTemplate = selectedTemplate || DEFAULT_ASYNCAPI_TEMPLATE;
            yield this.createAsyncapiFile(fileName, selectedTemplate);
            if (openStudio) {
                (0, Studio_1.start)(fileName, flags.port || Studio_1.DEFAULT_PORT);
            }
        });
    }
    createAsyncapiFile(fileName, selectedTemplate) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const asyncApiFile = yield readFile((0, path_1.resolve)(__dirname, '../../../assets/examples/', selectedTemplate), { encoding: 'utf8' });
            const fileNameHasFileExtension = fileName.includes('.');
            const fileNameToWriteToDisk = fileNameHasFileExtension ? fileName : `${fileName}.yaml`;
            try {
                const content = yield readFile(fileNameToWriteToDisk, { encoding: 'utf8' });
                if (content !== undefined) {
                    console.log(`File ${fileNameToWriteToDisk} already exists. Ignoring...`);
                    return;
                }
            }
            catch (e) {
                // File does not exist. Proceed creating it...
            }
            yield writeFile(fileNameToWriteToDisk, asyncApiFile, { encoding: 'utf8' });
            console.log(`Created file ${fileNameToWriteToDisk}...`);
        });
    }
}
exports.default = NewFile;
NewFile.description = 'Creates a new asyncapi file';
NewFile.flags = {
    help: core_1.Flags.help({ char: 'h' }),
    'file-name': core_1.Flags.string({ char: 'n', description: 'name of the file' }),
    example: core_1.Flags.string({ char: 'e', description: 'name of the example to use' }),
    studio: core_1.Flags.boolean({ char: 's', description: 'open in Studio' }),
    port: core_1.Flags.integer({ char: 'p', description: 'port in which to start Studio' }),
    'no-tty': core_1.Flags.boolean({ description: 'do not use an interactive terminal' }),
};
