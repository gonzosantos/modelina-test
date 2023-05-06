"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeScriptDefaultConstraints = exports.TypeScriptDefaultTypeMapping = void 0;
const models_1 = require("../../models");
const utils_1 = require("../../utils");
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
exports.TypeScriptDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return constrainedModel.name;
    },
    Any() {
        return 'any';
    },
    Float() {
        return 'number';
    },
    Integer() {
        return 'number';
    },
    String() {
        return 'string';
    },
    Boolean() {
        return 'boolean';
    },
    Tuple({ constrainedModel }) {
        const tupleTypes = constrainedModel.tuple.map((constrainedType) => {
            return constrainedType.value.type;
        });
        return `[${tupleTypes.join(', ')}]`;
    },
    Array({ constrainedModel }) {
        let arrayType = constrainedModel.valueModel.type;
        if (constrainedModel.valueModel instanceof models_1.ConstrainedUnionModel) {
            arrayType = `(${arrayType})`;
        }
        return `${arrayType}[]`;
    },
    Enum({ constrainedModel }) {
        return constrainedModel.name;
    },
    Union({ constrainedModel }) {
        const unionTypes = constrainedModel.union.map((unionModel) => {
            return unionModel.type;
        });
        return unionTypes.join(' | ');
    },
    Dictionary({ constrainedModel, options }) {
        let keyType;
        //There is some restrictions on what can be used as keys for dictionaries.
        if (constrainedModel.key instanceof models_1.ConstrainedUnionModel) {
            utils_1.Logger.error('Key for dictionary is not allowed to be union type, falling back to any model.');
            keyType = 'any';
        }
        else {
            keyType = constrainedModel.key.type;
        }
        switch (options.mapType) {
            case 'indexedObject':
                return `{ [name: ${keyType}]: ${constrainedModel.value.type} }`;
            case 'record':
                return `Record<${keyType}, ${constrainedModel.value.type}>`;
            default:
            case 'map':
                return `Map<${keyType}, ${constrainedModel.value.type}>`;
        }
    }
};
exports.TypeScriptDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)()
};
//# sourceMappingURL=TypeScriptConstrainer.js.map