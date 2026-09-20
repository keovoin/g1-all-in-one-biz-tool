"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalGeneralSettingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const crud_1 = require("./../core/crud");
const goal_general_setting_entity_1 = require("./goal-general-setting.entity");
const goal_general_setting_service_1 = require("./goal-general-setting.service");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let GoalGeneralSettingController = class GoalGeneralSettingController extends crud_1.CrudController {
    constructor(goalGeneralSettingService) {
        super(goalGeneralSettingService);
        this.goalGeneralSettingService = goalGeneralSettingService;
    }
    async findAll(data) {
        const { findInput = null } = data;
        return this.goalGeneralSettingService.findAll({
            where: { ...findInput }
        });
    }
    async create(entity) {
        return this.goalGeneralSettingService.create(entity);
    }
    async update(id, entity) {
        try {
            //We are using create here because create calls the method save()
            //We need save() to save ManyToMany relations
            return await this.goalGeneralSettingService.create({ ...entity, id });
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
};
exports.GoalGeneralSettingController = GoalGeneralSettingController;
tslib_1.__decorate([
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalGeneralSettingController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Goal General Setting' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Goal general setting Created successfully',
        type: goal_general_setting_entity_1.GoalGeneralSetting
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateGoalGeneralSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalGeneralSettingController.prototype, "create", null);
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
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateGoalGeneralSettingDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalGeneralSettingController.prototype, "update", null);
exports.GoalGeneralSettingController = GoalGeneralSettingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('GoalGeneralSetting'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/goal-general-setting'),
    tslib_1.__metadata("design:paramtypes", [goal_general_setting_service_1.GoalGeneralSettingService])
], GoalGeneralSettingController);
//# sourceMappingURL=goal-general-setting.controller.js.map