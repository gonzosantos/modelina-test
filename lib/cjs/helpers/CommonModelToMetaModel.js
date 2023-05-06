"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToTupleModel = exports.convertToArrayModel = exports.convertToObjectModel = exports.convertToDictionaryModel = exports.convertToBooleanModel = exports.convertToEnumModel = exports.convertToFloatModel = exports.convertToIntegerModel = exports.convertToAnyModel = exports.convertToStringModel = exports.convertToUnionModel = exports.convertToMetaModel = void 0;
const utils_1 = require("../utils");
const models_1 = require("../models");
function convertToMetaModel(jsonSchemaModel, alreadySeenModels = new Map()) {
    const hasModel = alreadySeenModels.has(jsonSchemaModel);
    if (hasModel) {
        return alreadySeenModels.get(jsonSchemaModel);
    }
    const modelName = jsonSchemaModel.$id || 'undefined';
    const unionModel = convertToUnionModel(jsonSchemaModel, modelName, alreadySeenModels);
    if (unionModel !== undefined) {
        return unionModel;
    }
    const anyModel = convertToAnyModel(jsonSchemaModel, modelName);
    if (anyModel !== undefined) {
        return anyModel;
    }
    const enumModel = convertToEnumModel(jsonSchemaModel, modelName);
    if (enumModel !== undefined) {
        return enumModel;
    }
    const objectModel = convertToObjectModel(jsonSchemaModel, modelName, alreadySeenModels);
    if (objectModel !== undefined) {
        return objectModel;
    }
    const dictionaryModel = convertToDictionaryModel(jsonSchemaModel, modelName, alreadySeenModels);
    if (dictionaryModel !== undefined) {
        return dictionaryModel;
    }
    const tupleModel = convertToTupleModel(jsonSchemaModel, modelName, alreadySeenModels);
    if (tupleModel !== undefined) {
        return tupleModel;
    }
    const arrayModel = convertToArrayModel(jsonSchemaModel, modelName, alreadySeenModels);
    if (arrayModel !== undefined) {
        return arrayModel;
    }
    const stringModel = convertToStringModel(jsonSchemaModel, modelName);
    if (stringModel !== undefined) {
        return stringModel;
    }
    const floatModel = convertToFloatModel(jsonSchemaModel, modelName);
    if (floatModel !== undefined) {
        return floatModel;
    }
    const integerModel = convertToIntegerModel(jsonSchemaModel, modelName);
    if (integerModel !== undefined) {
        return integerModel;
    }
    const booleanModel = convertToBooleanModel(jsonSchemaModel, modelName);
    if (booleanModel !== undefined) {
        return booleanModel;
    }
    utils_1.Logger.error('Failed to convert to MetaModel, defaulting to AnyModel');
    return new models_1.AnyModel(modelName, jsonSchemaModel.originalInput);
}
exports.convertToMetaModel = convertToMetaModel;
function isEnumModel(jsonSchemaModel) {
    if (!Array.isArray(jsonSchemaModel.enum)) {
        return false;
    }
    return true;
}
/**
 * Converts a CommonModel into multiple models wrapped in a union model.
 *
 * Because a CommonModel might contain multiple models, it's name for each of those models would be the same, instead we slightly change the model name.
 * Each model has it's type as a name prepended to the union name.
 *
 * If the CommonModel has multiple types
 */
