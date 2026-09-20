"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = createToken;
/**
 * Create a named unique token for dependency injection.
 * The returned value is a `symbol` but carries a tiny phantom type
 * so consumers get better autocomplete/intent while remaining a runtime
 * unique symbol.
 */
function createToken(name) {
    return Symbol(name);
}
//# sourceMappingURL=create-token.js.map