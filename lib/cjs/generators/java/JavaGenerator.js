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
exports.JavaGenerator = void 0;
const AbstractGenerator_1 = require("../AbstractGenerator");
const models_1 = require("../../models");
const helpers_1 = require("../../helpers");
const JavaPreset_1 = require("./JavaPreset");
const ClassRenderer_1 = require("./renderers/ClassRenderer");
const EnumRenderer_1 = require("./renderers/EnumRenderer");
const Constants_1 = require("./Constants");
const __1 = require("../../");
const helpers_2 = require("../../helpers");
const JavaConstrainer_1 = require("./JavaConstrainer");
const Partials_1 = require("../../utils/Partials");
const JavaDependencyManager_1 = require("./JavaDependencyManager");
class JavaGenerator extends AbstractGenerator_1.AbstractGenerator {
    constructor(options) {
        const realizedOptions = JavaGenerator.getJavaOptions(options);
        super('Java', realizedOptions);
    }
    /**
     * Returns the Java options by merging custom options with default ones.
     */
    static getJavaOptions(options) {
        const optionsToUse = (0, Partials_1.mergePartialAndDefault)(JavaGenerator.defaultOptions, options);
        //Always overwrite the dependency manager unless user explicitly state they want it (ignore default temporary dependency manager)
        if ((options === null || options === void 0 ? void 0 : options.dependencyManager) === undefined) {
            optionsToUse.dependencyManager = () => {
                return new JavaDependencyManager_1.JavaDependencyManager(optionsToUse);
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
    splitMetaModel(model) {
        //These are the models that we have separate renderers for
        const metaModelsToSplit = {
            splitEnum: true,
            splitObject: true
        };
        return (0, helpers_1.split)(model, metaModelsToSplit);
    }
    constrainToMetaModel(model, options) {
        const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
        const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
        return (0, helpers_2.constrainMetaModel)(this.options.typeMapping, this.options.constraints, {
            metaModel: model,
            dependencyManager: dependencyManagerToUse,
            options: this.options,
            constrainedName: '' //This is just a placeholder, it will be constrained within the function
        });
    }
    /**
     * Render a scattered model, where the source code and library and model dependencies are separated.
     *
     * @param model
     * @param inputModel
     */
    render(model, inputModel, options) {
        const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
        if (model instanceof models_1.ConstrainedObjectModel) {
            return this.renderClass(model, inputModel, optionsToUse);
        }
        else if (model instanceof models_1.ConstrainedEnumModel) {
            return this.renderEnum(model, inputModel, optionsToUse);
        }
        __1.Logger.warn(`Java generator, cannot generate this type of model, ${model.name}`);
        return Promise.resolve(models_1.RenderOutput.toRenderOutput({
            result: '',
            renderedName: '',
            dependencies: []
        }));
    }
    /**
     * Render a complete model result where the model code, library and model dependencies are all bundled appropriately.
     *
     * For Java you need to specify which package the model is placed under.
     *
     * @param model
     * @param inputModel
     * @param options used to render the full output
     */
    renderCompleteModel(model, inputModel, completeModelOptions, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const completeModelOptionsToUse = (0, Partials_1.mergePartialAndDefault)(JavaGenerator.defaultCompleteModelOptions, completeModelOptions);
            const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            this.assertPackageIsValid(completeModelOptionsToUse);
            const outputModel = yield this.render(model, inputModel, optionsToUse);
            const modelDependencies = dependencyManagerToUse.renderAllModelDependencies(model, completeModelOptionsToUse.packageName);
            const outputContent = `package ${completeModelOptionsToUse.packageName};
${modelDependencies}
${outputModel.dependencies.join('\n')}
${outputModel.result}`;
            return models_1.RenderOutput.toRenderOutput({
                result: outputContent,
                renderedName: outputModel.renderedName,
                dependencies: outputModel.dependencies
            });
        });
    }
    assertPackageIsValid(options) {
        const reservedWords = options.packageName
            .split('.')
            .filter((subpackage) => (0, Constants_1.isReservedJavaKeyword)(subpackage, true));
        if (reservedWords.length > 0) {
            throw new Error(`You cannot use '${options.packageName}' as a package name, contains reserved keywords: [${reservedWords.join(', ')}]`);
        }
    }
    renderClass(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
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
    renderEnum(model, inputModel, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const optionsToUse = JavaGenerator.getJavaOptions(Object.assign(Object.assign({}, this.options), options));
            const dependencyManagerToUse = this.getDependencyManager(optionsToUse);
            const presets = this.getPresets('enum');
            const renderer = new EnumRenderer_1.EnumRenderer(optionsToUse, this, presets, model, inputModel, dependencyManagerToUse);
            const result = yield renderer.runSelfPreset();
            return models_1.RenderOutput.toRenderOutput({
                result,
                renderedName: model.name,
                dependencies: dependencyManagerToUse.dependencies
            });
        });
    }
}
exports.JavaGenerator = JavaGenerator;
JavaGenerator.defaultOptions = Object.assign(Object.assign({}, AbstractGenerator_1.defaultGeneratorOptions), { defaultPreset: JavaPreset_1.JAVA_DEFAULT_PRESET, collectionType: 'Array', typeMapping: JavaConstrainer_1.JavaDefaultTypeMapping, constraints: JavaConstrainer_1.JavaDefaultConstraints });
JavaGenerator.defaultCompleteModelOptions = {
    packageName: 'Asyncapi.Models'
};
//# sourceMappingURL=JavaGenerator.js.map