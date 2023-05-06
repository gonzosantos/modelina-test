"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Interpreter_1 = require("./Interpreter");
/**
 * Interpreter function for oneOf keyword.
 *
 * It puts the schema reference into the items field.
 *
 * @param schema
 * @param model
 * @param interpreter
 * @param interpreterOptions to control the interpret process
 */
function interpretOneOf(schema, model, interpreter, interpreterOptions = Interpreter_1.Interpreter.defaultInterpreterOptions) {
    if (typeof schema === 'boolean' ||
        schema.oneOf === undefined ||
        schema.allOf ||
        schema.properties) {
        return;
    }
    for (const oneOfSchema of schema.oneOf) {
        const oneOfModel = interpreter.interpret(oneOfSchema, interpreterOptions);
        if (oneOfModel === undefined) {
            continue;
        }
        model.addItemUnion(oneOfModel);
    }
}
exports.default = interpretOneOf;
//# sourceMappingURL=InterpretOneOf.js.map