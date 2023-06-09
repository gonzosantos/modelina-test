"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Watcher = exports.isLocalTemplate = void 0;
const tslib_1 = require("tslib");
// eslint-disable security/detect-object-injection
const fs = tslib_1.__importStar(require("fs"));
const util_1 = require("util");
const chokidar_1 = tslib_1.__importDefault(require("chokidar"));
const lstat = (0, util_1.promisify)(fs.lstat);
function isLocalTemplate(templatePath) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const stats = yield lstat(templatePath);
        return stats.isSymbolicLink();
    });
}
exports.isLocalTemplate = isLocalTemplate;
class Watcher {
    constructor(paths, ignorePaths) {
        if (Array.isArray(paths)) {
            this.paths = paths;
        }
        else {
            this.paths = [paths];
        }
        //Ensure all backwards slashes are replaced with forward slash based on the requirement from chokidar
        for (const pathIndex in this.paths) {
            const path = this.paths[String(pathIndex)];
            this.paths[String(pathIndex)] = path.replace(/[\\]/g, '/');
        }
        this.fsWait = false;
        this.watchers = {};
        this.filesChanged = {};
        this.ignorePaths = ignorePaths;
    }
    /**
     * Initiates watch on a path.
     * @param {*} path The path the watcher is listening on.
     * @param {*} changeCallback Callback to call when changed occur.
     * @param {*} errorCallback Calback to call when it is no longer possible to watch a file.
     */
    initiateWatchOnPath(path, changeCallback, errorCallback) {
        const watcher = chokidar_1.default.watch(path, { ignoreInitial: true, ignored: this.ignorePaths });
        watcher.on('all', (eventType, changedPath) => this.fileChanged(path, changedPath, eventType, changeCallback, errorCallback));
        this.watchers[String(path)] = watcher;
    }
    /**
     * This method initiate the watch for change in all files
     * @param {*} callback called when the file(s) change
     */
    watch(changeCallback, errorCallback) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            for (const index in this.paths) {
                const path = this.paths[String(index)];
                this.initiateWatchOnPath(path, changeCallback, errorCallback);
            }
        });
    }
    /**
     * Should be called when a file has changed one way or another.
     * @param {*} listenerPath The path the watcher is listening on.
     * @param {*} changedPath The file/dir that was changed
     * @param {*} eventType What kind of change
     * @param {*} changeCallback Callback to call when changed occur.
     * @param {*} errorCallback Calback to call when it is no longer possible to watch a file.
     */
    fileChanged(listenerPath, changedPath, eventType, changeCallback, errorCallback) {
        try {
            if (fs.existsSync(listenerPath)) {
                const newEventType = this.convertEventType(eventType);
                this.filesChanged[String(changedPath)] = { eventType: newEventType, path: changedPath };
                // Since multiple changes can occur at the same time, lets wait a bit before processing.
                if (this.fsWait) {
                    return;
                }
                this.fsWait = setTimeout(() => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    yield changeCallback(this.filesChanged);
                    this.filesChanged = {};
                    this.fsWait = false;
                }), 500);
            }
        }
        catch (e) {
            // File was not, find all files that are missing..
            const unknownPaths = this.getAllNonExistingPaths();
            this.closeWatchers();
            errorCallback(unknownPaths);
        }
    }
    /**
     * Convert the event type to a more usefull one.
     * @param {*} currentEventType The current event type (from chokidar)
     */
    convertEventType(currentEventType) {
        let newEventType = currentEventType;
        //Change the naming of the event type
        switch (newEventType) {
            case 'unlink':
            case 'unlinkDir':
                newEventType = 'removed';
                break;
            case 'addDir':
            case 'add':
                newEventType = 'added';
                break;
            case 'change':
                newEventType = 'changed';
                break;
            case 'rename':
                newEventType = 'renamed';
                break;
            default:
                newEventType = `unknown (${currentEventType})`;
        }
        return newEventType;
    }
    /**
     * Get all paths which no longer exists
     */
    getAllNonExistingPaths() {
        const unknownPaths = [];
        for (const index in this.paths) {
            const path = this.paths[String(index)];
            if (!fs.existsSync(path)) {
                unknownPaths.push(path);
            }
        }
        return unknownPaths;
    }
    /**
     * Closes all active watchers down.
     */
    closeWatchers() {
        this.filesChanged = {};
        for (const index in this.paths) {
            const path = this.paths[String(index)];
            this.closeWatcher(path);
        }
    }
    /**
     * Closes an active watcher down.
     * @param {*} path The path to close the watcher for.
     */
    closeWatcher(path) {
        // Ensure if called before `watch` to do nothing
        if (path !== null) {
            const watcher = this.watchers[String(path)];
            if (watcher !== null) {
                watcher.close();
                this.watchers[String(path)] = null;
            }
            else {
                //Watcher not found for path
            }
        }
    }
}
exports.Watcher = Watcher;
