"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const core_1 = require("@oclif/core");
const fs_1 = require("fs");
const base_1 = tslib_1.__importDefault(require("../../base"));
const path_1 = require("path");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
class NewGlee extends base_1.default {
    constructor() {
        super(...arguments);
        this.commandName = 'glee';
    }
    run() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const { flags } = yield this.parse(NewGlee); // NOSONAR
            const projectName = flags.name;
            const PROJECT_DIRECTORY = (0, path_1.join)(process.cwd(), projectName);
            const GLEE_TEMPLATES_DIRECTORY = (0, path_1.resolve)(__dirname, '../../../create-glee-app/templates/default');
            try {
                yield fs_1.promises.mkdir(PROJECT_DIRECTORY);
            }
            catch (err) {
                switch (err.code) {
                    case 'EEXIST':
                        this.error(`Unable to create the project. We tried to use "${projectName}" as the directory of your new project but it already exists (${PROJECT_DIRECTORY}). Please specify a different name for the new project. For example, run the following command instead:\n\n  asyncapi new ${this.commandName} --name ${projectName}-1\n`);
                        break;
                    case 'EACCES':
                        this.error(`Unable to create the project. We tried to access the "${PROJECT_DIRECTORY}" directory but it was not possible due to file access permissions. Please check the write permissions of your current working directory ("${process.cwd()}").`);
                        break;
                    case 'EPERM':
                        this.error(`Unable to create the project. We tried to create the "${PROJECT_DIRECTORY}" directory but the operation requires elevated privileges. Please check the privileges for your current user.`);
                        break;
                    default:
                        this.error(`Unable to create the project. Please check the following message for further info about the error:\n\n${err}`);
                }
            }
            try {
                yield fs_extra_1.default.copy(GLEE_TEMPLATES_DIRECTORY, PROJECT_DIRECTORY);
                yield fs_1.promises.rename(`${PROJECT_DIRECTORY}/env`, `${PROJECT_DIRECTORY}/.env`);
                yield fs_1.promises.rename(`${PROJECT_DIRECTORY}/gitignore`, `${PROJECT_DIRECTORY}/.gitignore`);
                yield fs_1.promises.rename(`${PROJECT_DIRECTORY}/README-template.md`, `${PROJECT_DIRECTORY}/README.md`);
                this.log(`Your project "${projectName}" has been created successfully!\n\nNext steps:\n\n  cd ${projectName}\n  npm install\n  npm run dev\n\nAlso, you can already open the project in your favorite editor and start tweaking it.`);
            }
            catch (err) {
                this.error(`Unable to create the project. Please check the following message for further info about the error:\n\n${err}`);
            }
        });
    }
}
exports.default = NewGlee;
NewGlee.description = 'Creates a new Glee project';
NewGlee.flags = {
    help: core_1.Flags.help({ char: 'h' }),
    name: core_1.Flags.string({ char: 'n', description: 'name of the project', default: 'project' }),
};
