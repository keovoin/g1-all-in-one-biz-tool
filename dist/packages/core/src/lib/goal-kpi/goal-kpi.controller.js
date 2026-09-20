"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalKpiController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const goal_kpi_entity_1 = require("./goal-kpi.entity");
const goal_kpi_service_1 = require("./goal-kpi.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
let GoalKpiController = class GoalKpiController extends crud_1.CrudController {
    constructor(goalKpiService) {
        super(goalKpiService);
        this.goalKpiService = goalKpiService;
    }
    async findAll(data) {
        const { findInput } = data;
        return this.goalKpiService.findAll({
            where: { ...findInput },
            relations: ['lead']
        });
    }
    async create(entity) {
        return this.goalKpiService.create(entity);
    }
    async update(id, entity) {
        try {
            return await this.goalKpiService.create({ ...entity, id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async delete(id) {
        return this.goalKpiService.delete(id);
    }
};
exports.GoalKpiController = GoalKpiController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all KPI' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found all KPI'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No KPI found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalKpiController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Goal KPI' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'KPI added successfully',
        type: goal_kpi_entity_1.GoalKPI
    }),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [goal_kpi_entity_1.GoalKPI]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalKpiController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully edited.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, goal_kpi_entity_1.GoalKPI]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalKpiController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalKpiController.prototype, "delete", null);
exports.GoalKpiController = GoalKpiController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('GoalKpi'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/goal-kpi'),
    tslib_1.__metadata("design:paramtypes", [goal_kpi_service_1.GoalKpiService])
], GoalKpiController);
//# sourceMappingURL=goal-kpi.controller.js.map