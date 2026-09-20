"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_REFRESH_TOKEN = exports.REFRESH_TOKEN = exports.REFRESH_TOKEN_TYPE = void 0;
const create_token_1 = require("../token/shared/create-token");
exports.REFRESH_TOKEN_TYPE = 'REFRESH_TOKEN_TYPE';
exports.REFRESH_TOKEN = (0, create_token_1.createToken)('RefreshTokenServiceToken');
exports.JWT_REFRESH_TOKEN = (0, create_token_1.createToken)('JwtRefreshToken');
//# sourceMappingURL=type.token.js.map