"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateEducationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_candidate_education_repository_1 = require("./repository/type-orm-candidate-education.repository");
const mikro_orm_candidate_education_repository_1 = require("./repository/mikro-orm-candidate-education.repository");
let CandidateEducationService = class CandidateEducationService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateEducationRepository, mikroOrmCandidateEducationRepository) {
        super(typeOrmCandidateEducationRepository, mikroOrmCandidateEducationRepository);
    }
};
exports.CandidateEducationService = CandidateEducationService;
exports.CandidateEducationService = CandidateEducationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_education_repository_1.TypeOrmCandidateEducationRepository,
        mikro_orm_candidate_education_repository_1.MikroOrmCandidateEducationRepository])
], CandidateEducationService);
//# sourceMappingURL=candidate-education.service.js.map