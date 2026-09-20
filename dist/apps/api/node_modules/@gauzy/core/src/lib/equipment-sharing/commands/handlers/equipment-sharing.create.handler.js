"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingCreateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const context_1 = require("../../../core/context");
const request_approval_service_1 = require("../../../request-approval/request-approval.service");
const equipment_sharing_create_command_1 = require("../equipment-sharing.create.command");
const equipment_sharing_service_1 = require("../../equipment-sharing.service");
let EquipmentSharingCreateHandler = class EquipmentSharingCreateHandler {
    constructor(_equipmentSharingService, _requestApprovalService) {
        this._equipmentSharingService = _equipmentSharingService;
        this._requestApprovalService = _requestApprovalService;
    }
    /**
     * Executes the creation of a new Equipment Sharing record along with its corresponding Request Approval.
     *
     * @param command - The EquipmentSharingCreateCommand containing the equipment sharing data.
     * @returns A promise that resolves to the newly created EquipmentSharing record.
     */
    async execute(command) {
        // Get current tenant ID from the request context.
        const tenantId = context_1.RequestContext.currentTenantId();
        // Destructure the equipment sharing data from the command.
        const { organizationId, input } = command;
        const { name } = input;
        // Create the equipment sharing record.
        const equipmentSharing = await this._equipmentSharingService.create({
            ...input,
            organizationId,
            tenantId
        });
        // Create the request approval record for the created equipment sharing.
        await this._requestApprovalService.create({
            name,
            requestId: equipmentSharing.id,
            requestType: contracts_1.ApprovalPolicyTypesStringEnum.EQUIPMENT_SHARING,
            status: equipmentSharing.status ?? contracts_1.RequestApprovalStatusTypesEnum.REQUESTED,
            min_count: 1,
            organizationId,
            tenantId
        });
        return equipmentSharing;
    }
};
exports.EquipmentSharingCreateHandler = EquipmentSharingCreateHandler;
exports.EquipmentSharingCreateHandler = EquipmentSharingCreateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(equipment_sharing_create_command_1.EquipmentSharingCreateCommand),
    tslib_1.__metadata("design:paramtypes", [equipment_sharing_service_1.EquipmentSharingService,
        request_approval_service_1.RequestApprovalService])
], EquipmentSharingCreateHandler);
//# sourceMappingURL=equipment-sharing.create.handler.js.map