"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchCategoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const core_1 = require("@gauzy/core");
const mikro_orm_job_search_category_repository_1 = require("./repository/mikro-orm-job-search-category.repository");
const type_orm_job_search_category_repository_1 = require("./repository/type-orm-job-search-category.repository");
let JobSearchCategoryService = class JobSearchCategoryService extends core_1.TenantAwareCrudService {
    constructor(typeOrmJobSearchCategoryRepository, mikroOrmJobSearchCategoryRepository) {
        super(typeOrmJobSearchCategoryRepository, mikroOrmJobSearchCategoryRepository);
    }
};
exports.JobSearchCategoryService = JobSearchCategoryService;
exports.JobSearchCategoryService = JobSearchCategoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_job_search_category_repository_1.TypeOrmJobSearchCategoryRepository,
        mikro_orm_job_search_category_repository_1.MikroOrmJobSearchCategoryRepository])
], JobSearchCategoryService);
//# sourceMappingURL=job-search-category.service.js.map