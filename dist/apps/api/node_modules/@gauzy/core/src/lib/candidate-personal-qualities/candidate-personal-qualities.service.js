"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidatePersonalQualitiesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_candidate_personal_qualities_repository_1 = require("./repository/type-orm-candidate-personal-qualities.repository");
const mikro_orm_candidate_personal_qualities_repository_1 = require("./repository/mikro-orm-candidate-personal-qualities.repository");
let CandidatePersonalQualitiesService = class CandidatePersonalQualitiesService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidatePersonalQualitiesRepository, mikroOrmCandidatePersonalQualitiesRepository) {
        super(typeOrmCandidatePersonalQualitiesRepository, mikroOrmCandidatePersonalQualitiesRepository);
    }
    /**
     *
     * @param createInput
     * @returns
     */
    async createBulk(createInput) {
        return await this.saveMany(createInput);
    }
    /**
     *
     * @param interviewId
     * @returns
     */
    async getPersonalQualitiesByInterviewId(interviewId) {
        return await this.typeOrmRepository
            .createQueryBuilder('candidate_personal_quality')
            .where('candidate_personal_quality.interviewId = :interviewId', {
            interviewId
        })
            .getMany();
    }
};
exports.CandidatePersonalQualitiesService = CandidatePersonalQualitiesService;
exports.CandidatePersonalQualitiesService = CandidatePersonalQualitiesService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_personal_qualities_repository_1.TypeOrmCandidatePersonalQualitiesRepository,
        mikro_orm_candidate_personal_qualities_repository_1.MikroOrmCandidatePersonalQualitiesRepository])
], CandidatePersonalQualitiesService);
//# sourceMappingURL=candidate-personal-qualities.service.js.map