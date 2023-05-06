export declare function isLocalTemplate(templatePath: string): Promise<boolean>;
export declare class Watcher {
    private watchers;
    private fsWait;
    private filesChanged;
    private ignorePaths;
    private paths;
    constructor(paths: string | string[], ignorePaths: string[]);
    /**
     * Initiates watch on a path.
     * @param {*} path The path the watcher is listening on.
     * @param {*} changeCallback Callback to call when changed occur.
     * @param {*} errorCallback Calback to call when it is no longer possible to watch a file.
     */
    initiateWatchOnPath(path: string, changeCallback: any, errorCallback: any): void;
    /**
     * This method initiate the watch for change in all files
     * @param {*} callback called when the file(s) change
     */
    watch(changeCallback: any, errorCallback: any): Promise<void>;
    /**
     * Should be called when a file has changed one way or another.
     * @param {*} listenerPath The path the watcher is listening on.
     * @param {*} changedPath The file/dir that was changed
     * @param {*} eventType What kind of change
     * @param {*} changeCallback Callback to call when changed occur.
     * @param {*} errorCallback Calback to call when it is no longer possible to watch a file.
     */
    fileChanged(listenerPath: string, changedPath: string, eventType: string, changeCallback: any, errorCallback: any): void;
    /**
     * Convert the event type to a more usefull one.
     * @param {*} currentEventType The current event type (from chokidar)
     */
    convertEventType(currentEventType: string): string;
    /**
     * Get all paths which no longer exists
     */
    getAllNonExistingPaths(): any[];
    /**
     * Closes all active watchers down.
     */
    closeWatchers(): void;
    /**
     * Closes an active watcher down.
     * @param {*} path The path to close the watcher for.
     */
    closeWatcher(path: string): void;
}
