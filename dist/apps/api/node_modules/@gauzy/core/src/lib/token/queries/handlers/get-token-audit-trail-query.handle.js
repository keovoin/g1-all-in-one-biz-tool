"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetTokenAuditTrailHandler = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const shared_1 = require("../../shared");
const get_token_audit_trail_query_1 = require("../get-token-audit-trail.query");
let GetTokenAuditTrailHandler = class GetTokenAuditTrailHandler {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }
    async execute(query) {
        const token = await this.tokenRepository.findById(query.tokenId);
        if (!token) {
            throw new common_1.NotFoundException('Token not found');
        }
        const trail = [token];
        const visited = new Set();
        visited.add(token.id);
        // Follow the rotation chain backwards with cycle detection
        let currentToken = token;
        while (currentToken.rotatedFromTokenId) {
            if (visited.has(currentToken.rotatedFromTokenId)) {
                // Cycle detected, break
                break;
            }
            const previousToken = await this.tokenRepository.findById(currentToken.rotatedFromTokenId);
            if (previousToken) {
                trail.unshift(previousToken);
                visited.add(previousToken.id);
                currentToken = previousToken;
            }
            else {
                break;
            }
        }
        // Follow the rotation chain forwards with cycle detection
        currentToken = token;
        while (currentToken.rotatedToTokenId) {
            if (visited.has(currentToken.rotatedToTokenId)) {
                // Cycle detected, break
                break;
            }
            const nextToken = await this.tokenRepository.findById(currentToken.rotatedToTokenId);
            if (nextToken) {
                trail.push(nextToken);
                visited.add(nextToken.id);
                currentToken = nextToken;
            }
            else {
                break;
            }
        }
        return trail;
    }
};
exports.GetTokenAuditTrailHandler = GetTokenAuditTrailHandler;
exports.GetTokenAuditTrailHandler = GetTokenAuditTrailHandler = tslib_1.__decorate([
    (0, cqrs_1.QueryHandler)(get_token_audit_trail_query_1.GetTokenAuditTrailQuery),
    tslib_1.__param(0, (0, common_1.Inject)(shared_1.TokenReadRepositoryToken)),
    tslib_1.__metadata("design:paramtypes", [Object])
], GetTokenAuditTrailHandler);
//# sourceMappingURL=get-token-audit-trail-query.handle.js.map