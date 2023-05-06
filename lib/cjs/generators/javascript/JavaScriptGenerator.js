"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaScriptGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const JavaScriptPreset_1 = require("./JavaScriptPreset");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const __1 = require("../../");
const JavaScriptConstrainer_1 = require("./JavaScriptConstrainer");
const utils_1 = require("../../utils");
const JavaScriptDependencyManager_1 = require("./JavaScriptDependencyManager");
/**
 * Generator for JavaScript
 */
class JavaScriptGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = JavaScriptGenerator.getJavaScriptOptions(options);
        super('JavaScript', realizedOptions);
    }
    /**
     * Returns the JavaScript options by merging custom options with default ones.
     */
    static getJavaScriptOptions(options) {
        const optionsToUse = (0, utils_1.mergePartialAndDefault)(JavaScriptGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new JavaScriptDependencyManager_1.JavaScriptDependencyManager(optionsToUse);
            };
        }
        return optionsToUse;
    }
    /**
     * Wrapper to get an instance of the dependency manager
     */
    getDependencyManager(options) {
        return this.getDependencyManagerInstance(options);
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * @param model
     * @param inputModel
     * @param options
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    renderCompleteModel(model, inputModel, completeModelOptions, options) {
        return __awaiter(this, void 0, void 0, function* () {
            //const completeModelOptionsToUse = mergePartialAndDefault(JavaScriptGenerator.defaultCompleteModelOptions, completeModelOptions) as JavaScriptRenderCompleteModelOptions;
            const optionsToUse = JavaScriptGenerator.getJavaScriptOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const outputModel = yield this.render(model, inputModel);
            const modelDependencies = model.getNearestDependencies();
            //Ensure model dependencies have their rendered name
            const modelDependencyImports = modelDependencies.map((dependencyModel) => {
                return dependencyManagerToUse.renderDependency(dependencyModel.name, `./${dependencyModel.name}`);
            });
            let modelCode = `${outputModel.result}
export default ${outputModel.renderedName};
`;
            if (optionsToUse.moduleSystem === 'CJS') {
                modelCode = `${outputModel.result}
module.exports = ${outputModel.renderedName};`;
            }
            const outputContent = `${[
                ...modelDependencyImports,
                ...outputModel.dependencies
            ].join('\n')}

${modelCode}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    render(model, inputModel, options) {
        const optionsToUse = JavaScriptGenerator.getJavaScriptOptions(Object.assign(Object.assign({}, this.options), options));
        if (model instanceof models_1.ConstrainedObjectModel) {
            return this.renderClass(model, inputModel, optionsToUse);
        }
        __1.Logger.warn(`JS generator, cannot generate model for '${model.name}'`);
        return Promise.resolve(models_1.RenderOutput.toRenderOutput({
            result: '',
            renderedName: '',
            dependencies: []
        }));
    }
    splitMetaModel(model) {
        //These are the models that we have separate renderers for
        const metaModelsToSplit = {
            splitObject: true
        };
        return (0, helpers_1.split)(model, metaModelsToSplit);
    }
    constrainToMetaModel(model, options) {
        const optionsToUse = JavaScriptGenerator.getJavaScriptOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, helpers_1.constrainMetaModel)(this.options.typeMapping, this.options.constraints, {
            metaModel: model,
            dependencyManager: dependencyManagerToUse,
            options: this.options,
            constrainedName: '' //This is just a placeholder, it will be constrained within the function
        });
    }
    renderClass(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = JavaScriptGenerator.getJavaScriptOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('class');
            const renderer = new ClassRenderer_1.ClassRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
}
exports.JavaScriptGenerator = JavaScriptGenerator;
JavaScriptGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { defaultPreset: JavaScriptPreset_1.JS_DEFAULT_PRESET, typeMapping: JavaScriptConstrainer_1.JavaScriptDefaultTypeMapping, constraints: JavaScriptConstrainer_1.JavaScriptDefaultConstraints, moduleSystem: 'ESM' });
JavaScriptGenerator.defaultCompleteModelOptions = {};
//# sourceMappingURL=JavaScriptGenerator.js.map