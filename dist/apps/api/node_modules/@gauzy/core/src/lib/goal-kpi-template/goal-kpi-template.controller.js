"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalKpiTemplateController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const goal_kpi_template_entity_1 = require("./goal-kpi-template.entity");
const goal_kpi_template_service_1 = require("./goal-kpi-template.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
let GoalKpiTemplateController = class GoalKpiTemplateController extends crud_1.CrudController {
    constructor(goalKpiTemplateService) {
        super(goalKpiTemplateService);
        this.goalKpiTemplateService = goalKpiTemplateService;
    }
    /**
     * GET all goal kpi templates
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations, findInput } = data;
        return this.goalKpiTemplateService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * CREATE goal kpi template
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return this.goalKpiTemplateService.create(entity);
    }
};
exports.GoalKpiTemplateController = GoalKpiTemplateController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all goal kpi templates.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found goal kpi templates',
        type: goal_kpi_template_entity_1.GoalKPITemplate
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalKpiTemplateController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create goal kpi template' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Goal kpi template created successfully',
        type: goal_kpi_template_entity_1.GoalKPITemplate
    }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [goal_kpi_template_entity_1.GoalKPITemplate]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalKpiTemplateController.prototype, "create", null);
exports.GoalKpiTemplateController = GoalKpiTemplateController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('GoalKpiTemplate'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/goal-kpi-template'),
    tslib_1.__metadata("design:paramtypes", [goal_kpi_template_service_1.GoalKpiTemplateService])
], GoalKpiTemplateController);
//# sourceMappingURL=goal-kpi-template.controller.js.map