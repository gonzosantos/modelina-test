"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileExists = exports.isURL = exports.nameType = exports.load = exports.Specification = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const path_1 = tslib_1.__importDefault(require("path"));
const url_1 = require("url");
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const Context_1 = require("./Context");
const specification_file_1 = require("../errors/specification-file");
const context_error_1 = require("../errors/context-error");
const { readFile, lstat } = fs_1.promises;
const allowedFileNames = [
    'asyncapi.json',
    'asyncapi.yml',
    'asyncapi.yaml'
];
const TYPE_CONTEXT_NAME = 'context-name';
const TYPE_FILE_PATH = 'file-path';
const TYPE_URL = 'url-path';
class Specification {
    constructor(spec, options = {}) {
        this.spec = spec;
        if (options.filepath) {
            this.filePath = options.filepath;
            this.kind = 'file';
        }
        else if (options.fileURL) {
            this.fileURL = options.fileURL;
            this.kind = 'url';
        }
    }
    text() {
        return this.spec;
    }
    getFilePath() {
        return this.filePath;
    }
    getFileURL() {
        return this.fileURL;
    }
    getKind() {
        return this.kind;
    }
    getSource() {
        return this.getFilePath() || this.getFileURL();
    }
    toSourceString() {
        if (this.kind === 'file') {
            return `File ${this.filePath}`;
        }
        return `URL ${this.fileURL}`;
    }
    static fromFile(filepath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let spec;
            try {
                spec = yield readFile(filepath, { encoding: 'utf8' });
            }
            catch (error) {
                throw new specification_file_1.ErrorLoadingSpec('file', filepath);
            }
            return new Specification(spec, { filepath });
        });
    }
    static fromURL(URLpath) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response;
            try {
                response = yield (0, node_fetch_1.default)(URLpath, { method: 'GET' });
                if (!response.ok) {
                    throw new specification_file_1.ErrorLoadingSpec('url', URLpath);
                }
            }
            catch (error) {
                throw new specification_file_1.ErrorLoadingSpec('url', URLpath);
            }
            return new Specification(yield (response === null || response === void 0 ? void 0 : response.text()), { fileURL: URLpath });
        });
    }
}
exports.Specification = Specification;
class SpecificationFile {
    constructor(filePath) {
        this.pathToFile = filePath;
    }
    getPath() {
        return this.pathToFile;
    }
    read() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return readFile(this.pathToFile, { encoding: 'utf8' });
        });
    }
}
exports.default = SpecificationFile;
/* eslint-disable sonarjs/cognitive-complexity */
function load(filePathOrContextName, loadType) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (filePathOrContextName) {
            if (loadType === null || loadType === void 0 ? void 0 : loadType.file) {
                return Specification.fromFile(filePathOrContextName);
            }
            if (loadType === null || loadType === void 0 ? void 0 : loadType.context) {
                return loadFromContext(filePathOrContextName);
            }
            if (loadType === null || loadType === void 0 ? void 0 : loadType.url) {
                return Specification.fromURL(filePathOrContextName);
            }
            const type = yield nameType(filePathOrContextName);
            if (type === TYPE_CONTEXT_NAME) {
                return loadFromContext(filePathOrContextName);
            }
            if (type === TYPE_URL) {
                return Specification.fromURL(filePathOrContextName);
            }
            yield fileExists(filePathOrContextName);
            return Specification.fromFile(filePathOrContextName);
        }
        try {
            return yield loadFromContext();
        }
        catch (e) {
            const autoDetectedSpecFile = yield detectSpecFile();
            if (autoDetectedSpecFile) {
                return Specification.fromFile(autoDetectedSpecFile);
            }
            if (e instanceof context_error_1.MissingContextFileError) {
                throw new specification_file_1.ErrorLoadingSpec();
            }
            throw e;
        }
    });
}
exports.load = load;
function nameType(name) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        if (name.startsWith('.')) {
            return TYPE_FILE_PATH;
        }
        try {
            if (yield fileExists(name)) {
                return TYPE_FILE_PATH;
            }
            return TYPE_CONTEXT_NAME;
        }
        catch (e) {
            if (yield isURL(name)) {
                return TYPE_URL;
            }
            return TYPE_CONTEXT_NAME;
        }
    });
}
exports.nameType = nameType;
function isURL(urlpath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const url = new url_1.URL(urlpath);
            return url.protocol === 'http:' || url.protocol === 'https:';
        }
        catch (error) {
            return false;
        }
    });
}
exports.isURL = isURL;
function fileExists(name) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            if ((yield lstat(name)).isFile()) {
                return true;
            }
            throw new specification_file_1.ErrorLoadingSpec('file', name);
        }
        catch (e) {
            throw new specification_file_1.ErrorLoadingSpec('file', name);
        }
    });
}
exports.fileExists = fileExists;
function loadFromContext(contextName) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const context = yield (0, Context_1.loadContext)(contextName);
            return Specification.fromFile(context);
        }
        catch (error) {
            if (error instanceof context_error_1.MissingContextFileError) {
                throw new specification_file_1.ErrorLoadingSpec();
            }
            throw error;
        }
    });
}
function detectSpecFile() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const existingFileNames = yield Promise.all(allowedFileNames.map((filename) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            try {
                const exists = yield fileExists(path_1.default.resolve(process.cwd(), filename));
                return exists ? filename : undefined;
            }
            catch (e) {
                // We did our best...
            }
        })));
        return existingFileNames.find(filename => filename !== undefined);
    });
}
