"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = exports.DEFAULT_PORT = void 0;
const tslib_1 = require("tslib");
const fs_1 = require("fs");
const specification_file_1 = require("../errors/specification-file");
const http_1 = require("http");
const serve_handler_1 = tslib_1.__importDefault(require("serve-handler"));
const ws_1 = require("ws");
const chokidar_1 = tslib_1.__importDefault(require("chokidar"));
const open_1 = tslib_1.__importDefault(require("open"));
const path_1 = tslib_1.__importDefault(require("path"));
const { readFile, writeFile } = fs_1.promises;
const sockets = [];
const messageQueue = [];
exports.DEFAULT_PORT = 3210;
function isValidFilePath(filePath) {
    return (0, fs_1.existsSync)(filePath);
}
function start(filePath, port = exports.DEFAULT_PORT) {
    if (!isValidFilePath(filePath)) {
        throw new specification_file_1.SpecificationFileNotFound(filePath);
    }
    chokidar_1.default.watch(filePath).on('all', (event, path) => {
        switch (event) {
            case 'add':
            case 'change':
                getFileContent(path).then((code) => {
                    messageQueue.push(JSON.stringify({
                        type: 'file:changed',
                        code,
                    }));
                    sendQueuedMessages();
                });
                break;
            case 'unlink':
                messageQueue.push(JSON.stringify({
                    type: 'file:deleted',
                    filePath,
                }));
                sendQueuedMessages();
                break;
        }
    });
    const server = (0, http_1.createServer)((request, response) => {
        //not all CLI users use npm. Some package managers put dependencies in different weird places
        //this is why we need to first figure out where exactly is the index.html located 
        //and then strip index.html from the path to point to directory with the rest of the studio
        const indexLocation = require.resolve('@asyncapi/studio/build/index.html');
        const hostFolder = indexLocation.substring(0, indexLocation.lastIndexOf(path_1.default.sep));
        return (0, serve_handler_1.default)(request, response, {
            public: hostFolder,
        });
    });
    server.on('upgrade', (request, socket, head) => {
        if (request.url === '/live-server') {
            wsServer.handleUpgrade(request, socket, head, (sock) => {
                wsServer.emit('connection', sock, request);
            });
        }
        else {
            socket.destroy();
        }
    });
    const wsServer = new ws_1.WebSocketServer({ noServer: true });
    wsServer.on('connection', (socket) => {
        sockets.push(socket);
        getFileContent(filePath).then((code) => {
            messageQueue.push(JSON.stringify({
                type: 'file:loaded',
                code,
            }));
            sendQueuedMessages();
        });
        socket.on('message', (event) => {
            try {
                const json = JSON.parse(event);
                if (json.type === 'file:update') {
                    saveFileContent(filePath, json.code);
                }
                else {
                    console.warn('Live Server: An unknown event has been received. See details:');
                    console.log(json);
                }
            }
            catch (e) {
                console.error(`Live Server: An invalid event has been received. See details:\n${event}`);
            }
        });
    });
    wsServer.on('close', (socket) => {
        sockets.splice(sockets.findIndex(s => s === socket));
    });
    server.listen(port, () => {
        const url = `http://localhost:${port}?liveServer=${port}`;
        console.log(`Studio is running at ${url}`);
        console.log(`Watching changes on file ${filePath}`);
        (0, open_1.default)(url);
    });
}
exports.start = start;
function sendQueuedMessages() {
    while (messageQueue.length && sockets.length) {
        const nextMessage = messageQueue.shift();
        for (const socket of sockets) {
            socket.send(nextMessage);
        }
    }
}
function getFileContent(filePath) {
    return new Promise((resolve) => {
        readFile(filePath, { encoding: 'utf8' })
            .then((code) => {
            resolve(code);
        })
            .catch(console.error);
    });
}
function saveFileContent(filePath, fileContent) {
    writeFile(filePath, fileContent, { encoding: 'utf8' })
        .catch(console.error);
}
