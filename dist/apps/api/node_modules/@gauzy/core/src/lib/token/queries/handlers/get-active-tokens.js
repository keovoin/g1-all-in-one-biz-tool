"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetActiveTokensHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../shared");
const get_active_tokens_1 = require("../get-active-tokens");
let GetActiveTokensHandler = class GetActiveTokensHandler {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async execute(query) {
        const tokens = await this.tokenRepository.findActiveByUserAndType(query.userId, query.tokenType);
        return tokens;
    }
};
exports.GetActiveTokensHandler = GetActiveTokensHandler;
exports.GetActiveTokensHandler = GetActiveTokensHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_active_tokens_1.GetActiveTokensQuery),
    tslib_1.__param(0, (0, common_1.Inject)(shared_1.TokenReadRepositoryToken)),
    tslib_1.__metadata("design:paramtypes", [Object])
], GetActiveTokensHandler);
//# sourceMappingURL=get-active-tokens.js.map