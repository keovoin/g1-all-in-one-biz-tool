"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_ACCESS_TOKEN = exports.ACCESS_TOKEN = exports.ACCESS_TOKEN_TYPE = void 0;
const create_token_1 = require("../token/shared/create-token");
exports.ACCESS_TOKEN_TYPE = 'ACCESS_TOKEN_TYPE';
exports.ACCESS_TOKEN = (0, create_token_1.createToken)('AccessTokenServiceToken');
exports.JWT_ACCESS_TOKEN = (0, create_token_1.createToken)('JwtAccessToken');
//# sourceMappingURL=type.token.js.map