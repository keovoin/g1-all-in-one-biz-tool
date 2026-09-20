"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApprovalPolicyController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const decorators_1 = require("./../shared/decorators");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const core_1 = require("../core");
const approval_policy_entity_1 = require("./approval-policy.entity");
const approval_policy_service_1 = require("./approval-policy.service");
const commands_1 = require("./commands");
const dto_1 = require("./dto");
let ApprovalPolicyController = class ApprovalPolicyController extends core_1.CrudController {
    constructor(approvalPolicyService, commandBus) {
        super(approvalPolicyService);
        this.approvalPolicyService = approvalPolicyService;
        this.commandBus = commandBus;
    }
    /**
     * GET all approval policies except time off and equipment sharing policy
     *
     * @param data
     * @returns
     */
    async findApprovalPoliciesForRequestApproval(data) {
        return await this.commandBus.execute(new commands_1.RequestApprovalPolicyGetCommand(data));
    }
    /**
     * GET approval policies by pagination
     *
     * @param options
     * @returns
     */
    async pagination(options) {
        return this.approvalPolicyService.pagination(options);
    }
    /**
     * GET all approval policies
     *
     * @param data
     * @returns
     */
    async findAll(options) {
        return await this.commandBus.execute(new commands_1.ApprovalPolicyGetCommand(options));
    }
    /**
     * CREATE approval policy
     *
     * @param entity
     * @returns
     */
    async create(entity) {
        return await this.commandBus.execute(new commands_1.ApprovalPolicyCreateCommand(entity));
    }
    /**
     * UPDATE approval policy by id
     *
     * @param id
     * @param entity
     * @returns
     */
    async update(id, entity) {
        return await this.commandBus.execute(new commands_1.ApprovalPolicyUpdateCommand(id, entity));
    }
};
exports.ApprovalPolicyController = ApprovalPolicyController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all approval policies except time off and equipment sharing policy.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: approval_policy_entity_1.ApprovalPolicy
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.APPROVAL_POLICY_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Get)('/request-approval'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ApprovalPolicyController.prototype, "findApprovalPoliciesForRequestApproval", null);
tslib_1.__decorate([
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.APPROVAL_POLICY_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ApprovalPolicyController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all approval policies.' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found policies',
        type: approval_policy_entity_1.ApprovalPolicy
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.APPROVAL_POLICY_VIEW),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.Get)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [core_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ApprovalPolicyController.prototype, "findAll", null);
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
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [dto_1.CreateApprovalPolicyDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ApprovalPolicyController.prototype, "create", null);
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
    (0, common_1.Put)('/:id'),
    (0, pipes_1.UseValidationPipe)({ whitelist: true }),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, dto_1.UpdateApprovalPolicyDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], ApprovalPolicyController.prototype, "update", null);
exports.ApprovalPolicyController = ApprovalPolicyController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('ApprovalPolicy'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.APPROVAL_POLICY_EDIT),
    (0, common_1.Controller)('/approval-policy'),
    tslib_1.__metadata("design:paramtypes", [approval_policy_service_1.ApprovalPolicyService,
        cqrs_1.CommandBus])
], ApprovalPolicyController);
//# sourceMappingURL=approval-policy.controller.js.map