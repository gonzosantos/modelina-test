"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonDefaultConstraints = exports.PythonDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
exports.PythonDefaultTypeMapping = {
    Object({ constrainedModel }) {
        //Returning name here because all object models have been split out
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return constrainedModel.name;
    },
    Any() {
        return 'Any';
    },
    Float() {
        return 'float';
    },
    Integer() {
        return 'int';
    },
    String() {
        return 'str';
    },
    Boolean() {
        return 'bool';
    },
    Tuple({ constrainedModel }) {
        const tupleTypes = constrainedModel.tuple.map((unionModel) => {
            return unionModel.value.type;
        });
        return `tuple[${tupleTypes.join(', ')}]`;
    },
    Array({ constrainedModel }) {
        return `list[${constrainedModel.valueModel.type}]`;
    },
    Enum({ constrainedModel }) {
        //Returning name here because all enum models have been split out
        return constrainedModel.name;
    },
    Union({ constrainedModel }) {
        const unionTypes = constrainedModel.union.map((unionModel) => {
            return unionModel.type;
        });
        return unionTypes.join(' | ');
    },
    Dictionary({ constrainedModel }) {
        return `dict[${constrainedModel.value.type}, ${constrainedModel.value.type}]`;
    }
};
exports.PythonDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)()
};
//# sourceMappingURL=PythonConstrainer.js.map