"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadContextFile = exports.setCurrentContext = exports.getCurrentContext = exports.removeContext = exports.addContext = exports.loadContext = exports.DEFAULT_CONTEXT_FILE_PATH = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path = tslib_1.__importStar(require("path"));
const os = tslib_1.__importStar(require("os"));
const context_error_1 = require("../errors/context-error");
const { readFile, writeFile } = fs_1.promises;
const CONTEXT_FILENAME = process.env.CONTEXT_FILENAME || '.asyncapi';
exports.DEFAULT_CONTEXT_FILE_PATH = path.resolve(process.env.CONTEXT_FILE_PATH || os.homedir(), CONTEXT_FILENAME);
function loadContext(contextName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fileContent = yield loadContextFile();
        if (contextName) {
            const context = fileContent.store[String(contextName)];
            if (!context) {
                throw new context_error_1.ContextNotFound(contextName);
            }
            return context;
        }
        else if (fileContent.current) {
            const context = fileContent.store[fileContent.current];
            if (!context) {
                throw new context_error_1.ContextNotFound(fileContent.current);
            }
            return context;
        }
        throw new context_error_1.MissingCurrentContextError();
    });
}
exports.loadContext = loadContext;
function addContext(contextName, pathToFile) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        let fileContent;
        try {
            fileContent = yield loadContextFile();
        }
        catch (err) {
            if (err instanceof context_error_1.MissingContextFileError) {
                fileContent = {
                    store: {
                        [contextName]: pathToFile,
                    }
                };
            }
            else {
                throw err;
            }
        }
        fileContent.store[String(contextName)] = pathToFile;
        yield saveContextFile(fileContent);
    });
}
exports.addContext = addContext;
function removeContext(contextName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fileContent = yield loadContextFile();
        if (!fileContent.store[String(contextName)]) {
            throw new context_error_1.ContextNotFound(contextName);
        }
        if (fileContent.current === contextName) {
            delete fileContent.current;
        }
        delete fileContent.store[String(contextName)];
        yield saveContextFile(fileContent);
    });
}
exports.removeContext = removeContext;
function getCurrentContext() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fileContent = yield loadContextFile();
        const context = yield loadContext();
        return {
            current: fileContent.current,
            context,
        };
    });
}
exports.getCurrentContext = getCurrentContext;
function setCurrentContext(contextName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const fileContent = yield loadContextFile();
        if (!fileContent.store[String(contextName)]) {
            throw new context_error_1.ContextNotFound(contextName);
        }
        fileContent.current = contextName;
        yield saveContextFile(fileContent);
    });
}
exports.setCurrentContext = setCurrentContext;
function loadContextFile() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            return JSON.parse(yield readFile(exports.DEFAULT_CONTEXT_FILE_PATH, { encoding: 'utf8' }));
        }
        catch (e) {
            throw new context_error_1.MissingContextFileError();
        }
    });
}
exports.loadContextFile = loadContextFile;
function saveContextFile(fileContent) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            writeFile(exports.DEFAULT_CONTEXT_FILE_PATH, JSON.stringify({
                current: fileContent.current,
                store: fileContent.store
            }), { encoding: 'utf8' });
            return fileContent;
        }
        catch (error) {
            return;
        }
    });
}
