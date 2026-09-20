"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTokensHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../shared");
const get_tokens_query_1 = require("../get-tokens.query");
let GetTokensHandler = class GetTokensHandler {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async execute(query) {
        return this.tokenRepository.query(query.filters, query.limit, query.offset);
    }
};
exports.GetTokensHandler = GetTokensHandler;
exports.GetTokensHandler = GetTokensHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_tokens_query_1.GetTokensQuery),
    tslib_1.__param(0, (0, common_1.Inject)(shared_1.TokenReadRepositoryToken)),
    tslib_1.__metadata("design:paramtypes", [Object])
], GetTokensHandler);
//# sourceMappingURL=get-tokens-query.js.map