"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiffOverrideJSONError = exports.DiffOverrideFileError = void 0;
class DiffOverrideFileError extends Error {
    constructor() {
        super();
        this.name = 'DiffOverrideFileError';
        this.message = 'Override file not found';
    }
}
exports.DiffOverrideFileError = DiffOverrideFileError;
class DiffOverrideJSONError extends Error {
    constructor() {
        super();
        this.name = 'DiffOverrideJSONError';
        this.message = 'Provided override file is not a valid JSON file';
    }
}
exports.DiffOverrideJSONError = DiffOverrideJSONError;
