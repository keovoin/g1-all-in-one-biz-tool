"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseObject = parseObject;
const is_class_instance_1 = require("./is-class-instance");
const is_object_1 = require("./is-object");
/**
 * Recursively parses an object, applying a callback to all non-object leaf values.
 *
 * @param source - The object to parse.
 * @param callback - The function to apply to each primitive value.
 * @returns The modified object.
 */
function parseObject(source, callback) {
    if (!(0, is_object_1.isObject)(source)) {
        return source;
    }
    for (const key of Object.keys(source)) {
        const value = source[key];
        if ((0, is_object_1.isObject)(value)) {
            if (!(0, is_class_instance_1.isClassInstance)(value)) {
                source[key] = parseObject(value, callback);
            }
        }
        else {
            source[key] = callback(value);
        }
    }
    return source;
}
//# sourceMappingURL=parse-object.js.map