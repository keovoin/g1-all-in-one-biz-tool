"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateExperienceService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_candidate_experience_repository_1 = require("./repository/type-orm-candidate-experience.repository");
const mikro_orm_candidate_experience_repository_1 = require("./repository/mikro-orm-candidate-experience.repository");
let CandidateExperienceService = class CandidateExperienceService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateExperienceRepository, mikroOrmCandidateExperienceRepository) {
        super(typeOrmCandidateExperienceRepository, mikroOrmCandidateExperienceRepository);
    }
    /**
     *
     * @param filter
     * @returns
     */
    async findAll(filter) {
        return await super.findAll({
            select: {
                organization: {
                    id: true,
                    name: true,
                    officialName: true
                }
            },
            ...filter
        });
    }
};
exports.CandidateExperienceService = CandidateExperienceService;
exports.CandidateExperienceService = CandidateExperienceService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_experience_repository_1.TypeOrmCandidateExperienceRepository,
        mikro_orm_candidate_experience_repository_1.MikroOrmCandidateExperienceRepository])
], CandidateExperienceService);
//# sourceMappingURL=candidate-experience.service.js.map