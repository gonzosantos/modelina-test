"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.constrainMetaModel = void 0;
const ConstrainedMetaModel_1 = require("../models/ConstrainedMetaModel");
const MetaModel_1 = require("../models/MetaModel");
const TypeHelpers_1 = require("./TypeHelpers");
const placeHolderConstrainedObject = new ConstrainedMetaModel_1.ConstrainedAnyModel('', undefined, '');
function constrainReferenceModel(typeMapping, constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedReferenceModel(context.constrainedName, context.metaModel.originalInput, '', placeHolderConstrainedObject);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const constrainedRefModel = constrainMetaModel(typeMapping, constrainRules, Object.assign(Object.assign({}, context), { metaModel: context.metaModel.ref, partOfProperty: undefined }), alreadySeenModels);
    constrainedModel.ref = constrainedRefModel;
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainAnyModel(typeMapping, context) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedAnyModel(context.constrainedName, context.metaModel.originalInput, '');
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainFloatModel(typeMapping, context) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedFloatModel(context.constrainedName, context.metaModel.originalInput, '');
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainIntegerModel(typeMapping, context) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedIntegerModel(context.constrainedName, context.metaModel.originalInput, '');
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainStringModel(typeMapping, context) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedStringModel(context.constrainedName, context.metaModel.originalInput, '');
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainBooleanModel(typeMapping, context) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedBooleanModel(context.constrainedName, context.metaModel.originalInput, '');
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainTupleModel(typeMapping, constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedTupleModel(context.constrainedName, context.metaModel.originalInput, '', []);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const constrainedTupleModels = context.metaModel.tuple.map((tupleValue) => {
        const tupleType = constrainMetaModel(typeMapping, constrainRules, Object.assign(Object.assign({}, context), { metaModel: tupleValue.value, partOfProperty: undefined }), alreadySeenModels);
        return new ConstrainedMetaModel_1.ConstrainedTupleValueModel(tupleValue.index, tupleType);
    });
    constrainedModel.tuple = constrainedTupleModels;
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainArrayModel(typeMapping, constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedArrayModel(context.constrainedName, context.metaModel.originalInput, '', placeHolderConstrainedObject);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const constrainedValueModel = constrainMetaModel(typeMapping, constrainRules, Object.assign(Object.assign({}, context), { metaModel: context.metaModel.valueModel, partOfProperty: undefined }), alreadySeenModels);
    constrainedModel.valueModel = constrainedValueModel;
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainUnionModel(typeMapping, constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedUnionModel(context.constrainedName, context.metaModel.originalInput, '', []);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const constrainedUnionModels = context.metaModel.union.map((unionValue) => {
        return constrainMetaModel(typeMapping, constrainRules, Object.assign(Object.assign({}, context), { metaModel: unionValue, partOfProperty: undefined }), alreadySeenModels);
    });
    constrainedModel.union = constrainedUnionModels;
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainDictionaryModel(typeMapping, constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedDictionaryModel(context.constrainedName, context.metaModel.originalInput, '', placeHolderConstrainedObject, placeHolderConstrainedObject, context.metaModel.serializationType);
    alreadySeenModels.set(context.metaModel, constrainedModel);
    const keyModel = constrainMetaModel(typeMapping, constrainRules, Object.assign(Object.assign({}, context), { metaModel: context.metaModel.key, partOfProperty: undefined }), alreadySeenModels);
    constrainedModel.key = keyModel;
    const valueModel = constrainMetaModel(typeMapping, constrainRules, Object.assign(Object.assign({}, context), { metaModel: context.metaModel.value, partOfProperty: undefined }), alreadySeenModels);
    constrainedModel.value = valueModel;
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainObjectModel(typeMapping, constrainRules, context, alreadySeenModels) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedObjectModel(context.constrainedName, context.metaModel.originalInput, '', {});
    alreadySeenModels.set(context.metaModel, constrainedModel);
    for (const propertyMetaModel of Object.values(context.metaModel.properties)) {
        const constrainedPropertyModel = new ConstrainedMetaModel_1.ConstrainedObjectPropertyModel('', propertyMetaModel.propertyName, propertyMetaModel.required, constrainedModel);
        const constrainedPropertyName = constrainRules.propertyKey({
            objectPropertyModel: propertyMetaModel,
            constrainedObjectPropertyModel: constrainedPropertyModel,
            constrainedObjectModel: constrainedModel,
            objectModel: context.metaModel
        });
        constrainedPropertyModel.propertyName = constrainedPropertyName;
        const constrainedProperty = constrainMetaModel(typeMapping, constrainRules, Object.assign(Object.assign({}, context), { metaModel: propertyMetaModel.property, partOfProperty: constrainedPropertyModel }), alreadySeenModels);
        constrainedPropertyModel.property = constrainedProperty;
        constrainedModel.properties[String(constrainedPropertyName)] =
            constrainedPropertyModel;
    }
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function ConstrainEnumModel(typeMapping, constrainRules, context) {
    const constrainedModel = new ConstrainedMetaModel_1.ConstrainedEnumModel(context.constrainedName, context.metaModel.originalInput, '', []);
    for (const enumValue of context.metaModel.values) {
        const constrainedEnumKey = constrainRules.enumKey({
            enumKey: String(enumValue.key),
            enumModel: context.metaModel,
            constrainedEnumModel: constrainedModel
        });
        const constrainedEnumValue = constrainRules.enumValue({
            enumValue: enumValue.value,
            enumModel: context.metaModel,
            constrainedEnumModel: constrainedModel
        });
        const constrainedEnumValueModel = new ConstrainedMetaModel_1.ConstrainedEnumValueModel(constrainedEnumKey, constrainedEnumValue);
        constrainedModel.values.push(constrainedEnumValueModel);
    }
    constrainedModel.type = (0, TypeHelpers_1.getTypeFromMapping)(typeMapping, {
        constrainedModel,
        options: context.options,
        partOfProperty: context.partOfProperty,
        dependencyManager: context.dependencyManager
    });
    return constrainedModel;
}
function constrainMetaModel(typeMapping, constrainRules, context, alreadySeenModels = new Map()) {
    if (alreadySeenModels.has(context.metaModel)) {
        return alreadySeenModels.get(context.metaModel);
    }
    const constrainedName = constrainRules.modelName({
        modelName: context.metaModel.name
    });
    const newContext = Object.assign(Object.assign({}, context), { constrainedName });
    if (newContext.metaModel instanceof MetaModel_1.ObjectModel) {
        return constrainObjectModel(typeMapping, constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.ReferenceModel) {
        return constrainReferenceModel(typeMapping, constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.DictionaryModel) {
        return constrainDictionaryModel(typeMapping, constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.TupleModel) {
        return constrainTupleModel(typeMapping, constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.ArrayModel) {
        return constrainArrayModel(typeMapping, constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    else if (newContext.metaModel instanceof MetaModel_1.UnionModel) {
        return constrainUnionModel(typeMapping, constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }), alreadySeenModels);
    }
    // Simple models are those who does not have properties that contain other MetaModels.
    let simpleModel;
    if (newContext.metaModel instanceof MetaModel_1.EnumModel) {
        simpleModel = ConstrainEnumModel(typeMapping, constrainRules, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.BooleanModel) {
        simpleModel = constrainBooleanModel(typeMapping, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.AnyModel) {
        simpleModel = constrainAnyModel(typeMapping, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.FloatModel) {
        simpleModel = constrainFloatModel(typeMapping, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.IntegerModel) {
        simpleModel = constrainIntegerModel(typeMapping, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    else if (newContext.metaModel instanceof MetaModel_1.StringModel) {
        simpleModel = constrainStringModel(typeMapping, Object.assign(Object.assign({}, newContext), { metaModel: newContext.metaModel }));
    }
    if (simpleModel !== undefined) {
        alreadySeenModels.set(context.metaModel, simpleModel);
        return simpleModel;
    }
    throw new Error('Could not constrain model');
}
exports.constrainMetaModel = constrainMetaModel;
//# sourceMappingURL=ConstrainHelpers.js.map