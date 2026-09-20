"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GrantType = void 0;
/**
 * Enum representing the supported grant types for authentication.
 */
var GrantType;
(function (GrantType) {
    /**
     * User provides username and password for authentication.
     */
    GrantType["Password"] = "password";
    /**
     * Application authenticates itself using client ID and secret.
     */
    GrantType["ClientCredentials"] = "client_credentials";
})(GrantType || (exports.GrantType = GrantType = {}));
//# sourceMappingURL=grant-type.js.map