"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTemplateController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const goal_template_service_1 = require("./goal-template.service");
const crud_1 = require("./../core/crud");
const goal_template_entity_1 = require("./goal-template.entity");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
let GoalTemplateController = class GoalTemplateController extends crud_1.CrudController {
    constructor(goalTemplateService) {
        super(goalTemplateService);
        this.goalTemplateService = goalTemplateService;
    }
    /**
     * GET all goal templates
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { findInput } = data;
        return this.goalTemplateService.findAll({
            relations: ['keyResults', 'keyResults.kpi'],
            where: { ...findInput }
        });
    }
    /**
     * CREATE goal template
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return this.goalTemplateService.create(entity);
    }
};
exports.GoalTemplateController = GoalTemplateController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find goal templates.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found goal templates',
        type: goal_template_entity_1.GoalTemplate
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
], GoalTemplateController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Goal Template' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Goal Template Created successfully',
        type: goal_template_entity_1.GoalTemplate
    }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [goal_template_entity_1.GoalTemplate]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalTemplateController.prototype, "create", null);
exports.GoalTemplateController = GoalTemplateController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('GoalTemplates'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/goal-templates'),
    tslib_1.__metadata("design:paramtypes", [goal_template_service_1.GoalTemplateService])
], GoalTemplateController);
//# sourceMappingURL=goal-template.controller.js.map