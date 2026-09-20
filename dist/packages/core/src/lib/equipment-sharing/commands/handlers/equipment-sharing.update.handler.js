"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingUpdateHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const contracts_1 = require("@gauzy/contracts");
const request_approval_service_1 = require("../../../request-approval/request-approval.service");
const equipment_sharing_update_command_1 = require("../equipment-sharing.update.command");
const equipment_sharing_service_1 = require("../../equipment-sharing.service");
let EquipmentSharingUpdateHandler = class EquipmentSharingUpdateHandler {
    constructor(_equipmentSharingService, _requestApprovalService) {
        this._equipmentSharingService = _equipmentSharingService;
        this._requestApprovalService = _requestApprovalService;
    }
    /**
     * Executes an update for an Equipment Sharing record.
     *
     * @param command - The EquipmentSharingUpdateCommand containing the record's ID and the updated equipment sharing data.
     * @returns A promise that resolves to the updated EquipmentSharing record.
     */
    async execute(command) {
        const { id, input } = command;
        // Read the row BEFORE destroying it: this is a delete-then-recreate, so the scope it is
        // recreated in has to come from the record rather than from the request. `findOneByIdString`
        // is tenant-scoped and throws NotFoundException, which also stops an unknown id being
        // recreated as a brand-new row.
        const existing = await this._equipmentSharingService.findOneByIdString(id);
        // A pinned organizationId protects the ROW; it says nothing about what the row POINTS AT. The
        // body's equipmentId / equipmentSharingPolicyId are persisted verbatim by the recreate below,
        // and their foreign keys only prove the rows exist — not that they belong here.
        await this._equipmentSharingService.assertReferencesAreInScope(input, {
            tenantId: existing.tenantId,
            organizationId: existing.organizationId
        });
        // Delete the existing Equipment Sharing record and its associated Request Approval concurrently.
        await Promise.all([
            this._equipmentSharingService.delete(id),
            this._requestApprovalService.delete({ requestId: id })
        ]);
        // Save the updated Equipment Sharing record under the path id (a body-supplied id must not
        // re-point the write at another row; the raw body is not DTO-validated). The organization is
        // pinned from the stored row for the same reason: nothing checks a body `organizationId`
        // against the caller's organizations, so an update could otherwise move the record.
        const equipmentSharing = await this._equipmentSharingService.create({
            ...input,
            id,
            organizationId: existing.organizationId,
            tenantId: existing.tenantId
        });
        // Create a new request approval record for the updated equipment sharing.
        await this._requestApprovalService.create({
            requestId: equipmentSharing.id,
            status: equipmentSharing.status ?? contracts_1.RequestApprovalStatusTypesEnum.REQUESTED,
            name: equipmentSharing.name,
            min_count: 1
        });
        return equipmentSharing;
    }
};
exports.EquipmentSharingUpdateHandler = EquipmentSharingUpdateHandler;
exports.EquipmentSharingUpdateHandler = EquipmentSharingUpdateHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(equipment_sharing_update_command_1.EquipmentSharingUpdateCommand),
    tslib_1.__metadata("design:paramtypes", [equipment_sharing_service_1.EquipmentSharingService,
        request_approval_service_1.RequestApprovalService])
], EquipmentSharingUpdateHandler);
//# sourceMappingURL=equipment-sharing.update.handler.js.map