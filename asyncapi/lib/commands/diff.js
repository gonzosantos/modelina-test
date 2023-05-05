"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/* eslint-disable sonarjs/no-duplicate-string */
const core_1 = require("@oclif/core");
const diff = tslib_1.__importStar(require("@asyncapi/diff"));
const fs_1 = require("fs");
const SpecificationFile_1 = require("../models/SpecificationFile");
const base_1 = tslib_1.__importDefault(require("../base"));
const validation_error_1 = require("../errors/validation-error");
const specification_file_1 = require("../errors/specification-file");
const diff_error_1 = require("../errors/diff-error");
const globals_1 = require("../globals");
const flags_1 = require("../flags");
const parser_1 = require("../parser");
const { readFile } = fs_1.promises;
class Diff extends base_1.default {
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args, flags } = yield this.parse(Diff); // NOSONAR
            const firstDocumentPath = args['old'];
            const secondDocumentPath = args['new'];
            const outputFormat = flags['format'];
            const outputType = flags['type'];
            const overrideFilePath = flags['overrides'];
            const watchMode = flags['watch'];
            let firstDocument, secondDocument;
            try {
                firstDocument = yield (0, SpecificationFile_1.load)(firstDocumentPath);
                enableWatch(watchMode, {
                    spec: firstDocument,
                    handler: this,
                    handlerName: 'diff',
                    docVersion: 'old',
                    label: 'DIFF_OLD',
                });
            }
            catch (err) {
                if (err instanceof specification_file_1.SpecificationFileNotFound) {
                    this.error(new validation_error_1.ValidationError({
                        type: 'invalid-file',
                        filepath: firstDocumentPath,
                    }));
                }
                this.error(err);
            }
            try {
                secondDocument = yield (0, SpecificationFile_1.load)(secondDocumentPath);
                enableWatch(watchMode, {
                    spec: secondDocument,
                    handler: this,
                    handlerName: 'diff',
                    docVersion: 'new',
                    label: 'DIFF_NEW',
                });
            }
            catch (err) {
                if (err instanceof specification_file_1.SpecificationFileNotFound) {
                    this.error(new validation_error_1.ValidationError({
                        type: 'invalid-file',
                        filepath: secondDocumentPath,
                    }));
                }
                this.error(err);
            }
            let overrides = {};
            if (overrideFilePath) {
                try {
                    overrides = yield readOverrideFile(overrideFilePath);
                }
                catch (err) {
                    this.error(err);
                }
            }
            try {
                const parsed = yield parseDocuments(this, firstDocument, secondDocument, flags);
                if (!parsed) {
                    return;
                }
                const diffOutput = diff.diff(parsed.firstDocumentParsed.json(), parsed.secondDocumentParsed.json(), {
                    override: overrides,
                    outputType: outputFormat, // NOSONAR
                });
                if (outputFormat === 'json') {
                    this.outputJSON(diffOutput, outputType);
                }
                else if (outputFormat === 'yaml' || outputFormat === 'yml') {
                    this.outputYAML(diffOutput, outputType);
                }
                else {
                    this.log(`The output format ${outputFormat} is not supported at the moment.`);
                }
            }
            catch (error) {
                throw new validation_error_1.ValidationError({
                    type: 'parser-error',
                    err: error,
                });
            }
        });
    }
    outputJSON(diffOutput, outputType) {
        if (outputType === 'breaking') {
            this.log(JSON.stringify(diffOutput.breaking(), null, 2));
        }
        else if (outputType === 'non-breaking') {
            this.log(JSON.stringify(diffOutput.nonBreaking(), null, 2));
        }
        else if (outputType === 'unclassified') {
            this.log(JSON.stringify(diffOutput.unclassified(), null, 2));
        }
        else if (outputType === 'all') {
            this.log(JSON.stringify(diffOutput.getOutput(), null, 2));
        }
        else {
            this.log(`The output type ${outputType} is not supported at the moment.`);
        }
    }
    outputYAML(diffOutput, outputType) {
        if (outputType === 'breaking') {
            this.log(diffOutput.breaking());
        }
        else if (outputType === 'non-breaking') {
            this.log(diffOutput.nonBreaking());
        }
        else if (outputType === 'unclassified') {
            this.log(diffOutput.unclassified());
        }
        else if (outputType === 'all') {
            this.log(diffOutput.getOutput());
        }
        else {
            this.log(`The output type ${outputType} is not supported at the moment.`);
        }
    }
}
exports.default = Diff;
Diff.description = 'Find diff between two asyncapi files';
Diff.flags = Object.assign({ help: core_1.Flags.help({ char: 'h' }), format: core_1.Flags.string({
        char: 'f',
        description: 'format of the output',
        default: 'yaml',
        options: ['json', 'yaml', 'yml'],
    }), type: core_1.Flags.string({
        char: 't',
        description: 'type of the output',
        default: 'all',
        options: ['breaking', 'non-breaking', 'unclassified', 'all'],
    }), overrides: core_1.Flags.string({
        char: 'o',
        description: 'path to JSON file containing the override properties',
    }), watch: (0, flags_1.watchFlag)() }, (0, parser_1.validationFlags)({ logDiagnostics: false }));
Diff.args = [
    {
        name: 'old',
        description: 'old spec path, URL or context-name',
        required: true,
    },
    {
        name: 'new',
        description: 'new spec path, URL or context-name',
        required: true,
    },
];
function parseDocuments(command, firstDocument, secondDocument, flags) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { document: newFirstDocumentParsed, status: firstDocumentStatus } = yield (0, parser_1.parse)(command, firstDocument, flags);
        const { document: newSecondDocumentParsed, status: secondDocumentStatus } = yield (0, parser_1.parse)(command, secondDocument, flags);
        if (!newFirstDocumentParsed || !newSecondDocumentParsed || firstDocumentStatus === 'invalid' || secondDocumentStatus === 'invalid') {
            return;
        }
        const firstDocumentParsed = (0, parser_1.convertToOldAPI)(newFirstDocumentParsed);
        const secondDocumentParsed = (0, parser_1.convertToOldAPI)(newSecondDocumentParsed);
        return { firstDocumentParsed, secondDocumentParsed };
    });
}
/**
 * Reads the file from give path and parses it as JSON
 * @param path The path to override file
 * @returns The override object
 */
function readOverrideFile(path) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let overrideStringData;
        try {
            overrideStringData = yield readFile(path, { encoding: 'utf8' });
        }
        catch (err) {
            throw new diff_error_1.DiffOverrideFileError();
        }
        try {
            return JSON.parse(overrideStringData);
        }
        catch (err) {
            throw new diff_error_1.DiffOverrideJSONError();
        }
    });
}
/**
 * function to enable watchmode.
 * The function is abstracted here, to avoid eslint cognitive complexity error.
 */
const enableWatch = (status, watcher) => {
    if (status) {
        (0, globals_1.specWatcher)(watcher);
    }
};
