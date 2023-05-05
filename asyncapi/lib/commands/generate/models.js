"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const modelina_1 = require("@asyncapi/modelina");
const core_1 = require("@oclif/core");
const base_1 = tslib_1.__importDefault(require("../../base"));
const SpecificationFile_1 = require("../../models/SpecificationFile");
const parser_1 = require("../../parser");
var Languages;
(function (Languages) {
    Languages["typescript"] = "typescript";
    Languages["csharp"] = "csharp";
    Languages["golang"] = "golang";
    Languages["java"] = "java";
    Languages["javascript"] = "javascript";
    Languages["dart"] = "dart";
    Languages["python"] = "python";
    Languages["rust"] = "rust";
    Languages["kotlin"] = "kotlin";
})(Languages || (Languages = {}));
const possibleLanguageValues = Object.values(Languages).join(', ');
class Models extends base_1.default {
    /* eslint-disable sonarjs/cognitive-complexity */
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { args, flags } = yield this.parse(Models);
            const { tsModelType, tsEnumType, tsIncludeComments, tsModuleSystem, tsExportType, tsJsonBinPack, namespace, csharpAutoImplement, csharpArrayType, packageName, output } = flags;
            const { language, file } = args;
            const inputFile = (yield (0, SpecificationFile_1.load)(file)) || (yield (0, SpecificationFile_1.load)());
            const { document, status } = yield (0, parser_1.parse)(this, inputFile, flags);
            if (!document || status === 'invalid') {
                return;
            }
            modelina_1.Logger.setLogger({
                info: (message) => {
                    this.log(message);
                },
                debug: (message) => {
                    this.debug(message);
                },
                warn: (message) => {
                    this.warn(message);
                },
                error: (message) => {
                    this.error(message);
                },
            });
            let fileGenerator;
            let fileOptions = {};
            const presets = [];
            switch (language) {
                case Languages.typescript:
                    if (tsIncludeComments) {
                        presets.push(modelina_1.TS_DESCRIPTION_PRESET);
                    }
                    if (tsJsonBinPack) {
                        presets.push({
                            preset: modelina_1.TS_COMMON_PRESET,
                            options: {
                                marshalling: true
                            }
                        }, modelina_1.TS_JSONBINPACK_PRESET);
                    }
                    fileGenerator = new modelina_1.TypeScriptFileGenerator({
                        modelType: tsModelType,
                        enumType: tsEnumType,
                        presets
                    });
                    fileOptions = {
                        moduleSystem: tsModuleSystem,
                        exportType: tsExportType
                    };
                    break;
                case Languages.python:
                    fileGenerator = new modelina_1.PythonFileGenerator();
                    break;
                case Languages.rust:
                    fileGenerator = new modelina_1.RustFileGenerator();
                    break;
                case Languages.csharp:
                    if (namespace === undefined) {
                        throw new Error('In order to generate models to C#, we need to know which namespace they are under. Add `--namespace=NAMESPACE` to set the desired namespace.');
                    }
                    fileGenerator = new modelina_1.CSharpFileGenerator({
                        presets: csharpAutoImplement ? [
                            {
                                preset: modelina_1.CSHARP_DEFAULT_PRESET,
                                options: {
                                    autoImplementedProperties: true
                                }
                            }
                        ] : [],
                        collectionType: csharpArrayType
                    });
                    fileOptions = {
                        namespace
                    };
                    break;
                case Languages.golang:
                    if (packageName === undefined) {
                        throw new Error('In order to generate models to Go, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                    }
                    fileGenerator = new modelina_1.GoFileGenerator();
                    fileOptions = {
                        packageName
                    };
                    break;
                case Languages.java:
                    if (packageName === undefined) {
                        throw new Error('In order to generate models to Java, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                    }
                    fileGenerator = new modelina_1.JavaFileGenerator();
                    fileOptions = {
                        packageName
                    };
                    break;
                case Languages.javascript:
                    fileGenerator = new modelina_1.JavaScriptFileGenerator();
                    break;
                case Languages.dart:
                    if (packageName === undefined) {
                        throw new Error('In order to generate models to Dart, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                    }
                    fileGenerator = new modelina_1.DartFileGenerator();
                    fileOptions = {
                        packageName
                    };
                    break;
                case Languages.kotlin:
                    if (packageName === undefined) {
                        throw new Error('In order to generate models to Kotlin, we need to know which package they are under. Add `--packageName=PACKAGENAME` to set the desired package name.');
                    }
                    fileGenerator = new modelina_1.KotlinFileGenerator();
                    fileOptions = {
                        packageName
                    };
                    break;
                default:
                    throw new Error(`Could not determine generator for language ${language}, are you using one of the following values ${possibleLanguageValues}?`);
            }
            if (output) {
                const models = yield fileGenerator.generateToFiles(document, output, Object.assign({}, fileOptions));
                const generatedModels = models.map((model) => { return model.modelName; });
                this.log(`Successfully generated the following models: ${generatedModels.join(', ')}`);
                return;
            }
            const models = yield fileGenerator.generateCompleteModels(document, Object.assign({}, fileOptions));
            const generatedModels = models.map((model) => {
                return `
## Model name: ${model.modelName}
${model.result}
`;
            });
            this.log(`Successfully generated the following models: ${generatedModels.join('\n')}`);
        });
    }
}
exports.default = Models;
Models.description = 'Generates typed models';
Models.args = [
    {
        name: 'language',
        description: 'The language you want the typed models generated for.',
        options: Object.keys(Languages),
        required: true
    },
    { name: 'file', description: 'Path or URL to the AsyncAPI document, or context-name', required: true },
];
Models.flags = Object.assign({ help: core_1.Flags.help({ char: 'h' }), output: core_1.Flags.string({
        char: 'o',
        description: 'The output directory where the models should be written to. Omitting this flag will write the models to `stdout`.',
        required: false
    }), 
    /**
     * TypeScript specific options
     */
    tsModelType: core_1.Flags.string({
        type: 'option',
        options: ['class', 'interface'],
        description: 'TypeScript specific, define which type of model needs to be generated.',
        required: false,
        default: 'class',
    }), tsEnumType: core_1.Flags.string({
        type: 'option',
        options: ['enum', 'union'],
        description: 'TypeScript specific, define which type of enums needs to be generated.',
        required: false,
        default: 'enum',
    }), tsModuleSystem: core_1.Flags.string({
        type: 'option',
        options: ['ESM', 'CJS'],
        description: 'TypeScript specific, define the module system to be used.',
        required: false,
        default: 'ESM',
    }), tsIncludeComments: core_1.Flags.boolean({
        description: 'TypeScript specific, if enabled add comments while generating models.',
        required: false,
        default: false,
    }), tsExportType: core_1.Flags.string({
        type: 'option',
        options: ['default', 'named'],
        description: 'TypeScript specific, define which type of export needs to be generated.',
        required: false,
        default: 'default',
    }), tsJsonBinPack: core_1.Flags.boolean({
        description: 'TypeScript specific, define basic support for serializing to and from binary with jsonbinpack.',
        required: false,
        default: false,
    }), 
    /**
     * Go and Java specific package name to use for the generated models
     */
    packageName: core_1.Flags.string({
        description: 'Go, Java and Kotlin specific, define the package to use for the generated models. This is required when language is `go`, `java` or `kotlin`.',
        required: false
    }), 
    /**
     * C# specific options
     */
    namespace: core_1.Flags.string({
        description: 'C# specific, define the namespace to use for the generated models. This is required when language is `csharp`.',
        required: false
    }), csharpAutoImplement: core_1.Flags.boolean({
        description: 'C# specific, define whether to generate auto-implemented properties or not.',
        required: false,
        default: false
    }), csharpArrayType: core_1.Flags.string({
        type: 'option',
        description: 'C# specific, define which type of array needs to be generated.',
        options: ['Array', 'List'],
        required: false,
        default: 'Array'
    }) }, (0, parser_1.validationFlags)({ logDiagnostics: false }));
