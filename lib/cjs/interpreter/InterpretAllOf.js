"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const Interpreter_1 = require("./Interpreter");
const Utils_1 = require("./Utils");
/**
 * Interpreter function for allOf keyword.
 *
 * It either merges allOf schemas into existing model or if allowed, create inheritance.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretAllOf(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' ||
        schema.allOf === undefined ||
        schema.oneOf) {
        return;
    }
    for (const allOfSchema of schema.allOf) {
        const allOfModel = interpreter.interpret(allOfSchema, interpreterOptions);
        if (allOfModel === undefined) {
            continue;
        }
        if ((0, Utils_1.isModelObject)(allOfModel) === true &&
            interpreterOptions.allowInheritance === true) {
            utils_1.Logger.info(`Processing allOf, inheritance is enabled, ${model.$id} inherits from ${allOfModel.$id}`, model, allOfModel);
            model.addExtendedModel(allOfModel);
        }
        else {
            utils_1.Logger.info('Processing allOf, inheritance is not enabled. AllOf model is merged together with already interpreted model', model, allOfModel);
            interpreter.interpretAndCombineSchema(allOfSchema, model, schema, interpreterOptions);
        }
    }
}
exports.default = interpretAllOf;
//# sourceMappingURL=InterpretAllOf.js.map