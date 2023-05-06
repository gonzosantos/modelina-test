"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PythonDependencyManager = void 0;
const AbstractDependencyManager_1 = require("../AbstractDependencyManager");
class PythonDependencyManager extends AbstractDependencyManager_1.AbstractDependencyManager {
    constructor(options, dependencies = []) {
        super(dependencies);
        this.options = options;
    }
    /**
     * Simple helper function to render a dependency based on the module system that the user defines.
     */
    renderDependency(model) {
        const useExplicitImports = this.options.importsStyle === 'explicit';
        return `from ${useExplicitImports ? '.' : ''}${model.name} import ${model.name}`;
    }
}
exports.PythonDependencyManager = PythonDependencyManager;
//# sourceMappingURL=PythonDependencyManager.js.map