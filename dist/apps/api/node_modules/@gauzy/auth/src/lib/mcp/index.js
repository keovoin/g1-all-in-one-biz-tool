"use strict";
/**
 * MCP OAuth 2.0 Authorization Server
 *
 * This module implements a complete OAuth 2.0 authorization server
 *
 * It provides:
 * - OAuth 2.0 authorization code flow with PKCE
 * - Client credentials grant
 * - Refresh token support
 * - JWT-based access tokens
 * - User authentication and consent management
 *
 * @module @gauzy/auth
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
// Server components
tslib_1.__exportStar(require("./server"), exports);
// Utilities
tslib_1.__exportStar(require("./utils"), exports);
// Interfaces
tslib_1.__exportStar(require("./interfaces"), exports);
//# sourceMappingURL=index.js.map