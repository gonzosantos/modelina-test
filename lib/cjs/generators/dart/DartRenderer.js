"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DartRenderer = void 0;
const AbstractRenderer_1 = require("../AbstractRenderer");
const helpers_1 = require("../../helpers");
/**
 * Common renderer for Dart types
 *
 * @extends AbstractRenderer
 */
class DartRenderer extends AbstractRenderer_1.AbstractRenderer {
    constructor(options, generator, presets, model, inputModel, dependencyManager) {
        super(options, generator, presets, model, inputModel);
        this.dependencyManager = dependencyManager;
    }
    renderComments(lines) {
        lines = helpers_1.FormatHelpers.breakLines(lines);
        const newLiteral = lines.map((line) => ` * ${line}`).join('\n');
        return `/**
${newLiteral}
 */`;
    }
    renderAnnotation(annotationName, value) {
        const name = `@${helpers_1.FormatHelpers.upperFirst(annotationName)}`;
        let values = undefined;
        if (value !== undefined) {
            if (typeof value === 'object') {
                values = Object.entries(value || {})
                    .map(([paramName, newValue]) => {
                    if (paramName && newValue !== undefined) {
                        return `${paramName}=${newValue}`;
                    }
                    return newValue;
                })
                    .filter((v) => v !== undefined)
                    .join(', ');
            }
            else {
                values = value;
            }
        }
        return values !== undefined ? `${name}(${values})` : name;
    }
}
exports.DartRenderer = DartRenderer;
//# sourceMappingURL=DartRenderer.js.map