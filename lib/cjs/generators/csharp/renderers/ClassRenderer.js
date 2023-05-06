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
exports.CSHARP_DEFAULT_CLASS_PRESET = exports.ClassRenderer = void 0;
const CSharpRenderer_1 = require("../CSharpRenderer");
const models_1 = require("../../../models");
const change_case_1 = require("change-case");
/**
 * Renderer for CSharp's `struct` type
 *
 * @extends CSharpRenderer
 */
class ClassRenderer extends CSharpRenderer_1.CSharpRenderer {
    defaultSelf() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderProperties(),
                yield this.runCtorPreset(),
                yield this.renderAccessors(),
                yield this.runAdditionalContentPreset()
            ];
            if (((_a = this.options) === null || _a === void 0 ? void 0 : _a.collectionType) === 'List' ||
                this.model.containsPropertyType(models_1.ConstrainedDictionaryModel)) {
                this.dependencyManager.addDependency('using System.Collections.Generic;');
            }
            return `public class ${this.model.name}
{
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
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
    renderAccessors() {
        return __awaiter(this, void 0, void 0, function* () {
            const properties = this.model.properties || {};
            const content = [];
            for (const property of Object.values(properties)) {
                content.push(yield this.runAccessorPreset(property));
            }
            return this.renderBlock(content, 2);
        });
    }
    runCtorPreset() {
        return this.runPreset('ctor');
    }
    runAccessorPreset(property) {
        return this.runPreset('accessor', {
            property,
            options: this.options,
            renderer: this
        });
    }
    runPropertyPreset(property) {
        return this.runPreset('property', {
            property,
            options: this.options,
            renderer: this
        });
    }
    runGetterPreset(property) {
        return this.runPreset('getter', {
            property,
            options: this.options,
            renderer: this
        });
    }
    runSetterPreset(property) {
        return this.runPreset('setter', {
            property,
            options: this.options,
            renderer: this
        });
    }
}
exports.ClassRenderer = ClassRenderer;
exports.CSHARP_DEFAULT_CLASS_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    property({ renderer, property, options }) {
        return __awaiter(this, void 0, void 0, function* () {
            if (options === null || options === void 0 ? void 0 : options.autoImplementedProperties) {
                const getter = yield renderer.runGetterPreset(property);
                const setter = yield renderer.runSetterPreset(property);
                return `public ${property.property.type} ${(0, change_case_1.pascalCase)(property.propertyName)} { ${getter} ${setter} }`;
            }
            return `private ${property.property.type} ${property.propertyName};`;
        });
    },
    accessor({ renderer, options, property }) {
        return __awaiter(this, void 0, void 0, function* () {
            const formattedAccessorName = (0, change_case_1.pascalCase)(property.propertyName);
            if (options === null || options === void 0 ? void 0 : options.autoImplementedProperties) {
                return '';
            }
            return `public ${property.property.type} ${formattedAccessorName} 
{
  ${yield renderer.runGetterPreset(property)}
  ${yield renderer.runSetterPreset(property)}
}`;
        });
    },
    getter({ options, property }) {
        if (options === null || options === void 0 ? void 0 : options.autoImplementedProperties) {
            return 'get;';
        }
        return `get { return ${property.propertyName}; }`;
    },
    setter({ options, property }) {
        if (options === null || options === void 0 ? void 0 : options.autoImplementedProperties) {
            return 'set;';
        }
        return `set { ${property.propertyName} = value; }`;
    }
};
//# sourceMappingURL=ClassRenderer.js.map