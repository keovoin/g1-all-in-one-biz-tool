"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalTeam = void 0;
const tslib_1 = require("tslib");
/*
  - Request Approval Employee table is the third table which will combine the employee table and the request approval table.
  - Request Approval Employee table has the many to one relationship to the RequestApproval table and the Employee table by requestApprovalId and employeeId
*/
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_request_approval_team_repository_1 = require("./repository/mikro-orm-request-approval-team.repository");
let RequestApprovalTeam = class RequestApprovalTeam extends internal_1.TenantOrganizationBaseEntity {
};
exports.RequestApprovalTeam = RequestApprovalTeam;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => Number }),
    (0, class_validator_1.IsNumber)(),
    (0, entity_1.MultiORMColumn)({ nullable: true }),
    tslib_1.__metadata("design:type", Number)
], RequestApprovalTeam.prototype, "status", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.RequestApproval, (requestApproval) => requestApproval.teamApprovals, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], RequestApprovalTeam.prototype, "requestApproval", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.requestApproval),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], RequestApprovalTeam.prototype, "requestApprovalId", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMManyToOne)(() => internal_1.OrganizationTeam, (team) => team.requestApprovals, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], RequestApprovalTeam.prototype, "team", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.team),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], RequestApprovalTeam.prototype, "teamId", void 0);
exports.RequestApprovalTeam = RequestApprovalTeam = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('request_approval_team', { mikroOrmRepository: () => mikro_orm_request_approval_team_repository_1.MikroOrmRequestApprovalTeamRepository })
], RequestApprovalTeam);
//# sourceMappingURL=request-approval-team.entity.js.map