"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobSearchOccupationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const core_1 = require("@gauzy/core");
const job_search_occupation_service_1 = require("./job-search-occupation.service");
let JobSearchOccupationController = class JobSearchOccupationController extends core_1.CrudController {
    constructor(jobSearchOccupationService) {
        super(jobSearchOccupationService);
        this.jobSearchOccupationService = jobSearchOccupationService;
    }
};
exports.JobSearchOccupationController = JobSearchOccupationController;
exports.JobSearchOccupationController = JobSearchOccupationController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('JobSearchOccupation'),
    (0, common_1.Controller)('/job-preset/job-search-occupation'),
    tslib_1.__metadata("design:paramtypes", [job_search_occupation_service_1.JobSearchOccupationService])
], JobSearchOccupationController);
//# sourceMappingURL=job-search-occupation.controller.js.map