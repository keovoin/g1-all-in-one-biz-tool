"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalTimeFrameController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crud_1 = require("./../core/crud");
const goal_time_frame_entity_1 = require("./goal-time-frame.entity");
const swagger_1 = require("@nestjs/swagger");
const goal_time_frame_service_1 = require("./goal-time-frame.service");
const pipes_1 = require("./../shared/pipes");
const guards_1 = require("./../shared/guards");
const dto_1 = require("./dto");
let GoalTimeFrameController = class GoalTimeFrameController extends crud_1.CrudController {
    constructor(goalTimeFrameService) {
        super(goalTimeFrameService);
        this.goalTimeFrameService = goalTimeFrameService;
    }
    async findAll(data) {
        const { findInput } = data;
        return this.goalTimeFrameService.findAll({
            where: { ...findInput }
        });
    }
    async create(entity) {
        return this.goalTimeFrameService.create(entity);
    }
    async getByName(name) {
        return this.goalTimeFrameService.findAll({ where: { name: name } });
    }
    async update(id, entity) {
        try {
            return await this.goalTimeFrameService.create({ ...entity, id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
    async delete(id) {
        return this.goalTimeFrameService.delete(id);
    }
};
exports.GoalTimeFrameController = GoalTimeFrameController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get all Goal Time Frames' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found all Time Frames'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Time Frame found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalTimeFrameController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Goal Time Frame' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Time Frame added successfully',
        type: goal_time_frame_entity_1.GoalTimeFrame
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateGoalTimeFrameDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalTimeFrameController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find Goal Time Frames with name' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found all Time Frames'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No Time Frame found'
    }),
    (0, common_1.Get)(':name'),
    tslib_1.__param(0, (0, common_1.Param)('name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalTimeFrameController.prototype, "getByName", null);
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
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateGoalTimeFrameDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalTimeFrameController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalTimeFrameController.prototype, "delete", null);
exports.GoalTimeFrameController = GoalTimeFrameController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('GoalTimeFrame'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/goal-time-frame'),
    tslib_1.__metadata("design:paramtypes", [goal_time_frame_service_1.GoalTimeFrameService])
], GoalTimeFrameController);
//# sourceMappingURL=goal-time-frame.controller.js.map