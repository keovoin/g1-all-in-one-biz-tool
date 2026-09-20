"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffPolicyController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const time_off_policy_entity_1 = require("./time-off-policy.entity");
const time_off_policy_service_1 = require("./time-off-policy.service");
let TimeOffPolicyController = class TimeOffPolicyController extends crud_1.CrudController {
    constructor(timeOffPolicyService) {
        super(timeOffPolicyService);
        this.timeOffPolicyService = timeOffPolicyService;
    }
    /**
     * GET all time off policies using pagination
     *
     */
    async pagination(filter) {
        return this.timeOffPolicyService.paginate(filter);
    }
    /**
     * GET all time off policies
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations, findInput } = data;
        return this.timeOffPolicyService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * CREATE time off policy
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.timeOffPolicyService.create(entity);
    }
    /**
     * UPDATE time off policy by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.timeOffPolicyService.update(id, entity);
    }
};
exports.TimeOffPolicyController = TimeOffPolicyController;
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_OFF_POLICY_VIEW),
    (0, common_1.Get)('pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffPolicyController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all policies.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: time_off_policy_entity_1.TimeOffPolicy
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_OFF_POLICY_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffPolicyController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.' /*, type: T*/
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input, The response body may contain clues as to what went wrong'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_POLICY_ADD),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffPolicyController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update record' }),
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
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_POLICY_EDIT),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffPolicyController.prototype, "update", null);
exports.TimeOffPolicyController = TimeOffPolicyController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TimeOffPolicy'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_POLICY_EDIT),
    (0, common_1.Controller)('/time-off-policy'),
    tslib_1.__metadata("design:paramtypes", [time_off_policy_service_1.TimeOffPolicyService])
], TimeOffPolicyController);
//# sourceMappingURL=time-off-policy.controller.js.map