// eslint-disable-next-line sonarjs/cognitive-complexity
function convertToUnionModel(jsonSchemaModel, name, alreadySeenModels) {
    const containsUnions = Array.isArray(jsonSchemaModel.union);
    const containsSimpleTypeUnion = Array.isArray(jsonSchemaModel.type) && jsonSchemaModel.type.length > 1;
    const containsAllTypes = Array.isArray(jsonSchemaModel.type) && jsonSchemaModel.type.length === 7;
    if ((!containsSimpleTypeUnion && !containsUnions) ||
        isEnumModel(jsonSchemaModel) ||
        containsAllTypes) {
        return undefined;
    }
    const unionModel = new models_1.UnionModel(name, jsonSchemaModel.originalInput, []);
    //cache model before continuing
    if (!alreadySeenModels.has(jsonSchemaModel)) {
        alreadySeenModels.set(jsonSchemaModel, unionModel);
    }
    // Has multiple types, so convert to union
    if (containsUnions && jsonSchemaModel.union) {
        for (const unionCommonModel of jsonSchemaModel.union) {
            const unionMetaModel = convertToMetaModel(unionCommonModel, alreadySeenModels);
            unionModel.union.push(unionMetaModel);
        }
        return unionModel;
    }
    // Has simple union types
    // Each must have a different name then the root union model, as it otherwise clashes when code is generated
    const enumModel = convertToEnumModel(jsonSchemaModel, `${name}_enum`);
    if (enumModel !== undefined) {
        unionModel.union.push(enumModel);
    }
    const objectModel = convertToObjectModel(jsonSchemaModel, `${name}_object`, alreadySeenModels);
    if (objectModel !== undefined) {
        unionModel.union.push(objectModel);
    }
    const dictionaryModel = convertToDictionaryModel(jsonSchemaModel, `${name}_dictionary`, alreadySeenModels);
    if (dictionaryModel !== undefined) {
        unionModel.union.push(dictionaryModel);
    }
    const tupleModel = convertToTupleModel(jsonSchemaModel, `${name}_tuple`, alreadySeenModels);
    if (tupleModel !== undefined) {
        unionModel.union.push(tupleModel);
    }
    const arrayModel = convertToArrayModel(jsonSchemaModel, `${name}_array`, alreadySeenModels);
    if (arrayModel !== undefined) {
        unionModel.union.push(arrayModel);
    }
    const stringModel = convertToStringModel(jsonSchemaModel, `${name}_string`);
    if (stringModel !== undefined) {
        unionModel.union.push(stringModel);
    }
    const floatModel = convertToFloatModel(jsonSchemaModel, `${name}_float`);
    if (floatModel !== undefined) {
        unionModel.union.push(floatModel);
    }
    const integerModel = convertToIntegerModel(jsonSchemaModel, `${name}_integer`);
    if (integerModel !== undefined) {
        unionModel.union.push(integerModel);
    }
    const booleanModel = convertToBooleanModel(jsonSchemaModel, `${name}_boolean`);
    if (booleanModel !== undefined) {
        unionModel.union.push(booleanModel);
    }
    return unionModel;
}
exports.convertToUnionModel = convertToUnionModel;
function convertToStringModel(jsonSchemaModel, name) {
    var _a;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('string'))) {
        return undefined;
    }
    return new models_1.StringModel(name, jsonSchemaModel.originalInput);
}
exports.convertToStringModel = convertToStringModel;
function convertToAnyModel(jsonSchemaModel, name) {
    if (!Array.isArray(jsonSchemaModel.type) ||
        jsonSchemaModel.type.length !== 7) {
        return undefined;
    }
    return new models_1.AnyModel(name, jsonSchemaModel.originalInput);
}
exports.convertToAnyModel = convertToAnyModel;
function convertToIntegerModel(jsonSchemaModel, name) {
    var _a;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('integer'))) {
        return undefined;
    }
    return new models_1.IntegerModel(name, jsonSchemaModel.originalInput);
}
exports.convertToIntegerModel = convertToIntegerModel;
function convertToFloatModel(jsonSchemaModel, name) {
    var _a;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('number'))) {
        return undefined;
    }
    return new models_1.FloatModel(name, jsonSchemaModel.originalInput);
}
exports.convertToFloatModel = convertToFloatModel;
function convertToEnumModel(jsonSchemaModel, name) {
    if (!isEnumModel(jsonSchemaModel)) {
        return undefined;
    }
    const metaModel = new models_1.EnumModel(name, jsonSchemaModel.originalInput, []);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    for (const enumValue of jsonSchemaModel.enum) {
        let enumKey = enumValue;
        if (typeof enumValue !== 'string') {
            enumKey = JSON.stringify(enumValue);
        }
        const enumValueModel = new models_1.EnumValueModel(enumKey, enumValue);
        metaModel.values.push(enumValueModel);
    }
    return metaModel;
}
exports.convertToEnumModel = convertToEnumModel;
function convertToBooleanModel(jsonSchemaModel, name) {
    var _a;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('boolean'))) {
        return undefined;
    }
    return new models_1.BooleanModel(name, jsonSchemaModel.originalInput);
}
exports.convertToBooleanModel = convertToBooleanModel;
/**
 * Determine whether we have a dictionary or an object. because in some cases inputs might be:
 * { "type": "object", "additionalProperties": { "$ref": "#" } } which is to be interpreted as a dictionary not an object model.
 */
