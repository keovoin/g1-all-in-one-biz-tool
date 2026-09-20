"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTokenByIdHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../shared");
const get_token_by_id_query_1 = require("../get-token-by-id.query");
let GetTokenByIdHandler = class GetTokenByIdHandler {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async execute(query) {
        const token = await this.tokenRepository.findById(query.tokenId);
        if (!token) {
            throw new common_1.NotFoundException('Token not found');
        }
        return token;
    }
};
exports.GetTokenByIdHandler = GetTokenByIdHandler;
exports.GetTokenByIdHandler = GetTokenByIdHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_token_by_id_query_1.GetTokenByIdQuery),
    tslib_1.__param(0, (0, common_1.Inject)(shared_1.TokenReadRepositoryToken)),
    tslib_1.__metadata("design:paramtypes", [Object])
], GetTokenByIdHandler);
//# sourceMappingURL=get-tokens-by-id-query.handler.js.map