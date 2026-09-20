"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalTeamModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const request_approval_team_entity_1 = require("./request-approval-team.entity");
const nestjs_1 = require("@mikro-orm/nestjs");
let RequestApprovalTeamModule = class RequestApprovalTeamModule {
};
exports.RequestApprovalTeamModule = RequestApprovalTeamModule;
exports.RequestApprovalTeamModule = RequestApprovalTeamModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([request_approval_team_entity_1.RequestApprovalTeam]),
            nestjs_1.MikroOrmModule.forFeature([request_approval_team_entity_1.RequestApprovalTeam]),
        ]
    })
], RequestApprovalTeamModule);
//# sourceMappingURL=request-approval-team.module.js.map