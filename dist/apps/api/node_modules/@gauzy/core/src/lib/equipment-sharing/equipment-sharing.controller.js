"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cqrs_1 = require("@nestjs/cqrs");
const swagger_1 = require("@nestjs/swagger");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const equipment_sharing_entity_1 = require("./equipment-sharing.entity");
const equipment_sharing_service_1 = require("./equipment-sharing.service");
const commands_1 = require("./commands");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
let EquipmentSharingController = class EquipmentSharingController extends crud_1.CrudController {
    constructor(equipmentSharingService, commandBus) {
        super(equipmentSharingService);
        this.equipmentSharingService = equipmentSharingService;
        this.commandBus = commandBus;
    }
    /**
     * GET equipment sharings by organization id
     *
     * @param orgId
     * @returns
     */
    async findEquipmentSharingsByOrganizationId(organizationId) {
        return this.equipmentSharingService.findEquipmentSharingsByOrganizationId(organizationId);
    }
    /**
     * GET equipment sharings by employee id
     *
     * @param employeeId
     * @returns
     */
    async findEquipmentSharingsByEmployeeId(employeeId) {
        return this.equipmentSharingService.findEquipmentSharingsByEmployeeId(employeeId);
    }
    /**
     * CREATE equipment sharing
     *
     * @param organizationId
     * @param equipmentSharing
     * @returns
     */
    async createEquipmentSharing(organizationId, entity) {
        return await this.commandBus.execute(new commands_1.EquipmentSharingCreateCommand(organizationId, entity));
    }
    /**
     * UPDATE equipment sharings request approval
     *
     * @param id
     * @returns
     */
    async equipmentSharingsRequestApproval(id) {
        return await this.commandBus.execute(new commands_1.EquipmentSharingStatusCommand(id, contracts_1.RequestApprovalStatusTypesEnum.APPROVED));
    }
    /**
     * UPDATE equipment sharings request refuse
     *
     * @param id
     * @returns
     */
    async equipmentSharingsRequestRefuse(id) {
        return this.commandBus.execute(new commands_1.EquipmentSharingStatusCommand(id, contracts_1.RequestApprovalStatusTypesEnum.REFUSED));
    }
    /**
     * GET equipment sharing by pagination
     *
     * @param filter
     * @returns
     */
    async pagination(filter) {
        return this.equipmentSharingService.pagination(filter);
    }
    /**
     * GET all equipment sharings
     *
     * @param data
     * @returns
     */
    async findAll(data) {
        const { relations = [], findInput } = data;
        return this.equipmentSharingService.findAll({
            where: findInput,
            relations
        });
    }
    /**
     * UPDATE equipment sharing by id
     *
     * @param id
     * @param equipmentSharing
     * @returns
     */
    async update(id, equipmentSharing) {
        return await this.commandBus.execute(new commands_1.EquipmentSharingUpdateCommand(id, equipmentSharing));
    }
};
exports.EquipmentSharingController = EquipmentSharingController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find equipment sharings By Organization Id'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found equipment sharings',
        type: equipment_sharing_entity_1.EquipmentSharing
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW),
    (0, common_1.Get)('/organization/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingController.prototype, "findEquipmentSharingsByOrganizationId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find equipment sharings By Employee Id'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found equipment sharings',
        type: equipment_sharing_entity_1.EquipmentSharing
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW),
    (0, common_1.Get)('/employee/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingController.prototype, "findEquipmentSharingsByEmployeeId", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create an new record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The record has been successfully created.'
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
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EQUIPMENT_MAKE_REQUEST, contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_EDIT),
    (0, common_1.Post)('/organization/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, equipment_sharing_entity_1.EquipmentSharing]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingController.prototype, "createEquipmentSharing", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'equipment sharings request approval' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found equipment sharings',
        type: equipment_sharing_entity_1.EquipmentSharing
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EQUIPMENT_APPROVE_REQUEST, contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_EDIT),
    (0, common_1.Put)('/approval/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingController.prototype, "equipmentSharingsRequestApproval", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'equipment sharings request refuse' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found equipment sharings',
        type: equipment_sharing_entity_1.EquipmentSharing
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.HttpCode)(common_1.HttpStatus.ACCEPTED),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EQUIPMENT_APPROVE_REQUEST, contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_EDIT),
    (0, common_1.Put)('/refuse/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingController.prototype, "equipmentSharingsRequestRefuse", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    (0, common_1.Get)('/pagination'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({
        summary: 'Find all equipment sharings'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Found equipment sharings',
        type: equipment_sharing_entity_1.EquipmentSharing
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'Record not found'
    }),
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_VIEW),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)('data', pipes_1.ParseJsonPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingController.prototype, "findAll", null);
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
    (0, common_1.UseGuards)(guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.EQUIPMENT_APPROVE_REQUEST, contracts_1.PermissionsEnum.ORG_EQUIPMENT_SHARING_EDIT),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, equipment_sharing_entity_1.EquipmentSharing]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingController.prototype, "update", null);
exports.EquipmentSharingController = EquipmentSharingController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EquipmentSharing'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, common_1.Controller)('/equipment-sharing'),
    tslib_1.__metadata("design:paramtypes", [equipment_sharing_service_1.EquipmentSharingService, cqrs_1.CommandBus])
], EquipmentSharingController);
//# sourceMappingURL=equipment-sharing.controller.js.map