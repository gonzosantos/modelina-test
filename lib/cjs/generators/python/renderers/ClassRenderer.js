"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PYTHON_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const PythonRenderer_1 = require("../PythonRenderer");
/**
 * Renderer for Python's `class` type
 *
 * @extends PythonRenderer
 */
class ClassRenderer extends PythonRenderer_1.PythonRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            return `class ${this.model.name}: 
${this.indent(this.renderBlock(content, 2))}
`;
        });
    }
    runCtorPreset() {
        return this.runPreset('ctor');
    }
    /**
     * Render all the properties for the class.
     */
    renderProperties() {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.model.properties || {};
            const content = [];
            for (const property of Object.values(properties)) {
                const rendererProperty = yield this.runPropertyPreset(property);
                content.push(rendererProperty);
            }
            return this.renderBlock(content);
        });
    }
    runPropertyPreset(property) {
        return this.runPreset('property', { property });
    }
    /**
     * Render all the accessors for the properties
     */
    renderAccessors() {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.model.properties || {};
            const content = [];
            for (const property of Object.values(properties)) {
                const getter = yield this.runGetterPreset(property);
                const setter = yield this.runSetterPreset(property);
                content.push(this.renderBlock([getter, setter]));
            }
            return this.renderBlock(content, 2);
        });
    }
    runGetterPreset(property) {
        return this.runPreset('getter', { property });
    }
    runSetterPreset(property) {
        return this.runPreset('setter', { property });
    }
}
exports.ClassRenderer = ClassRenderer;
exports.PYTHON_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    ctor({ renderer, model }) {
        const properties = model.properties || {};
        let body = '';
        if (Object.keys(properties).length > 0) {
            const assigments = Object.values(properties).map((property) => {
                if (!property.required) {
                    return `if hasattr(input, '${property.propertyName}'):\n\tself._${property.propertyName} = input.${property.propertyName}`;
                }
                return `self._${property.propertyName} = input.${property.propertyName}`;
            });
            body = renderer.renderBlock(assigments);
        }
        else {
            body = `"""
No properties
"""`;
        }
        return `def __init__(self, input):
${renderer.indent(body)}`;
    },
    getter({ property }) {
        return `@property
def ${property.propertyName}(self):\n\treturn self._${property.propertyName}`;
    },
    setter({ property }) {
        return `@${property.propertyName}.setter
def ${property.propertyName}(self, ${property.propertyName}):\n\tself._${property.propertyName} = ${property.propertyName}`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map