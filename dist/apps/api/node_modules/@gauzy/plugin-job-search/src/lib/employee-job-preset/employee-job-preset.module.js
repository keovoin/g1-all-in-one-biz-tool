"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeJobPresetModule = exports.entities = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const typeorm_1 = require("@nestjs/typeorm");
const plugin_integration_ai_1 = require("@gauzy/plugin-integration-ai");
const nestjs_1 = require("@mikro-orm/nestjs");
const core_1 = require("@gauzy/core");
const handlers_1 = require("./commands/handlers");
const employee_preset_controller_1 = require("./employee-preset.controller");
const employee_upwork_jobs_search_criterion_entity_1 = require("./employee-upwork-jobs-search-criterion.entity");
const job_preset_upwork_job_search_criterion_entity_1 = require("./job-preset-upwork-job-search-criterion.entity");
const job_preset_entity_1 = require("./job-preset.entity");
const job_preset_service_1 = require("./job-preset.service");
const job_search_category_controller_1 = require("./job-search-category/job-search-category.controller");
const job_search_category_entity_1 = require("./job-search-category/job-search-category.entity");
const job_search_category_service_1 = require("./job-search-category/job-search-category.service");
const type_orm_job_search_category_repository_1 = require("./job-search-category/repository/type-orm-job-search-category.repository");
const job_search_occupation_controller_1 = require("./job-search-occupation/job-search-occupation.controller");
const job_search_occupation_entity_1 = require("./job-search-occupation/job-search-occupation.entity");
const job_search_occupation_service_1 = require("./job-search-occupation/job-search-occupation.service");
const type_orm_job_search_occupation_repository_1 = require("./job-search-occupation/repository/type-orm-job-search-occupation.repository");
const job_search_preset_controller_1 = require("./job-search-preset.controller");
const type_orm_job_preset_repository_1 = require("./repository/type-orm-job-preset.repository");
const type_orm_employee_upwork_jobs_search_criterion_repository_1 = require("./repository/type-orm-employee-upwork-jobs-search-criterion.repository");
const type_orm_job_preset_upwork_job_search_criterion_repository_1 = require("./repository/type-orm-job-preset-upwork-job-search-criterion.repository");
exports.entities = [
    job_preset_entity_1.JobPreset,
    job_preset_upwork_job_search_criterion_entity_1.JobPresetUpworkJobSearchCriterion,
    employee_upwork_jobs_search_criterion_entity_1.EmployeeUpworkJobsSearchCriterion,
    job_search_occupation_entity_1.JobSearchOccupation,
    job_search_category_entity_1.JobSearchCategory
];
let EmployeeJobPresetModule = class EmployeeJobPresetModule {
};
exports.EmployeeJobPresetModule = EmployeeJobPresetModule;
exports.EmployeeJobPresetModule = EmployeeJobPresetModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([...exports.entities]),
            nestjs_1.MikroOrmModule.forFeature([...exports.entities]),
            core_1.EmployeeModule,
            plugin_integration_ai_1.GauzyAIModule.forRoot(),
            cqrs_1.CqrsModule
        ],
        controllers: [
            job_search_occupation_controller_1.JobSearchOccupationController,
            job_search_category_controller_1.JobSearchCategoryController,
            employee_preset_controller_1.EmployeePresetController,
            job_search_preset_controller_1.JobSearchPresetController
        ],
        providers: [
            job_preset_service_1.JobPresetService,
            job_search_category_service_1.JobSearchCategoryService,
            job_search_occupation_service_1.JobSearchOccupationService,
            type_orm_job_preset_repository_1.TypeOrmJobPresetRepository,
            type_orm_job_search_category_repository_1.TypeOrmJobSearchCategoryRepository,
            type_orm_job_search_occupation_repository_1.TypeOrmJobSearchOccupationRepository,
            type_orm_job_preset_upwork_job_search_criterion_repository_1.TypeOrmJobPresetUpworkJobSearchCriterionRepository,
            type_orm_employee_upwork_jobs_search_criterion_repository_1.TypeOrmEmployeeUpworkJobsSearchCriterionRepository,
            ...handlers_1.CommandHandlers
        ],
        exports: [job_preset_service_1.JobPresetService, job_search_category_service_1.JobSearchCategoryService, job_search_occupation_service_1.JobSearchOccupationService]
    })
], EmployeeJobPresetModule);
//# sourceMappingURL=employee-job-preset.module.js.map