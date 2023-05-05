"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Outputs = exports.Optimizations = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const optimizer_1 = require("@asyncapi/optimizer");
const base_1 = tslib_1.__importDefault(require("../base"));
const validation_error_1 = require("../errors/validation-error");
const SpecificationFile_1 = require("../models/SpecificationFile");
const inquirer = tslib_1.__importStar(require("inquirer"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const fs_1 = require("fs");
const { writeFile } = fs_1.promises;
var Optimizations;
(function (Optimizations) {
    Optimizations["REMOVE_COMPONENTS"] = "remove-components";
    Optimizations["REUSE_COMPONENTS"] = "reuse-components";
    Optimizations["MOVE_TO_COMPONETS"] = "move-to-components";
})(Optimizations = exports.Optimizations || (exports.Optimizations = {}));
var Outputs;
(function (Outputs) {
    Outputs["TERMINAL"] = "terminal";
    Outputs["NEW_FILE"] = "new-file";
    Outputs["OVERWRITE"] = "overwrite";
})(Outputs = exports.Outputs || (exports.Outputs = {}));
class Optimize extends base_1.default {
    constructor() {
        super(...arguments);
        this.isInteractive = false;
    }
    run() {
        var _a, _b, _c, _d;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args, flags } = yield this.parse(Optimize); //NOSONAR
            const filePath = args['spec-file'];
            let specFile;
            let optimizer;
            let report;
            try {
                specFile = yield (0, SpecificationFile_1.load)(filePath);
                optimizer = new optimizer_1.Optimizer(specFile.text());
                report = yield optimizer.getReport();
            }
            catch (err) {
                this.error(new validation_error_1.ValidationError({
                    type: 'invalid-file',
                    filepath: filePath,
                }));
            }
            this.isInteractive = !flags['no-tty'];
            this.optimizations = flags.optimization;
            this.outputMethod = flags.output;
            if (!(((_a = report.moveToComponents) === null || _a === void 0 ? void 0 : _a.length) || ((_b = report.removeComponents) === null || _b === void 0 ? void 0 : _b.length) || ((_c = report.reuseComponents) === null || _c === void 0 ? void 0 : _c.length))) {
                this.log(`No optimization has been applied since ${(_d = specFile.getFilePath()) !== null && _d !== void 0 ? _d : specFile.getFileURL()} looks optimized!`);
                return;
            }
            const isTTY = process.stdout.isTTY;
            if (this.isInteractive && isTTY) {
                yield this.interactiveRun(report);
            }
            try {
                const optimizedDocument = optimizer.getOptimizedDocument({ rules: {
                        moveToComponents: this.optimizations.includes(Optimizations.MOVE_TO_COMPONETS),
                        removeComponents: this.optimizations.includes(Optimizations.REMOVE_COMPONENTS),
                        reuseComponents: this.optimizations.includes(Optimizations.REUSE_COMPONENTS)
                    }, output: optimizer_1.Output.YAML });
                const specPath = specFile.getFilePath();
                let newPath = '';
                if (specPath) {
                    const pos = specPath.lastIndexOf('.');
                    newPath = `${specPath.substring(0, pos)}_optimized.${specPath.substring(pos + 1)}`;
                }
                else {
                    newPath = 'optimized-asyncapi.yaml';
                }
                if (this.outputMethod === Outputs.TERMINAL) {
                    this.log(optimizedDocument);
                }
                else if (this.outputMethod === Outputs.NEW_FILE) {
                    yield writeFile(newPath, optimizedDocument, { encoding: 'utf8' });
                    this.log(`Created file ${newPath}...`);
                }
                else if (this.outputMethod === Outputs.OVERWRITE) {
                    yield writeFile(specPath !== null && specPath !== void 0 ? specPath : 'asyncapi.yaml', optimizedDocument, { encoding: 'utf8' });
                    this.log(`Created file ${newPath}...`);
                }
            }
            catch (error) {
                throw new validation_error_1.ValidationError({
                    type: 'parser-error',
                    err: error
                });
            }
        });
    }
    showOptimizations(elements) {
        if (!elements) {
            return;
        }
        for (let i = 0; i < elements.length; i++) {
            const element = elements[+i];
            if (element.action === 'move') {
                this.log(`${chalk_1.default.green('move')} ${element.path} to ${element.target} and reference it.`);
            }
            else if (element.action === 'reuse') {
                this.log(`${chalk_1.default.green('reuse')} ${element.target} in ${element.path}.`);
            }
            else if (element.action === 'remove') {
                this.log(`${chalk_1.default.red('remove')} ${element.path}.`);
            }
        }
        this.log('\n');
    }
    interactiveRun(report) {
        var _a, _b, _c, _d, _e, _f;
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const canMove = (_a = report.moveToComponents) === null || _a === void 0 ? void 0 : _a.length;
            const canRemove = (_b = report.removeComponents) === null || _b === void 0 ? void 0 : _b.length;
            const canReuse = (_c = report.reuseComponents) === null || _c === void 0 ? void 0 : _c.length;
            const choices = [];
            if (canMove) {
                const totalMove = (_d = report.moveToComponents) === null || _d === void 0 ? void 0 : _d.filter((e) => e.action === 'move').length;
                this.log(`\n${chalk_1.default.green(totalMove)} components can be moved to the components sections.\nthe following changes will be made:`);
                this.showOptimizations(report.moveToComponents);
                choices.push({ name: 'move to components section', value: Optimizations.MOVE_TO_COMPONETS });
            }
            if (canRemove) {
                const totalMove = (_e = report.removeComponents) === null || _e === void 0 ? void 0 : _e.length;
                this.log(`${chalk_1.default.green(totalMove)} unused components can be removed.\nthe following changes will be made:`);
                this.showOptimizations(report.removeComponents);
                choices.push({ name: 'remove components', value: Optimizations.REMOVE_COMPONENTS });
            }
            if (canReuse) {
                const totalMove = (_f = report.reuseComponents) === null || _f === void 0 ? void 0 : _f.length;
                this.log(`${chalk_1.default.green(totalMove)} components can be reused.\nthe following changes will be made:`);
                this.showOptimizations(report.reuseComponents);
                choices.push({ name: 'reuse components', value: Optimizations.REUSE_COMPONENTS });
            }
            const optimizationRes = yield inquirer.prompt([{
                    name: 'optimization',
                    message: 'select the type of optimization that you want to apply:',
                    type: 'checkbox',
                    default: 'all',
                    choices
                }]);
            this.optimizations = optimizationRes.optimization;
            const outputRes = yield inquirer.prompt([{
                    name: 'output',
                    message: 'where do you want to save the result:',
                    type: 'list',
                    default: 'log to terminal',
                    choices: [{ name: 'log to terminal', value: Outputs.TERMINAL }, { name: 'create new file', value: Outputs.NEW_FILE }, { name: 'update original', value: Outputs.OVERWRITE }]
                }]);
            this.outputMethod = outputRes.output;
        });
    }
}
exports.default = Optimize;
Optimize.description = 'optimize asyncapi specification file';
Optimize.examples = [
    'asyncapi optimize ./asyncapi.yaml',
    'asyncapi optimize ./asyncapi.yaml --no-tty',
    'asyncapi optimize ./asyncapi.yaml --optimization=remove-components,reuse-components,move-to-components --no-tty',
    'asyncapi optimize ./asyncapi.yaml --optimization=remove-components,reuse-components,move-to-components --output=terminal --no-tty',
];
Optimize.flags = {
    help: core_1.Flags.help({ char: 'h' }),
    optimization: core_1.Flags.string({ char: 'p', default: Object.values(Optimizations), options: Object.values(Optimizations), multiple: true, description: 'select the type of optimizations that you want to apply.' }),
    output: core_1.Flags.string({ char: 'o', default: Outputs.TERMINAL, options: Object.values(Outputs), description: 'select where you want the output.' }),
    'no-tty': core_1.Flags.boolean({ description: 'do not use an interactive terminal', default: false }),
};
Optimize.args = [
    { name: 'spec-file', description: 'spec path, url, or context-name', required: false },
];
