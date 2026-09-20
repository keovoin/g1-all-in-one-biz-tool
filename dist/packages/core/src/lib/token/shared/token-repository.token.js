"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenMaintenanceRepositoryToken = exports.TokenWriteRepositoryToken = exports.TokenReadRepositoryToken = exports.TokenRepositoryToken = void 0;
const create_token_1 = require("./create-token");
// Tokens used for dependency injection
exports.TokenRepositoryToken = (0, create_token_1.createToken)('Token Repository Token');
exports.TokenReadRepositoryToken = (0, create_token_1.createToken)('Token Read Repository Token');
exports.TokenWriteRepositoryToken = (0, create_token_1.createToken)('Token Write Repository Token');
exports.TokenMaintenanceRepositoryToken = (0, create_token_1.createToken)('Token Maintenance Repository Token');
//# sourceMappingURL=token-repository.token.js.map