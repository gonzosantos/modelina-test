"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = void 0;
var core_1 = require("@oclif/core");
Object.defineProperty(exports, "run", { enumerable: true, get: function () { return core_1.run; } });
/**
 * For NodeJS < 15, unhandled rejections are treated as warnings.
 * This is required for consistency in error handling.
 */
process.on('unhandledRejection', (reason) => {
    throw new Error(reason);
});
