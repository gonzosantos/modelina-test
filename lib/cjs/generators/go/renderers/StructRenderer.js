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
exports.GO_DEFAULT_STRUCT_PRESET = exports.StructRenderer = void 0;
const GoRenderer_1 = require("../GoRenderer");
const models_1 = require("../../../models");
/**
 * Renderer for Go's `struct` type
 *
 * @extends GoRenderer
 */
class StructRenderer extends GoRenderer_1.GoRenderer {
    defaultSelf() {
        return __awaiter(this, void 0, void 0, function* () {
            const content = [
                yield this.renderFields(),
                yield this.runAdditionalContentPreset()
            ];
            const doc = this.renderComments(`${this.model.name} represents a ${this.model.name} model.`);
            return `${doc}
type ${this.model.name} struct {
${this.indent(this.renderBlock(content, 2))}
}`;
        });
    }
    renderFields() {
        return __awaiter(this, void 0, void 0, function* () {
            const fields = this.model.properties || {};
            const content = [];
            for (const field of Object.values(fields)) {
                const renderField = yield this.runFieldPreset(field);
                content.push(renderField);
            }
            return this.renderBlock(content);
        });
    }
    runFieldPreset(field) {
        return this.runPreset('field', { field });
    }
}
exports.StructRenderer = StructRenderer;
exports.GO_DEFAULT_STRUCT_PRESET = {
    self({ renderer }) {
        return renderer.defaultSelf();
    },
    field({ field }) {
        let fieldType = field.property.type;
        if (field.property instanceof models_1.ConstrainedReferenceModel) {
            fieldType = `*${fieldType}`;
        }
        return `${field.propertyName} ${fieldType}`;
    }
};
//# sourceMappingURL=StructRenderer.js.map