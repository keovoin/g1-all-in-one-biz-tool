"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchOccupationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const type_orm_job_search_occupation_repository_1 = require("./repository/type-orm-job-search-occupation.repository");
const mikro_orm_job_search_occupation_repository_1 = require("./repository/mikro-orm-job-search-occupation.repository");
let JobSearchOccupationService = class JobSearchOccupationService extends core_1.TenantAwareCrudService {
    constructor(typeOrmJobSearchOccupationRepository, mikroOrmJobSearchOccupationRepository) {
        super(typeOrmJobSearchOccupationRepository, mikroOrmJobSearchOccupationRepository);
    }
};
exports.JobSearchOccupationService = JobSearchOccupationService;
exports.JobSearchOccupationService = JobSearchOccupationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_job_search_occupation_repository_1.TypeOrmJobSearchOccupationRepository,
        mikro_orm_job_search_occupation_repository_1.MikroOrmJobSearchOccupationRepository])
], JobSearchOccupationService);
//# sourceMappingURL=job-search-occupation.service.js.map