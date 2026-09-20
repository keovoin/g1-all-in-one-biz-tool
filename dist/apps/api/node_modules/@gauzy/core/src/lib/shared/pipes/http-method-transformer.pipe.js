"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpMethodTransformerPipe = void 0;
const contracts_1 = require("@gauzy/contracts");
/**
 * HttpMethodTransformerPipe handles the conversion between enum integer (stored in DB)
 * and the corresponding HTTP method string (e.g., 'GET', 'POST', etc.).
 */
class HttpMethodTransformerPipe {
    /**
     * Converts the HTTP method string to the corresponding enum value when writing to the database.
     *
     * @param value - The HTTP method string (e.g., 'GET', 'POST').
     * @returns The corresponding RequestMethod enum value.
     */
    to(value) {
        return HttpMethodTransformerPipe.methodMap.get(value.toUpperCase()) || contracts_1.RequestMethod.ALL;
    }
    /**
     * Converts the enum value to the corresponding HTTP method string when reading from the database.
     *
     * @param value - The enum value (e.g., RequestMethod.GET).
     * @returns The corresponding HTTP method string.
     */
    from(value) {
        return HttpMethodTransformerPipe.reverseMethodMap.get(value) || contracts_1.RequestMethodEnum.ALL;
    }
}
exports.HttpMethodTransformerPipe = HttpMethodTransformerPipe;
/**
 * A map of HTTP method strings to their corresponding enum values.
 */
HttpMethodTransformerPipe.methodMap = new Map([
    ['GET', contracts_1.RequestMethod.GET],
    ['POST', contracts_1.RequestMethod.POST],
    ['PUT', contracts_1.RequestMethod.PUT],
    ['DELETE', contracts_1.RequestMethod.DELETE],
    ['PATCH', contracts_1.RequestMethod.PATCH],
    ['OPTIONS', contracts_1.RequestMethod.OPTIONS],
    ['HEAD', contracts_1.RequestMethod.HEAD],
    ['SEARCH', contracts_1.RequestMethod.SEARCH]
]);
/**
 * A map of enum values to their corresponding HTTP method strings.
 */
HttpMethodTransformerPipe.reverseMethodMap = new Map([
    [contracts_1.RequestMethod.GET, 'GET'],
    [contracts_1.RequestMethod.POST, 'POST'],
    [contracts_1.RequestMethod.PUT, 'PUT'],
    [contracts_1.RequestMethod.DELETE, 'DELETE'],
    [contracts_1.RequestMethod.PATCH, 'PATCH'],
    [contracts_1.RequestMethod.OPTIONS, 'OPTIONS'],
    [contracts_1.RequestMethod.HEAD, 'HEAD'],
    [contracts_1.RequestMethod.SEARCH, 'SEARCH'],
    [contracts_1.RequestMethod.ALL, 'ALL']
]);
//# sourceMappingURL=http-method-transformer.pipe.js.map