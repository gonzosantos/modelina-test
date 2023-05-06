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
exports.PYTHON_PYDANTIC_PRESET = void 0;
const PYTHON_PYDANTIC_CLASS_PRESET = {
    self({ renderer, model }) {
        return __awaiter(this, void 0, void 0, function* () {
            renderer.dependencyManager.addDependency('from typing import Optional, Any');
            renderer.dependencyManager.addDependency('from pydantic import BaseModel, Field');
            const defaultClassString = yield renderer.defaultSelf();
            return defaultClassString.replace(`class ${model.name}:`, `class ${model.name}(BaseModel):`);
        });
    },
    property(params) {
        const type = params.property.required
            ? params.property.property.type
            : `Optional[${params.property.property.type}]`;
        const alias = params.property.property.originalInput['description']
            ? `alias='${params.property.property.originalInput['description']}'`
            : '';
        return `${params.property.propertyName}: ${type} = Field(${alias})`;
    },
    ctor: () => '',
    getter: () => '',
    setter: () => ''
};
exports.PYTHON_PYDANTIC_PRESET = {
    class: PYTHON_PYDANTIC_CLASS_PRESET
};
//# sourceMappingURL=Pydantic.js.map