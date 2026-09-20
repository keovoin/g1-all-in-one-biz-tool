"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenHasherService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crypto = require("node:crypto");
let TokenHasherService = class TokenHasherService {
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
};
exports.TokenHasherService = TokenHasherService;
exports.TokenHasherService = TokenHasherService = tslib_1.__decorate([
    (0, common_1.Injectable)()
], TokenHasherService);
//# sourceMappingURL=token-hasher.service.js.map