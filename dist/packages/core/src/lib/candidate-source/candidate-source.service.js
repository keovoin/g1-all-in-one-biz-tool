"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandidateSourceService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const type_orm_candidate_source_repository_1 = require("./repository/type-orm-candidate-source.repository");
const mikro_orm_candidate_source_repository_1 = require("./repository/mikro-orm-candidate-source.repository");
let CandidateSourceService = class CandidateSourceService extends crud_1.TenantAwareCrudService {
    constructor(typeOrmCandidateSourceRepository, mikroOrmCandidateSourceRepository) {
        super(typeOrmCandidateSourceRepository, mikroOrmCandidateSourceRepository);
    }
    /**
     *
     * @param sources
     * @returns
     */
    async createBulk(sources) {
        if (!sources || sources.length === 0) {
            return [];
        }
        return await this.createMany(sources);
    }
};
exports.CandidateSourceService = CandidateSourceService;
exports.CandidateSourceService = CandidateSourceService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_candidate_source_repository_1.TypeOrmCandidateSourceRepository,
        mikro_orm_candidate_source_repository_1.MikroOrmCandidateSourceRepository])
], CandidateSourceService);
//# sourceMappingURL=candidate-source.service.js.map