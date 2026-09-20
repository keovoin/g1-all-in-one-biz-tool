"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSource = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const internal_1 = require("../core/entities/internal");
const entity_1 = require("./../core/decorators/entity");
const mikro_orm_candidate_source_repository_1 = require("./repository/mikro-orm-candidate-source.repository");
let CandidateSource = class CandidateSource extends internal_1.TenantOrganizationBaseEntity {
};
exports.CandidateSource = CandidateSource;
tslib_1.__decorate([
    (0, swagger_1.ApiProperty)({ type: () => String }),
    (0, entity_1.MultiORMColumn)(),
    tslib_1.__metadata("design:type", String)
], CandidateSource.prototype, "name", void 0);
tslib_1.__decorate([
    (0, entity_1.MultiORMOneToOne)(() => internal_1.Candidate, (candidate) => candidate.source, {
        /** This column is a boolean flag indicating that this is the inverse side of the relationship, and it doesn't control the foreign key directly  */
        owner: false
    }),
    tslib_1.__metadata("design:type", Object)
], CandidateSource.prototype, "candidate", void 0);
exports.CandidateSource = CandidateSource = tslib_1.__decorate([
    (0, entity_1.MultiORMEntity)('candidate_source', { mikroOrmRepository: () => mikro_orm_candidate_source_repository_1.MikroOrmCandidateSourceRepository })
], CandidateSource);
//# sourceMappingURL=candidate-source.entity.js.map