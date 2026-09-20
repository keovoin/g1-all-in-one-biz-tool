"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateTechnologiesService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const utils_1 = require("./../core/utils");
const type_orm_candidate_technologies_repository_1 = require("./repository/type-orm-candidate-technologies.repository");
const mikro_orm_candidate_technologies_repository_1 = require("./repository/mikro-orm-candidate-technologies.repository");
let CandidateTechnologiesService = class CandidateTechnologiesService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateTechnologiesRepository, mikroOrmCandidateTechnologiesRepository) {
        super(typeOrmCandidateTechnologiesRepository, mikroOrmCandidateTechnologiesRepository);
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
    async getTechnologiesByInterviewId(interviewId) {
        switch (this.ormType) {
            case utils_1.MultiORMEnum.MikroORM:
                return await this.mikroOrmRepository.find({ interviewId });
            case utils_1.MultiORMEnum.TypeORM:
            default:
                return await this.typeOrmRepository
                    .createQueryBuilder('candidate_technology')
                    .where('candidate_technology.interviewId = :interviewId', {
                    interviewId
                })
                    .getMany();
        }
    }
};
exports.CandidateTechnologiesService = CandidateTechnologiesService;
exports.CandidateTechnologiesService = CandidateTechnologiesService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_technologies_repository_1.TypeOrmCandidateTechnologiesRepository,
        mikro_orm_candidate_technologies_repository_1.MikroOrmCandidateTechnologiesRepository])
], CandidateTechnologiesService);
//# sourceMappingURL=candidate-technologies.service.js.map