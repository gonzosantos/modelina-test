"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JAVA_JACKSON_PRESET = void 0;
const models_1 = require("../../../models");
/**
 * Preset which adds `com.fasterxml.jackson` related annotations to class's property getters.
 *
 * @implements {JavaPreset}
 */
exports.JAVA_JACKSON_PRESET = {
    class: {
        self({ renderer, content }) {
            renderer.dependencyManager.addDependency('import com.fasterxml.jackson.annotation.*;');
            return content;
        },
        property({ renderer, property, content }) {
            //Properties that are dictionaries with unwrapped options, cannot get the annotation because it cannot be accurately unwrapped by the jackson library.
            const isDictionary = property.property instanceof models_1.ConstrainedDictionaryModel;
            const hasUnwrappedOptions = isDictionary &&
                property.property.serializationType ===
                    'unwrap';
            if (!hasUnwrappedOptions) {
                const annotation = renderer.renderAnnotation('JsonProperty', `"${property.unconstrainedPropertyName}"`);
                return renderer.renderBlock([annotation, content]);
            }
            return renderer.renderBlock([content]);
        }
    },
    enum: {
        self({ renderer, content }) {
            renderer.dependencyManager.addDependency('import com.fasterxml.jackson.annotation.*;');
            return content;
        },
        getValue({ content }) {
            return `@JsonValue
${content}`;
        },
        fromValue({ content }) {
            return `@JsonCreator
${content}`;
        }
    }
};
//# sourceMappingURL=JacksonPreset.js.map