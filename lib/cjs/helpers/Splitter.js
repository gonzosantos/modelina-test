"use strict";
/* eslint-disable sonarjs/cognitive-complexity */
Object.defineProperty(exports, "__esModule", { value: true });
exports.split = void 0;
const models_1 = require("../models");
/**
 * Try split the model
 * @param model
 * @param options
 * @param models
 * @returns whether the new or old MetaModel to use.
 */
const trySplitModel = (model, options, models) => {
    const shouldSplit = (options.splitEnum === true && model instanceof models_1.EnumModel) ||
        (options.splitUnion === true && model instanceof models_1.UnionModel) ||
        (options.splitArray === true && model instanceof models_1.ArrayModel) ||
        (options.splitTuple === true && model instanceof models_1.TupleModel) ||
        (options.splitString === true && model instanceof models_1.StringModel) ||
        (options.splitInteger === true && model instanceof models_1.IntegerModel) ||
        (options.splitFloat === true && model instanceof models_1.FloatModel) ||
        (options.splitBoolean === true && model instanceof models_1.BooleanModel) ||
        (options.splitObject === true && model instanceof models_1.ObjectModel) ||
        (options.splitDictionary === true && model instanceof models_1.DictionaryModel);
    if (shouldSplit) {
        if (!models.includes(model)) {
            models.push(model);
        }
        return new models_1.ReferenceModel(model.name, model.originalInput, model);
    }
    return model;
};
/**
 * Overwrite the nested models with references where required.
 *
 * @param model
 * @param options
 * @param models
 * @returns an array of all the split models
 */
const split = (model, options, models = [model], alreadySeenModels = []) => {
    if (!alreadySeenModels.includes(model)) {
        alreadySeenModels.push(model);
    }
    else {
        return models;
    }
    if (model instanceof models_1.ObjectModel) {
        for (const [prop, propModel] of Object.entries(model.properties)) {
            const propertyModel = propModel.property;
            model.properties[String(prop)].property = trySplitModel(propModel.property, options, models);
            (0, exports.split)(propertyModel, options, models, alreadySeenModels);
        }
    }
    else if (model instanceof models_1.UnionModel) {
        for (let index = 0; index < model.union.length; index++) {
            const unionModel = model.union[Number(index)];
            model.union[Number(index)] = trySplitModel(unionModel, options, models);
            (0, exports.split)(unionModel, options, models, alreadySeenModels);
        }
    }
    else if (model instanceof models_1.ArrayModel) {
        const valueModel = model.valueModel;
        model.valueModel = trySplitModel(valueModel, options, models);
        (0, exports.split)(valueModel, options, models, alreadySeenModels);
    }
    else if (model instanceof models_1.TupleModel) {
        for (const tuple of model.tuple) {
            const tupleModel = tuple.value;
            tuple.value = trySplitModel(tupleModel, options, models);
            (0, exports.split)(tupleModel, options, models, alreadySeenModels);
        }
    }
    else if (model instanceof models_1.DictionaryModel) {
        const keyModel = model.key;
        const valueModel = model.value;
        model.key = trySplitModel(keyModel, options, models);
        model.value = trySplitModel(valueModel, options, models);
        (0, exports.split)(keyModel, options, models, alreadySeenModels);
        (0, exports.split)(valueModel, options, models, alreadySeenModels);
    }
    return models;
};
exports.split = split;
//# sourceMappingURL=Splitter.js.map