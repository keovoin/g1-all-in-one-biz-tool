"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingPolicyController = void 0;
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const crud_1 = require("./../core/crud");
const guards_1 = require("./../shared/guards");
const pipes_1 = require("./../shared/pipes");
const decorators_1 = require("./../shared/decorators");
const equipment_sharing_policy_entity_1 = require("./equipment-sharing-policy.entity");
const equipment_sharing_policy_service_1 = require("./equipment-sharing-policy.service");
const update_or_create_dto_1 = require("./dto/update-or-create.dto");
let EquipmentSharingPolicyController = class EquipmentSharingPolicyController extends crud_1.CrudController {
    constructor(equipmentSharingPolicyService) {
        super(equipmentSharingPolicyService);
        this.equipmentSharingPolicyService = equipmentSharingPolicyService;
    }
    /**
     * GET equipment sharing policies by pagination.
     *
     * @param filter The pagination filter parameters.
     * @returns A paginated list of equipment sharing policies.
     */
    async pagination(filter) {
        return await this.equipmentSharingPolicyService.paginate(filter);
    }
    /**
     * Find all equipment sharing policies.
     *
     * @param params The pagination and filtering parameters.
     * @returns A list of equipment sharing policies.
     */
    async findAll(params) {
        return await this.equipmentSharingPolicyService.findAll(params);
    }
    /**
     * Create a new Equipment Sharing Policy record.
     *
     * @param entity The EquipmentSharingPolicy object to create.
     * @returns The created EquipmentSharingPolicy object.
     */
    async create(entity) {
        return await this.equipmentSharingPolicyService.create(entity);
    }
    /**
     * Update an existing Equipment Sharing Policy record.
     *
     * @param id The ID of the EquipmentSharingPolicy to update.
     * @param entity The updated EquipmentSharingPolicy object.
     * @returns The updated EquipmentSharingPolicy object or the update result.
     */
    async update(id, entity) {
        return await this.equipmentSharingPolicyService.update(id, entity);
    }
};
exports.EquipmentSharingPolicyController = EquipmentSharingPolicyController;
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get equipment sharing policies by pagination' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Paginated list of equipment sharing policies retrieved successfully.',
        type: equipment_sharing_policy_entity_1.EquipmentSharingPolicy
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_VIEW),
    (0, common_1.Get)('/pagination'),
    (0, pipes_1.UseValidationPipe)({ transform: true }),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingPolicyController.prototype, "pagination", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Find all equipment sharing policies' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'Equipment sharing policies found.',
        type: equipment_sharing_policy_entity_1.EquipmentSharingPolicy
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'No equipment sharing policies found.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_VIEW, contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_VIEW),
    (0, common_1.Get)('/'),
    tslib_1.__param(0, (0, common_1.Query)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [crud_1.BaseQueryDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingPolicyController.prototype, "findAll", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Create a new Equipment Sharing Policy record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.CREATED,
        description: 'The Equipment Sharing Policy has been successfully created.',
        type: equipment_sharing_policy_entity_1.EquipmentSharingPolicy
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_ADD),
    (0, common_1.Post)('/'),
    (0, pipes_1.UseValidationPipe)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [update_or_create_dto_1.UpdateOrCreateEquipmentSharingPolicyDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingPolicyController.prototype, "create", null);
tslib_1.__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update an existing Equipment Sharing Policy record' }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.OK,
        description: 'The Equipment Sharing Policy has been successfully updated.',
        type: equipment_sharing_policy_entity_1.EquipmentSharingPolicy
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.NOT_FOUND,
        description: 'The Equipment Sharing Policy with the given ID was not found.'
    }),
    (0, swagger_1.ApiResponse)({
        status: common_1.HttpStatus.BAD_REQUEST,
        description: 'Invalid input. The response body may contain clues as to what went wrong.'
    }),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_EDIT),
    (0, common_1.Put)('/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id', pipes_1.UUIDValidationPipe)),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, update_or_create_dto_1.UpdateOrCreateEquipmentSharingPolicyDTO]),
    tslib_1.__metadata("design:returntype", Promise)
], EquipmentSharingPolicyController.prototype, "update", null);
exports.EquipmentSharingPolicyController = EquipmentSharingPolicyController = tslib_1.__decorate([
    (0, swagger_1.ApiTags)('EquipmentSharingPolicy'),
    (0, common_1.UseGuards)(guards_1.TenantPermissionGuard, guards_1.PermissionGuard),
    (0, decorators_1.Permissions)(contracts_1.PermissionsEnum.ALL_ORG_EDIT, contracts_1.PermissionsEnum.EQUIPMENT_SHARING_POLICY_EDIT),
    (0, common_1.Controller)('/equipment-sharing-policy'),
    tslib_1.__metadata("design:paramtypes", [equipment_sharing_policy_service_1.EquipmentSharingPolicyService])
], EquipmentSharingPolicyController);
//# sourceMappingURL=equipment-sharing-policy.controller.js.map