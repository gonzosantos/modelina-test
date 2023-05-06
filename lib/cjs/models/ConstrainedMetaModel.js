"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstrainedObjectModel = exports.ConstrainedDictionaryModel = exports.ConstrainedEnumModel = exports.ConstrainedEnumValueModel = exports.ConstrainedUnionModel = exports.ConstrainedArrayModel = exports.ConstrainedObjectPropertyModel = exports.ConstrainedTupleModel = exports.ConstrainedTupleValueModel = exports.ConstrainedBooleanModel = exports.ConstrainedStringModel = exports.ConstrainedIntegerModel = exports.ConstrainedFloatModel = exports.ConstrainedAnyModel = exports.ConstrainedReferenceModel = exports.ConstrainedMetaModel = void 0;
const DependencyHelpers_1 = require("../helpers/DependencyHelpers");
const MetaModel_1 = require("./MetaModel");
class ConstrainedMetaModel extends MetaModel_1.MetaModel {
    constructor(name, originalInput, type) {
        super(name, originalInput);
        this.type = type;
    }
    /**
     * Get the nearest constrained meta models for the constrained model.
     *
     * This is often used when you want to know which other models you are referencing.
     */
    getNearestDependencies() {
        return [];
    }
}
exports.ConstrainedMetaModel = ConstrainedMetaModel;
class ConstrainedReferenceModel extends ConstrainedMetaModel {
    constructor(name, originalInput, type, ref) {
        super(name, originalInput, type);
        this.ref = ref;
    }
}
exports.ConstrainedReferenceModel = ConstrainedReferenceModel;
class ConstrainedAnyModel extends ConstrainedMetaModel {
}
exports.ConstrainedAnyModel = ConstrainedAnyModel;
class ConstrainedFloatModel extends ConstrainedMetaModel {
}
exports.ConstrainedFloatModel = ConstrainedFloatModel;
class ConstrainedIntegerModel extends ConstrainedMetaModel {
}
exports.ConstrainedIntegerModel = ConstrainedIntegerModel;
class ConstrainedStringModel extends ConstrainedMetaModel {
}
exports.ConstrainedStringModel = ConstrainedStringModel;
class ConstrainedBooleanModel extends ConstrainedMetaModel {
}
exports.ConstrainedBooleanModel = ConstrainedBooleanModel;
class ConstrainedTupleValueModel {
    constructor(index, value) {
        this.index = index;
        this.value = value;
    }
}
exports.ConstrainedTupleValueModel = ConstrainedTupleValueModel;
class ConstrainedTupleModel extends ConstrainedMetaModel {
    constructor(name, originalInput, type, tuple) {
        super(name, originalInput, type);
        this.tuple = tuple;
    }
    getNearestDependencies() {
        let dependencyModels = [];
        for (const tupleModel of Object.values(this.tuple)) {
            if (tupleModel.value instanceof ConstrainedReferenceModel) {
                dependencyModels.push(tupleModel.value);
            }
            else {
                //Lets check the non-reference model for dependencies
                dependencyModels = [
                    ...dependencyModels,
                    ...tupleModel.value.getNearestDependencies()
                ];
            }
        }
        //Ensure no duplicate references
        dependencyModels = (0, DependencyHelpers_1.makeUnique)(dependencyModels);
        return dependencyModels;
    }
}
exports.ConstrainedTupleModel = ConstrainedTupleModel;
class ConstrainedObjectPropertyModel {
    constructor(propertyName, unconstrainedPropertyName, required, property) {
        this.propertyName = propertyName;
        this.unconstrainedPropertyName = unconstrainedPropertyName;
        this.required = required;
        this.property = property;
    }
}
exports.ConstrainedObjectPropertyModel = ConstrainedObjectPropertyModel;
class ConstrainedArrayModel extends ConstrainedMetaModel {
    constructor(name, originalInput, type, valueModel) {
        super(name, originalInput, type);
        this.valueModel = valueModel;
    }
    getNearestDependencies() {
        if (this.valueModel instanceof ConstrainedReferenceModel) {
            return [this.valueModel];
        }
        return this.valueModel.getNearestDependencies();
    }
}
exports.ConstrainedArrayModel = ConstrainedArrayModel;
class ConstrainedUnionModel extends ConstrainedMetaModel {
    constructor(name, originalInput, type, union) {
        super(name, originalInput, type);
        this.union = union;
    }
    getNearestDependencies() {
        let dependencyModels = [];
        for (const unionModel of Object.values(this.union)) {
            if (unionModel instanceof ConstrainedReferenceModel) {
                dependencyModels.push(unionModel);
            }
            else {
                //Lets check the non-reference model for dependencies
                dependencyModels = [
                    ...dependencyModels,
                    ...unionModel.getNearestDependencies()
                ];
            }
        }
        //Ensure no duplicate references
        dependencyModels = (0, DependencyHelpers_1.makeUnique)(dependencyModels);
        return dependencyModels;
    }
}
exports.ConstrainedUnionModel = ConstrainedUnionModel;
class ConstrainedEnumValueModel {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
exports.ConstrainedEnumValueModel = ConstrainedEnumValueModel;
class ConstrainedEnumModel extends ConstrainedMetaModel {
    constructor(name, originalInput, type, values) {
        super(name, originalInput, type);
        this.values = values;
    }
}
exports.ConstrainedEnumModel = ConstrainedEnumModel;
class ConstrainedDictionaryModel extends ConstrainedMetaModel {
    constructor(name, originalInput, type, key, value, serializationType = 'normal') {
        super(name, originalInput, type);
        this.key = key;
        this.value = value;
        this.serializationType = serializationType;
    }
    getNearestDependencies() {
        const dependencies = [this.key, this.value];
        let dependencyModels = [];
        for (const model of dependencies) {
            if (model instanceof ConstrainedReferenceModel) {
                dependencyModels.push(model);
            }
            else {
                //Lets check the non-reference model for dependencies
                dependencyModels = [
                    ...dependencyModels,
                    ...model.getNearestDependencies()
                ];
            }
        }
        //Ensure no duplicate references
        dependencyModels = (0, DependencyHelpers_1.makeUnique)(dependencyModels);
        return dependencyModels;
    }
}
exports.ConstrainedDictionaryModel = ConstrainedDictionaryModel;
class ConstrainedObjectModel extends ConstrainedMetaModel {
    constructor(name, originalInput, type, properties) {
        super(name, originalInput, type);
        this.properties = properties;
    }
    getNearestDependencies() {
        let dependencyModels = [];
        for (const modelProperty of Object.values(this.properties)) {
            if (modelProperty.property instanceof ConstrainedReferenceModel) {
                dependencyModels.push(modelProperty.property);
            }
            else {
                //Lets check the non-reference model for dependencies
                dependencyModels = [
                    ...dependencyModels,
                    ...modelProperty.property.getNearestDependencies()
                ];
            }
        }
        //Ensure no self references
        dependencyModels = dependencyModels.filter((referenceModel) => {
            return referenceModel.name !== this.name;
        });
        //Ensure no duplicate references
        dependencyModels = (0, DependencyHelpers_1.makeUnique)(dependencyModels);
        return dependencyModels;
    }
    /**
     * More specifics on the type setup here: https://github.com/Microsoft/TypeScript/wiki/FAQ#why-cant-i-write-typeof-t-new-t-or-instanceof-t-in-my-generic-function
     *
     * @param propertyType
     */
    containsPropertyType(propertyType) {
        const foundPropertiesWithType = Object.values(this.properties).filter((property) => {
            return property.property instanceof propertyType;
        });
        return foundPropertiesWithType.length !== 0;
    }
}
exports.ConstrainedObjectModel = ConstrainedObjectModel;
//# sourceMappingURL=ConstrainedMetaModel.js.map