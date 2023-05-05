"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.watchFlag = void 0;
const core_1 = require("@oclif/core");
const watchFlag = (description) => {
    return core_1.Flags.boolean({
        default: false,
        char: 'w',
        description: description || 'Enable watch mode',
    });
};
exports.watchFlag = watchFlag;
