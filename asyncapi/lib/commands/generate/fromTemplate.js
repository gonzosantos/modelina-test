"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../base"));
// eslint-disable-next-line
// @ts-ignore
const generator_1 = tslib_1.__importDefault(require("@asyncapi/generator"));
const path_1 = tslib_1.__importDefault(require("path"));
const os_1 = tslib_1.__importDefault(require("os"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const SpecificationFile_1 = require("../../models/SpecificationFile");
const flags_1 = require("../../flags");
const generator_2 = require("../../utils/generator");
const validation_error_1 = require("../../errors/validation-error");
const generator_error_1 = require("../../errors/generator-error");
const red = (text) => `\x1b[31m${text}\x1b[0m`;
const magenta = (text) => `\x1b[35m${text}\x1b[0m`;
const yellow = (text) => `\x1b[33m${text}\x1b[0m`;
const green = (text) => `\x1b[32m${text}\x1b[0m`;
class Template extends base_1.default {
    constructor() {
        super(...arguments);
        this.getMapBaseUrlToFolderResolver = (urlToFolder) => {
            return {
                order: 1,
                canRead() {
                    return true;
                },
                read(file) {
                    const baseUrl = urlToFolder.url;
                    const baseDir = urlToFolder.folder;
                    return new Promise(((resolve, reject) => {
                        let localpath = file.url;
                        localpath = localpath.replace(baseUrl, baseDir);
                        try {
                            fs_1.default.readFile(localpath, (err, data) => {
                                if (err) {
                                    reject(`Error opening file "${localpath}"`);
                                }
                                else {
                                    resolve(data);
                                }
                            });
                        }
                        catch (err) {
                            reject(`Error opening file "${localpath}"`);
                        }
                    }));
                }
            };
        };
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args, flags } = yield this.parse(Template); // NOSONAR
            const asyncapi = args['asyncapi'];
            const template = args['template'];
            const output = flags.output || process.cwd();
            const parsedFlags = this.parseFlags(flags['disable-hook'], flags['param'], flags['map-base-url']);
            const options = {
                forceWrite: flags['force-write'],
                install: flags.install,
                debug: flags.debug,
                templateParams: parsedFlags.params,
                noOverwriteGlobs: flags['no-overwrite'],
                mapBaseUrlToFolder: parsedFlags.mapBaseUrlToFolder,
                disabledHooks: parsedFlags.disableHooks,
            };
            const watchTemplate = flags['watch'];
            const genOption = {};
            if (flags['map-base-url']) {
                genOption.resolve = { resolve: this.getMapBaseUrlToFolderResolver(parsedFlags.mapBaseUrlToFolder) };
            }
            yield this.generate(asyncapi, template, output, options, genOption);
            if (watchTemplate) {
                const watcherHandler = this.watcherHandler(asyncapi, template, output, options, genOption);
                yield this.runWatchMode(asyncapi, template, output, watcherHandler);
            }
        });
    }
    parseFlags(disableHooks, params, mapBaseUrl) {
        return {
            params: this.paramParser(params),
            disableHooks: this.disableHooksParser(disableHooks),
            mapBaseUrlToFolder: this.mapBaseURLParser(mapBaseUrl),
        };
    }
    paramParser(inputs) {
        if (!inputs) {
            return {};
        }
        const params = {};
        for (const input of inputs) {
            if (!input.includes('=')) {
                throw new Error(`Invalid param ${input}. It must be in the format of --param name1=value1 name2=value2 `);
            }
            const [paramName, paramValue] = input.split(/=(.+)/, 2);
            params[String(paramName)] = paramValue;
        }
        return params;
    }
    disableHooksParser(inputs) {
        if (!inputs) {
            return {};
        }
        const disableHooks = {};
        for (const input of inputs) {
            const [hookType, hookNames] = input.split(/=/);
            if (!hookType) {
                throw new Error('Invalid --disable-hook flag. It must be in the format of: --disable-hook <hookType> or --disable-hook <hookType>=<hookName1>,<hookName2>,...');
            }
            if (hookNames) {
                disableHooks[String(hookType)] = hookNames.split(',');
            }
            else {
                disableHooks[String(hookType)] = true;
            }
        }
        return disableHooks;
    }
    mapBaseURLParser(input) {
        if (!input) {
            return;
        }
        const mapBaseURLToFolder = {};
        const re = /(.*):(.*)/g; // NOSONAR
        let mapping = [];
        if ((mapping = re.exec(input)) === null || mapping.length !== 3) {
            throw new Error('Invalid --map-base-url flag. A mapping <url>:<folder> with delimiter : expected.');
        }
        mapBaseURLToFolder.url = mapping[1].replace(/\/$/, '');
        mapBaseURLToFolder.folder = path_1.default.resolve(mapping[2]);
        const isURL = /^https?:/;
        if (!isURL.test(mapBaseURLToFolder.url.toLowerCase())) {
            throw new Error('Invalid --map-base-url flag. The mapping <url>:<folder> requires a valid http/https url and valid folder with delimiter `:`.');
        }
        return mapBaseURLToFolder;
    }
    generate(asyncapi, template, output, options, genOption) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let specification;
            try {
                specification = yield (0, SpecificationFile_1.load)(asyncapi);
            }
            catch (err) {
                return this.error(new validation_error_1.ValidationError({
                    type: 'invalid-file',
                    filepath: asyncapi,
                }), { exit: 1 });
            }
            const generator = new generator_1.default(template, output || path_1.default.resolve(os_1.default.tmpdir(), 'asyncapi-generator'), options);
            core_1.CliUx.ux.action.start('Generation in progress. Keep calm and wait a bit');
            try {
                yield generator.generateFromString(specification.text(), genOption);
                core_1.CliUx.ux.action.stop();
            }
            catch (err) {
                core_1.CliUx.ux.action.stop('done\n');
                throw new generator_error_1.GeneratorError(err);
            }
            console.log(`${yellow('Check out your shiny new generated files at ') + magenta(output) + yellow('.')}\n`);
        });
    }
    runWatchMode(asyncapi, template, output, watchHandler) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const specification = yield (0, SpecificationFile_1.load)(asyncapi);
            const watchDir = path_1.default.resolve(template);
            const outputPath = path_1.default.resolve(watchDir, output);
            const transpiledTemplatePath = path_1.default.resolve(watchDir, generator_1.default.TRANSPILED_TEMPLATE_LOCATION);
            const ignorePaths = [outputPath, transpiledTemplatePath];
            const specificationFile = specification.getFilePath();
            // Template name is needed as it is not always a part of the cli commad
            // There is a use case that you run generator from a root of the template with `./` path
            let templateName = '';
            try {
                // eslint-disable-next-line
                templateName = require(path_1.default.resolve(watchDir, 'package.json')).name;
            }
            catch (err) {
                // intentional
            }
            let watcher;
            if (specificationFile) { // is local AsyncAPI file
                this.log(`[WATCHER] Watching for changes in the template directory ${magenta(watchDir)} and in the AsyncAPI file ${magenta(specificationFile)}`);
                watcher = new generator_2.Watcher([specificationFile, watchDir], ignorePaths);
            }
            else {
                this.log(`[WATCHER] Watching for changes in the template directory ${magenta(watchDir)}`);
                watcher = new generator_2.Watcher(watchDir, ignorePaths);
            }
            // Must check template in its installation path in generator to use isLocalTemplate function
            if (!(yield (0, generator_2.isLocalTemplate)(path_1.default.resolve(generator_1.default.DEFAULT_TEMPLATES_DIR, templateName)))) {
                this.warn(`WARNING: ${template} is a remote template. Changes may be lost on subsequent installations.`);
            }
            yield watcher.watch(watchHandler, (paths) => {
                this.error(`[WATCHER] Could not find the file path ${paths}, are you sure it still exists? If it has been deleted or moved please rerun the generator.`, {
                    exit: 1,
                });
            });
        });
    }
    watcherHandler(asyncapi, template, output, options, genOption) {
        return (changedFiles) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.clear();
            console.log('[WATCHER] Change detected');
            for (const [, value] of Object.entries(changedFiles)) {
                let eventText;
                switch (value.eventType) {
                    case 'changed':
                        eventText = green(value.eventType);
                        break;
                    case 'removed':
                        eventText = red(value.eventType);
                        break;
                    case 'renamed':
                        eventText = yellow(value.eventType);
                        break;
                    default:
                        eventText = yellow(value.eventType);
                }
                this.log(`\t${magenta(value.path)} was ${eventText}`);
            }
            try {
                yield this.generate(asyncapi, template, output, options, genOption);
            }
            catch (err) {
                throw new generator_error_1.GeneratorError(err);
            }
        });
    }
}
exports.default = Template;
Template.description = 'Generates whatever you want using templates compatible with AsyncAPI Generator.';
Template.examples = [
    'asyncapi generate fromTemplate asyncapi.yaml @asyncapi/html-template --param version=1.0.0 singleFile=true --output ./docs --force-write'
];
Template.flags = {
    help: core_1.Flags.help({ char: 'h' }),
    'disable-hook': core_1.Flags.string({
        char: 'd',
        description: 'Disable a specific hook type or hooks from a given hook type',
        multiple: true
    }),
    install: core_1.Flags.boolean({
        char: 'i',
        default: false,
        description: 'Installs the template and its dependencies (defaults to false)'
    }),
    debug: core_1.Flags.boolean({
        description: 'Enable more specific errors in the console'
    }),
    'no-overwrite': core_1.Flags.string({
        char: 'n',
        multiple: true,
        description: 'Glob or path of the file(s) to skip when regenerating'
    }),
    output: core_1.Flags.string({
        char: 'o',
        description: 'Directory where to put the generated files (defaults to current directory)',
    }),
    'force-write': core_1.Flags.boolean({
        default: false,
        description: 'Force writing of the generated files to given directory even if it is a git repo with unstaged files or not empty dir (defaults to false)'
    }),
    watch: (0, flags_1.watchFlag)('Watches the template directory and the AsyncAPI document, and re-generate the files when changes occur. Ignores the output directory.'),
    param: core_1.Flags.string({
        char: 'p',
        description: 'Additional param to pass to templates',
        multiple: true
    }),
    'map-base-url': core_1.Flags.string({
        description: 'Maps all schema references from base url to local folder'
    }),
};
Template.args = [
    { name: 'asyncapi', description: '- Local path, url or context-name pointing to AsyncAPI file', required: true },
    { name: 'template', description: '- Name of the generator template like for example @asyncapi/html-template or https://github.com/asyncapi/html-template', required: true }
];
