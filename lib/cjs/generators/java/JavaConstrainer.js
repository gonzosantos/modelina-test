"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaDefaultConstraints = exports.JavaDefaultTypeMapping = void 0;
const EnumConstrainer_1 = require("./constrainer/EnumConstrainer");
const ModelNameConstrainer_1 = require("./constrainer/ModelNameConstrainer");
const PropertyKeyConstrainer_1 = require("./constrainer/PropertyKeyConstrainer");
function enumFormatToNumberType(enumValueModel, format) {
    switch (format) {
        case 'integer':
        case 'int32':
            return 'int';
        case 'long':
        case 'int64':
            return 'long';
        case 'float':
            return 'float';
        case 'double':
            return 'double';
        default:
            if (Number.isInteger(enumValueModel.value)) {
                return 'int';
            }
            return 'double';
    }
}
const fromEnumValueToType = (enumValueModel, format) => {
    switch (typeof enumValueModel.value) {
        case 'boolean':
            return 'boolean';
        case 'number':
        case 'bigint':
            return enumFormatToNumberType(enumValueModel, format);
        case 'object':
            return 'Object';
        case 'string':
            return 'String';
        default:
            return 'Object';
    }
};
/**
 * Converts union of different number types to the most strict type it can be.
 *
 * int + double = double (long + double, float + double can never happen, otherwise this would be converted to double)
 * int + float = float (long + float can never happen, otherwise this would be the case as well)
 * int + long = long
 */
const interpretUnionValueType = (types) => {
    if (types.includes('double')) {
        return 'double';
    }
    if (types.includes('float')) {
        return 'float';
    }
    if (types.includes('long')) {
        return 'long';
    }
    return 'Object';
};
exports.JavaDefaultTypeMapping = {
    Object({ constrainedModel }) {
        return constrainedModel.name;
    },
    Reference({ constrainedModel }) {
        return constrainedModel.name;
    },
    Any() {
        return 'Object';
    },
    Float({ constrainedModel }) {
        let type = 'Double';
        const format = constrainedModel.originalInput &&
            constrainedModel.originalInput['format'];
        switch (format) {
            case 'float':
                type = 'float';
                break;
        }
        return type;
    },
    Integer({ constrainedModel }) {
        let type = 'Integer';
        const format = constrainedModel.originalInput &&
            constrainedModel.originalInput['format'];
        switch (format) {
            case 'integer':
            case 'int32':
                type = 'int';
                break;
            case 'long':
            case 'int64':
                type = 'long';
                break;
        }
        return type;
    },
    String({ constrainedModel }) {
        let type = 'String';
        const format = constrainedModel.originalInput &&
            constrainedModel.originalInput['format'];
        switch (format) {
            case 'date':
                type = 'java.time.LocalDate';
                break;
            case 'time':
                type = 'java.time.OffsetTime';
                break;
            case 'dateTime':
            case 'date-time':
                type = 'java.time.OffsetDateTime';
                break;
            case 'binary':
                type = 'byte[]';
                break;
        }
        return type;
    },
    Boolean() {
        return 'Boolean';
    },
    Tuple({ options }) {
        //Because Java have no notion of tuples (and no custom implementation), we have to render it as a list of any value.
        const tupleType = 'Object';
        if (options.collectionType && options.collectionType === 'List') {
            return `List<${tupleType}>`;
        }
        return `${tupleType}[]`;
    },
    Array({ constrainedModel, options }) {
        if (options.collectionType && options.collectionType === 'List') {
            return `List<${constrainedModel.valueModel.type}>`;
        }
        return `${constrainedModel.valueModel.type}[]`;
    },
    Enum({ constrainedModel }) {
        const format = constrainedModel.originalInput &&
            constrainedModel.originalInput['format'];
        const valueTypes = constrainedModel.values.map((enumValue) => fromEnumValueToType(enumValue, format));
        const uniqueTypes = valueTypes.filter((item, pos) => {
            return valueTypes.indexOf(item) === pos;
        });
        //Enums cannot handle union types, default to a loose type
        if (uniqueTypes.length > 1) {
            return interpretUnionValueType(uniqueTypes);
        }
        return uniqueTypes[0];
    },
    Union() {
        //Because Java have no notion of unions (and no custom implementation), we have to render it as any value.
        return 'Object';
    },
    Dictionary({ constrainedModel }) {
        //Limitations to Java is that maps cannot have specific value types...
        if (constrainedModel.value.type === 'int') {
            constrainedModel.value.type = 'Integer';
        }
        return `Map<${constrainedModel.key.type}, ${constrainedModel.value.type}>`;
    }
};
exports.JavaDefaultConstraints = {
    enumKey: (0, EnumConstrainer_1.defaultEnumKeyConstraints)(),
    enumValue: (0, EnumConstrainer_1.defaultEnumValueConstraints)(),
    modelName: (0, ModelNameConstrainer_1.defaultModelNameConstraints)(),
    propertyKey: (0, PropertyKeyConstrainer_1.defaultPropertyKeyConstraints)()
};
//# sourceMappingURL=JavaConstrainer.js.map