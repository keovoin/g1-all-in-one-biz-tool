"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const time_off_request_entity_1 = require("./time-off-request.entity");
const time_off_request_service_1 = require("./time-off-request.service");
const commands_1 = require("./commands");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const pipes_1 = require("./../shared/pipes");
let TimeOffRequestController = class TimeOffRequestController extends crud_1.CrudController {
    constructor(timeOffRequestService, commandBus) {
        super(timeOffRequestService);
        this.timeOffRequestService = timeOffRequestService;
        this.commandBus = commandBus;
    }
    async pagination(options) {
        return await this.timeOffRequestService.pagination(options);
    }
    /**
     * UPDATE time off request approved
     *
     * @param id
     * @returns
     */
    async timeOffRequestApproved(id) {
        return this.commandBus.execute(new commands_1.TimeOffStatusCommand(id, contracts_1.StatusTypesEnum.APPROVED));
    }
    /**
     * UPDATE time off request denied
     *
     * @param id
     * @returns
     */
    async timeOffRequestDenied(id) {
        return this.commandBus.execute(new commands_1.TimeOffStatusCommand(id, contracts_1.StatusTypesEnum.DENIED));
    }
    /**
     * GET all time off requests
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations, findInput } = data;
        return await this.timeOffRequestService.getAllTimeOffRequests(relations, findInput);
    }
    /**
     * CREATE new time off request/holiday
     *
     * @param entity
     * @param options
     * @returns
     */
    async create(entity) {
        return await this.timeOffRequestService.create(entity);
    }
    /**
     * UPDATE time off request by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.timeOffRequestService.updateTimeOffByAdmin(id, entity);
    }
};
exports.TimeOffRequestController = TimeOffRequestController;
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_OFF_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffRequestController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Time off request approved' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Approved time off request',
        type: time_off_request_entity_1.TimeOffRequest
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_EDIT),
    (0, common_1.Put)('/approval/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffRequestController.prototype, "timeOffRequestApproved", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Time off request denied' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Denied time off request',
        type: time_off_request_entity_1.TimeOffRequest
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.RoleGuard),
    (0, decorators_1.Roles)(contracts_1.RolesEnum.SUPER_ADMIN, contracts_1.RolesEnum.ADMIN),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_EDIT),
    (0, common_1.Put)('/denied/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffRequestController.prototype, "timeOffRequestDenied", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all time off requests.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found time off requests',
        type: time_off_request_entity_1.TimeOffRequest
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.TIME_OFF_VIEW),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffRequestController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create new time off request / holiday record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The new time off request / holiday record created'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_ADD),
    (0, common_1.Post)('/'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffRequestController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Time off request update' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found request time off',
        type: time_off_request_entity_1.TimeOffRequest
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_DELETE),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TimeOffRequestController.prototype, "update", null);
exports.TimeOffRequestController = TimeOffRequestController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('TimeOffRequest'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.TIME_OFF_EDIT),
    (0, common_1.Controller)('/time-off-request'),
    tslib_1.__metadata("design:paramtypes", [time_off_request_service_1.TimeOffRequestService,
        cqrs_1.CommandBus])
], TimeOffRequestController);
//# sourceMappingURL=time-off-request.controller.js.map