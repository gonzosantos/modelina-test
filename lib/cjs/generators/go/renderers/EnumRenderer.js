"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GO_DEFAULT_ENUM_PRESET = exports.EnumRenderer = void 0;
const GoRenderer_1 = require("../GoRenderer");
/**
 * Renderer for Go's `enum` type
 *
 * This renderer is a generic solution that works for all types of enum values.
 * This is also why you wont see `type MyEnum string´ even if possible.
 *
 * @extends GoRenderer
 */
class EnumRenderer extends GoRenderer_1.GoRenderer {
    defaultSelf() {
        const doc = this.renderCommentForEnumType(this.model.name, this.model.type);
        const enumValues = this.renderConstValuesForEnumType();
        const temp = this.model.values.map((value) => {
            return `${this.model.name}Values[${value.key}]: ${value.key},`;
        });
        const values = this.model.values
            .map((value) => {
            return value.value;
        })
            .join(',');
        return `${doc}
type ${this.model.name} uint

const (
${this.indent(this.renderBlock(enumValues))}
)

// Value returns the value of the enum.
func (op ${this.model.name}) Value() any {
	if op >= ${this.model.name}(len(${this.model.name}Values)) {
		return nil
	}
	return ${this.model.name}Values[op]
}

var ${this.model.name}Values = []any{${values}}
var ValuesTo${this.model.name} = map[any]${this.model.name}{
${this.indent(this.renderBlock(temp))}
}
`;
    }
    renderCommentForEnumType(name, type) {
        const globalType = type === 'interface{}' ? 'mixed types' : type;
        return this.renderComments(`${name} represents an enum of ${globalType}.`);
    }
    renderConstValuesForEnumType() {
        return this.model.values.map((enumValue, index) => {
            if (index === 0) {
                return `${enumValue.key} ${this.model.name} = iota`;
            }
            if (typeof enumValue.value === 'string') {
                return enumValue.key;
            }
            return enumValue.key;
        });
    }
}
exports.EnumRenderer = EnumRenderer;
exports.GO_DEFAULT_ENUM_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    }
};
//# sourceMappingURL=EnumRenderer.js.map