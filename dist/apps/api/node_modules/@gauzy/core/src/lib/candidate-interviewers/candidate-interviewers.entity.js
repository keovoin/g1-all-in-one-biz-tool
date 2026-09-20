"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateInterviewers = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const class_validator_1 = require("class-validator");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_interviewers_repository_1 = require("./repository/mikro-orm-candidate-interviewers.repository");
let CandidateInterviewers = class CandidateInterviewers extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateInterviewers = CandidateInterviewers;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.CandidateInterview }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.CandidateInterview, (interview) => interview.interviewers, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateInterviewers.prototype, "interview", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.interview),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateInterviewers.prototype, "interviewId", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => internal_1.Employee }),
    (0, entity_1.MultiORMManyToOne)(() => internal_1.Employee, {
        onDelete: 'CASCADE'
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateInterviewers.prototype, "employee", void 0);
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, typeorm_1.RelationId)((it) => it.employee),
    (0, class_validator_1.IsString)(),
    (0, entity_1.ColumnIndex)(),
    (0, entity_1.MultiORMColumn)({ nullable: true, relationId: true }),
    tslib_1.__metadata("design:type", String)
], CandidateInterviewers.prototype, "employeeId", void 0);
exports.CandidateInterviewers = CandidateInterviewers = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_interviewer', { mikroOrmRepository: () => mikro_orm_candidate_interviewers_repository_1.MikroOrmCandidateInterviewersRepository })
], CandidateInterviewers);
//# sourceMappingURL=candidate-interviewers.entity.js.map