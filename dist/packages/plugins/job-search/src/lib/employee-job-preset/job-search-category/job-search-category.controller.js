"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchCategoryController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
const job_search_category_service_1 = require("./job-search-category.service");
let JobSearchCategoryController = class JobSearchCategoryController extends core_1.CrudController {
    constructor(jobSearchCategoryService) {
        super(jobSearchCategoryService);
        this.jobSearchCategoryService = jobSearchCategoryService;
    }
};
exports.JobSearchCategoryController = JobSearchCategoryController;
exports.JobSearchCategoryController = JobSearchCategoryController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('JobSearchCategory'),
    (0, common_1.Controller)('/job-preset/job-search-category'),
    tslib_1.__metadata("design:paramtypes", [job_search_category_service_1.JobSearchCategoryService])
], JobSearchCategoryController);
//# sourceMappingURL=job-search-category.controller.js.map