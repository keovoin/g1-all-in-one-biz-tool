"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoalController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const goal_service_1 = require("./goal.service");
const goal_entity_1 = require("./goal.entity");
const crud_1 = require("./../core/crud");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const dto_1 = require("./dto");
let GoalController = class GoalController extends crud_1.CrudController {
    constructor(goalService) {
        super(goalService);
        this.goalService = goalService;
    }
    async create(entity) {
        return this.goalService.create(entity);
    }
    async findAll(data) {
        const { relations, findInput } = data;
        return this.goalService.findAll({
            where: { ...findInput },
            relations,
            order: { createdAt: 'ASC' }
        });
    }
    async update(id, entity) {
        // This is an update-through-create, so an id that matches nothing would be INSERTed as a new
        // row — and fail on a NOT NULL column, answering 400 with the raw SQL in the body.
        // `findOneByIdString` throws NotFoundException when the row is not in the caller's tenant, so
        // this call turns that into a clean 404.
        await this.goalService.findOneByIdString(id);
        //We are using create here because create calls the method save()
        //We need save() to save ManyToMany relations
        //
        //Errors are NOT swallowed: `create()` now rejects a cross-tenant write with ForbiddenException,
        //and returning `undefined` would answer a refused write with 202 and an empty body.
        return await this.goalService.create({ ...entity, id });
    }
    async delete(id) {
        return this.goalService.delete(id);
    }
};
exports.GoalController = GoalController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create Goal' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Goal Created successfully',
        type: goal_entity_1.Goal
    }),
    (0, common_1.Post)(),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateGoalDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalController.prototype, "create", null);
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
], GoalController.prototype, "findAll", null);
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
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateGoalDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalController.prototype, "update", null);
tslib_1.__decorate([
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GoalController.prototype, "delete", null);
exports.GoalController = GoalController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('Goals'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard),
    (0, common_1.Controller)('/goals'),
    tslib_1.__metadata("design:paramtypes", [goal_service_1.GoalService])
], GoalController);
//# sourceMappingURL=goal.controller.js.map