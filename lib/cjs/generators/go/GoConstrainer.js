"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoDefaultConstraints = exports.GoDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
exports.GoDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return `${constrainedModel.name}`;
    },
    Any() {
        return 'interface{}';
    },
    Float() {
        return 'float64';
    },
    Integer() {
        return 'int';
    },
    String() {
        return 'string';
    },
    Boolean() {
        return 'bool';
    },
    Tuple() {
        //Because Go have no notion of tuples (and no custom implementation), we have to render it as a list of any value.
        return '[]interface{}';
    },
    Array({ constrainedModel }) {
        return `[]${constrainedModel.valueModel.type}`;
    },
    Enum({ constrainedModel }) {
        return constrainedModel.name;
    },
    Union() {
        //Because Go have no notion of unions (and no custom implementation), we have to render it as any value.
        return 'interface{}';
    },
    Dictionary({ constrainedModel }) {
        return `map[${constrainedModel.key.type}]${constrainedModel.value.type}`;
    }
};
exports.GoDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)()
};
//# sourceMappingURL=GoConstrainer.js.map