"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JavaDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class JavaDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
    renderImport(model, packageName) {
        return `import ${packageName}.${model.name};`;
    }
    renderAllModelDependencies(model, packageName) {
        return model
            .getNearestDependencies()
            .map((dependencyModel) => {
            return this.renderImport(dependencyModel, packageName);
        })
            .join('\n');
    }
}
exports.JavaDependencyManager = JavaDependencyManager;
//# sourceMappingURL=JavaDependencyManager.js.map