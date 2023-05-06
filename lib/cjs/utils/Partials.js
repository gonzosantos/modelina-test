"use strict";
/* eslint-disable security/detect-object-injection, @typescript-eslint/ban-types */
Object.defineProperty(exports, "__esModule", { value: true });
exports.mergePartialAndDefault = void 0;
/**
 * Return true or false based on whether the input object is a regular object or a class
 *
 * Taken from: https://stackoverflow.com/a/43197340/6803886
 * @param obj
 */
function isClass(obj) {
    const isCtorClass = obj.constructor && obj.constructor.toString().substring(0, 5) === 'class';
    if (obj.prototype === undefined) {
        return isCtorClass;
    }
    const isPrototypeCtorClass = obj.prototype.constructor &&
        obj.prototype.constructor.toString &&
        obj.prototype.constructor.toString().substring(0, 5) === 'class';
    return isCtorClass || isPrototypeCtorClass;
}
/**
 * Merge a non optional value with custom optional values to form a full value that has all properties sat.
 */
function mergePartialAndDefault(defaultNonOptional, customOptional) {
    if (customOptional === undefined) {
        return defaultNonOptional;
    }
    // create a new object
    const target = Object.assign({}, defaultNonOptional);
    // deep merge the object into the target object
    for (const [propName, prop] of Object.entries(customOptional)) {
        const isObjectOrClass = typeof prop === 'object' && target[propName] !== undefined;
        const isRegularObject = !isClass(prop);
        if (isObjectOrClass && isRegularObject) {
            target[propName] = mergePartialAndDefault(target[propName], prop);
        }
        else if (prop) {
            target[propName] = prop;
        }
    }
    return target;
}
exports.mergePartialAndDefault = mergePartialAndDefault;
//# sourceMappingURL=Partials.js.map