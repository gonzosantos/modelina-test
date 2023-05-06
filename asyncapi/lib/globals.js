"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.specWatcher = void 0;
const tslib_1 = require("tslib");
const chokidar_1 = tslib_1.__importDefault(require("chokidar"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const GreenLog = chalk_1.default.hex('#00FF00');
const OrangeLog = chalk_1.default.hex('#FFA500');
const CHOKIDAR_CONFIG = {
// awaitWriteFinish: true // Used for large size specification files.
};
const WATCH_MESSAGES = {
    logOnStart: (filePath) => console.log(GreenLog(`Watching AsyncAPI file at ${filePath}\n`)),
    logOnChange: (handlerName) => console.log(OrangeLog(`Change detected, running ${handlerName}\n`)),
    logOnAutoDisable: (docVersion = '') => console.log(OrangeLog(`Watch mode for ${docVersion || 'AsyncAPI'} file was not enabled.`), OrangeLog('\nINFO: Watch works only with files from local file system\n'))
};
const CHOKIDAR_INSTANCE_STORE = new Map();
const specWatcher = (params) => {
    if (!params.spec.getFilePath()) {
        return WATCH_MESSAGES.logOnAutoDisable(params.docVersion);
    }
    if (CHOKIDAR_INSTANCE_STORE.get(params.label || '_default')) {
        return;
    }
    const filePath = params.spec.getFilePath();
    try {
        WATCH_MESSAGES.logOnStart(filePath);
        chokidar_1.default
            .watch(filePath, CHOKIDAR_CONFIG)
            .on('change', () => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
            if (params.handlerName) {
                WATCH_MESSAGES.logOnChange(params.handlerName);
            }
            try {
                yield params.handler.run();
            }
            catch (err) {
                yield params.handler.catch(err);
            }
        }));
        CHOKIDAR_INSTANCE_STORE.set(params.label || '_default', true);
    }
    catch (error) {
        console.log(error);
    }
};
exports.specWatcher = specWatcher;