function isDictionary(jsonSchemaModel) {
    if (Object.keys(jsonSchemaModel.properties || {}).length > 0 ||
        jsonSchemaModel.additionalProperties === undefined) {
        return false;
    }
    return true;
}
/**
 * Return the original input based on additionalProperties and patternProperties.
 */
function getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel) {
    const originalInputs = [];
    if (jsonSchemaModel.additionalProperties !== undefined) {
        originalInputs.push(jsonSchemaModel.additionalProperties.originalInput);
    }
    if (jsonSchemaModel.patternProperties !== undefined) {
        for (const patternModel of Object.values(jsonSchemaModel.patternProperties)) {
            originalInputs.push(patternModel.originalInput);
        }
    }
    return originalInputs;
}
/**
 * Function creating the right meta model based on additionalProperties and patternProperties.
 */
function convertAdditionalAndPatterns(jsonSchemaModel, name, alreadySeenModels) {
    const modelsAsValue = new Map();
    if (jsonSchemaModel.additionalProperties !== undefined) {
        const additionalPropertyModel = convertToMetaModel(jsonSchemaModel.additionalProperties, alreadySeenModels);
        modelsAsValue.set(additionalPropertyModel.name, additionalPropertyModel);
    }
    if (jsonSchemaModel.patternProperties !== undefined) {
        for (const patternModel of Object.values(jsonSchemaModel.patternProperties)) {
            const patternPropertyModel = convertToMetaModel(patternModel);
            modelsAsValue.set(patternPropertyModel.name, patternPropertyModel);
        }
    }
    if (modelsAsValue.size === 1) {
        return Array.from(modelsAsValue.values())[0];
    }
    return new models_1.UnionModel(name, getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel), Array.from(modelsAsValue.values()));
}
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
function convertToDictionaryModel(jsonSchemaModel, name, alreadySeenModels) {
    if (!isDictionary(jsonSchemaModel)) {
        return undefined;
    }
    const originalInput = getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel);
    const keyModel = new models_1.StringModel(name, originalInput);
    const valueModel = convertAdditionalAndPatterns(jsonSchemaModel, name, alreadySeenModels);
    return new models_1.DictionaryModel(name, originalInput, keyModel, valueModel, 'normal');
}
exports.convertToDictionaryModel = convertToDictionaryModel;
function convertToObjectModel(jsonSchemaModel, name, alreadySeenModels) {
    var _a;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('object')) ||
        isDictionary(jsonSchemaModel)) {
        return undefined;
    }
    const metaModel = new models_1.ObjectModel(name, jsonSchemaModel.originalInput, {});
    //cache model before continuing
    if (!alreadySeenModels.has(jsonSchemaModel)) {
        alreadySeenModels.set(jsonSchemaModel, metaModel);
    }
    for (const [propertyName, prop] of Object.entries(jsonSchemaModel.properties || {})) {
        const isRequired = jsonSchemaModel.isRequired(propertyName);
        const propertyModel = new models_1.ObjectPropertyModel(propertyName, isRequired, convertToMetaModel(prop, alreadySeenModels));
        metaModel.properties[String(propertyName)] = propertyModel;
    }
    if (jsonSchemaModel.additionalProperties !== undefined ||
        jsonSchemaModel.patternProperties !== undefined) {
        let propertyName = 'additionalProperties';
        while (metaModel.properties[String(propertyName)] !== undefined) {
            propertyName = `reserved_${propertyName}`;
        }
        const originalInput = getOriginalInputFromAdditionalAndPatterns(jsonSchemaModel);
        const keyModel = new models_1.StringModel(propertyName, originalInput);
        const valueModel = convertAdditionalAndPatterns(jsonSchemaModel, propertyName, alreadySeenModels);
        const dictionaryModel = new models_1.DictionaryModel(propertyName, originalInput, keyModel, valueModel, 'unwrap');
        const propertyModel = new models_1.ObjectPropertyModel(propertyName, false, dictionaryModel);
        metaModel.properties[String(propertyName)] = propertyModel;
    }
    return metaModel;
}
exports.convertToObjectModel = convertToObjectModel;
function convertToArrayModel(jsonSchemaModel, name, alreadySeenModels) {
    var _a;
    if (!((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('array'))) {
        return undefined;
    }
    const isNormalArray = !Array.isArray(jsonSchemaModel.items) &&
        jsonSchemaModel.additionalItems === undefined &&
        jsonSchemaModel.items !== undefined;
    //item multiple types + additionalItems sat = both count, as normal array
    //item single type + additionalItems sat = contradicting, only items count, as normal array
    //item not sat + additionalItems sat = anything is allowed, as normal array
    //item single type + additionalItems not sat = normal array
    //item not sat + additionalItems not sat = normal array, any type
    if (isNormalArray) {
        const placeholderModel = new models_1.AnyModel('', undefined);
        const metaModel = new models_1.ArrayModel(name, jsonSchemaModel.originalInput, placeholderModel);
        alreadySeenModels.set(jsonSchemaModel, metaModel);
        const valueModel = convertToMetaModel(jsonSchemaModel.items, alreadySeenModels);
        metaModel.valueModel = valueModel;
        return metaModel;
    }
    const valueModel = new models_1.UnionModel('union', jsonSchemaModel.originalInput, []);
    const metaModel = new models_1.ArrayModel(name, jsonSchemaModel.originalInput, valueModel);
    alreadySeenModels.set(jsonSchemaModel, metaModel);
    if (jsonSchemaModel.items !== undefined) {
        for (const itemModel of Array.isArray(jsonSchemaModel.items)
            ? jsonSchemaModel.items
            : [jsonSchemaModel.items]) {
            const itemsModel = convertToMetaModel(itemModel, alreadySeenModels);
            valueModel.union.push(itemsModel);
        }
    }
    if (jsonSchemaModel.additionalItems !== undefined) {
        const itemsModel = convertToMetaModel(jsonSchemaModel.additionalItems, alreadySeenModels);
        valueModel.union.push(itemsModel);
    }
    return metaModel;
}
exports.convertToArrayModel = convertToArrayModel;
function convertToTupleModel(jsonSchemaModel, name, alreadySeenModels) {
    var _a;
    const isTuple = ((_a = jsonSchemaModel.type) === null || _a === void 0 ? void 0 : _a.includes('array')) &&
        Array.isArray(jsonSchemaModel.items) &&
        jsonSchemaModel.additionalItems === undefined;
    if (!isTuple) {
        return undefined;
    }
    const items = jsonSchemaModel.items;
    //item multiple types + additionalItems not sat = tuple of item type
    const tupleModel = new models_1.TupleModel(name, jsonSchemaModel.originalInput, []);
    alreadySeenModels.set(jsonSchemaModel, tupleModel);
    for (let i = 0; i < items.length; i++) {
        const item = items[Number(i)];
        const valueModel = convertToMetaModel(item, alreadySeenModels);
        const tupleValueModel = new models_1.TupleValueModel(i, valueModel);
        tupleModel.tuple[Number(i)] = tupleValueModel;
    }
    return tupleModel;
}
exports.convertToTupleModel = convertToTupleModel;
//# sourceMappingURL=CommonModelToMetaModel.js.map