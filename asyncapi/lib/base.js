"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
class default_1 extends core_1.Command {
    catch(err) {
        const _super = Object.create(null, {
            catch: { get: () => super.catch }
        });
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                return yield _super.catch.call(this, err);
            }
            catch (e) {
                if (e instanceof Error) {
                    this.logToStderr(`${e.name}: ${e.message}`);
                    process.exitCode = 1;
                }
            }
        });
    }
}
exports.default = default_1;
