"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DictionaryModel = exports.EnumModel = exports.EnumValueModel = exports.UnionModel = exports.ArrayModel = exports.ObjectModel = exports.ObjectPropertyModel = exports.TupleModel = exports.TupleValueModel = exports.BooleanModel = exports.StringModel = exports.IntegerModel = exports.FloatModel = exports.AnyModel = exports.ReferenceModel = exports.MetaModel = void 0;
class MetaModel {
    constructor(name, originalInput) {
        this.name = name;
        this.originalInput = originalInput;
    }
}
exports.MetaModel = MetaModel;
class ReferenceModel extends MetaModel {
    constructor(name, originalInput, ref) {
        super(name, originalInput);
        this.ref = ref;
    }
}
exports.ReferenceModel = ReferenceModel;
class AnyModel extends MetaModel {
}
exports.AnyModel = AnyModel;
class FloatModel extends MetaModel {
}
exports.FloatModel = FloatModel;
class IntegerModel extends MetaModel {
}
exports.IntegerModel = IntegerModel;
class StringModel extends MetaModel {
}
exports.StringModel = StringModel;
class BooleanModel extends MetaModel {
}
exports.BooleanModel = BooleanModel;
class TupleValueModel {
    constructor(index, value) {
        this.index = index;
        this.value = value;
    }
}
exports.TupleValueModel = TupleValueModel;
class TupleModel extends MetaModel {
    constructor(name, originalInput, tuple) {
        super(name, originalInput);
        this.tuple = tuple;
    }
}
exports.TupleModel = TupleModel;
class ObjectPropertyModel {
    constructor(propertyName, required, property) {
        this.propertyName = propertyName;
        this.required = required;
        this.property = property;
    }
}
exports.ObjectPropertyModel = ObjectPropertyModel;
class ObjectModel extends MetaModel {
    constructor(name, originalInput, properties) {
        super(name, originalInput);
        this.properties = properties;
    }
}
exports.ObjectModel = ObjectModel;
class ArrayModel extends MetaModel {
    constructor(name, originalInput, valueModel) {
        super(name, originalInput);
        this.valueModel = valueModel;
    }
}
exports.ArrayModel = ArrayModel;
class UnionModel extends MetaModel {
    constructor(name, originalInput, union) {
        super(name, originalInput);
        this.union = union;
    }
}
exports.UnionModel = UnionModel;
class EnumValueModel {
    constructor(key, value) {
        this.key = key;
        this.value = value;
    }
}
exports.EnumValueModel = EnumValueModel;
class EnumModel extends MetaModel {
    constructor(name, originalInput, values) {
        super(name, originalInput);
        this.values = values;
    }
}
exports.EnumModel = EnumModel;
class DictionaryModel extends MetaModel {
    constructor(name, originalInput, key, value, serializationType = 'normal') {
        super(name, originalInput);
        this.key = key;
        this.value = value;
        this.serializationType = serializationType;
    }
}
exports.DictionaryModel = DictionaryModel;
//# sourceMappingURL=MetaModel.js.map