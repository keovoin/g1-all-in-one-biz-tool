"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sluggable = sluggable;
const slugify_1 = require("slugify");
/**
 * Generate a slug from a string value.
 *
 * @param string - The input string to be converted into a slug.
 * @param replacement - The character to replace spaces with (default is '-').
 * @returns The generated slug as a string.
 */
function sluggable(string, replacement = '-') {
    return (0, slugify_1.default)(string, {
        replacement: replacement, // replace spaces with replacement character, defaults to `-`
        remove: /[*+~()'"!:@,.]/g, // remove characters that match regex, defaults to `undefined`
        lower: true, // convert to lower case, defaults to `false`
        trim: true // trim leading and trailing replacement chars, defaults to `true`
    }).replace(/[_]/g, replacement);
}
//# sourceMappingURL=slugify.js.map