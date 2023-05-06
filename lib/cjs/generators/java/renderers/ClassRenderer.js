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
exports.JAVA_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const JavaRenderer_1 = require("../JavaRenderer");
const models_1 = require("../../../models");
const helpers_1 = require("../../../helpers");
/**
 * Renderer for Java's `class` type
 *
 * @extends JavaRenderer
 */
class ClassRenderer extends JavaRenderer_1.JavaRenderer {
    defaultSelf() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.collectionType) === 'List') {
                this.dependencyManager.addDependency('import java.util.List;');
            }
            if (this.model.containsPropertyType(models_1.ConstrainedDictionaryModel)) {
                this.dependencyManager.addDependency('import java.util.Map;');
            }
            return `public class ${this.model.name} {
${this.indent(this.renderBlock(content, 2))}
}`;
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
exports.JAVA_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ property }) {
        return `private ${property.property.type} ${property.propertyName};`;
    },
    getter({ property }) {
        const getterName = `get${helpers_1.FormatHelpers.toPascalCase(property.propertyName)}`;
        return `public ${property.property.type} ${getterName}() { return this.${property.propertyName}; }`;
    },
    setter({ property }) {
        const setterName = helpers_1.FormatHelpers.toPascalCase(property.propertyName);
        return `public void set${setterName}(${property.property.type} ${property.propertyName}) { this.${property.propertyName} = ${property.propertyName}; }`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map