"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestApprovalController = void 0;
const tslib_1 = require("tslib");
const crud_1 = require("./../core/crud");
const request_approval_entity_1 = require("./request-approval.entity");
const request_approval_service_1 = require("./request-approval.service");
const contracts_1 = require("@gauzy/contracts");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("./../shared/guards");
const decorators_1 = require("./../shared/decorators");
const commands_1 = require("./commands");
const pipes_1 = require("./../shared/pipes");
let RequestApprovalController = class RequestApprovalController extends crud_1.CrudController {
    constructor(requestApprovalService, commandBus) {
        super(requestApprovalService);
        this.requestApprovalService = requestApprovalService;
        this.commandBus = commandBus;
    }
    /**
     * GET all request approval by employee
     *
     * @param id
     * @param data
     * @returns
     */
    findRequestApprovalsByEmployeeId(id, data) {
        const { relations, findInput } = data;
        return this.requestApprovalService.findRequestApprovalsByEmployeeId(id, relations, findInput);
    }
    /**
     * UPDATE employee accept request approval
     *
     * @param id
     * @returns
     */
    async employeeApprovalRequestApproval(id) {
        return await this.commandBus.execute(new commands_1.RequestApprovalStatusCommand(id, contracts_1.RequestApprovalStatusTypesEnum.APPROVED));
    }
    /**
     * UPDATE employee refuse request approval
     *
     * @param id
     * @returns
     */
    async employeeRefuseRequestApproval(id) {
        return await this.commandBus.execute(new commands_1.RequestApprovalStatusCommand(id, contracts_1.RequestApprovalStatusTypesEnum.REFUSED));
    }
    /**
     * GET all request approvals
     *
     * @param data
     * @returns
     */
    findAll(data) {
        const { relations, findInput } = data;
        return this.requestApprovalService.findAllRequestApprovals({ relations }, findInput);
    }
    /**
     * CREATE request approval
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return this.requestApprovalService.createRequestApproval(entity);
    }
    /**
     * UPDATE request approval by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return this.requestApprovalService.updateRequestApproval(id, entity);
    }
};
exports.RequestApprovalController = RequestApprovalController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all request approval.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: request_approval_entity_1.RequestApproval
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.REQUEST_APPROVAL_VIEW),
    (0, common_1.Get)('employee/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RequestApprovalController.prototype, "findRequestApprovalsByEmployeeId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'employee accept request approval.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: request_approval_entity_1.RequestApproval
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.REQUEST_APPROVAL_EDIT),
    (0, common_1.Put)('approval/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RequestApprovalController.prototype, "employeeApprovalRequestApproval", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'employee refuse request approval.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: request_approval_entity_1.RequestApproval
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.REQUEST_APPROVAL_EDIT),
    (0, common_1.Put)('refuse/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], RequestApprovalController.prototype, "employeeRefuseRequestApproval", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all request approvals.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: request_approval_entity_1.RequestApproval
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.REQUEST_APPROVAL_VIEW),
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RequestApprovalController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'create a request approval.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: request_approval_entity_1.RequestApproval
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.REQUEST_APPROVAL_EDIT),
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RequestApprovalController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'update a request approval.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: request_approval_entity_1.RequestApproval
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.REQUEST_APPROVAL_EDIT),
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], RequestApprovalController.prototype, "update", null);
exports.RequestApprovalController = RequestApprovalController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('RequestApproval'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/request-approval'),
    tslib_1.__metadata("design:paramtypes", [request_approval_service_1.RequestApprovalService,
        cqrs_1.CommandBus])
], RequestApprovalController);
//# sourceMappingURL=request-approval.controller.js.map