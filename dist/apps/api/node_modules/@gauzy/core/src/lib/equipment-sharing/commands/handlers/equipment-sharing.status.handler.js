"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EquipmentSharingStatusHandler = void 0;
const tslib_1 = require("tslib");
const cqrs_1 = require("@nestjs/cqrs");
const common_1 = require("@nestjs/common");
const request_approval_service_1 = require("../../../request-approval/request-approval.service");
const equipment_sharing_status_command_1 = require("../equipment-sharing.status.command");
const equipment_sharing_service_1 = require("../../equipment-sharing.service");
let EquipmentSharingStatusHandler = class EquipmentSharingStatusHandler {
    constructor(_equipmentSharingService, _requestApprovalService) {
        this._equipmentSharingService = _equipmentSharingService;
        this._requestApprovalService = _requestApprovalService;
    }
    /**
     * Updates the status of an Equipment Sharing record and its corresponding Request Approval.
     *
     * @param command - An object containing the equipment sharing record's ID and the new status.
     * @returns A promise that resolves to the updated Equipment Sharing record.
     */
    async execute(command) {
        const { id, status } = command;
        // Retrieve the equipment sharing record and its associated request approval concurrently.
        const [equipmentSharing, requestApproval] = await Promise.all([
            this._equipmentSharingService.findOneByIdString(id),
            this._requestApprovalService.findOneByWhereOptions({ requestId: id })
        ]);
        // If the equipment sharing record is not found, throw an exception.
        if (!equipmentSharing) {
            throw new common_1.NotFoundException('Equipment Sharing not found');
        }
        if (!requestApproval) {
            throw new common_1.NotFoundException('Request Approval not found');
        }
        // If a corresponding request approval exists, update its status as well.
        await this._requestApprovalService.update({ requestId: id }, { status });
        // Persist and return the updated equipment sharing record. NOT update(): that one deletes the row
        // and re-inserts the payload, so approving/refusing (a { status }-only body) replaced the record
        // with a stub. updateStatusEquipmentSharingByAdmin loads the tenant-scoped row and saves it back.
        return await this._equipmentSharingService.updateStatusEquipmentSharingByAdmin(id, status);
    }
};
exports.EquipmentSharingStatusHandler = EquipmentSharingStatusHandler;
exports.EquipmentSharingStatusHandler = EquipmentSharingStatusHandler = tslib_1.__decorate([
    (0, cqrs_1.CommandHandler)(equipment_sharing_status_command_1.EquipmentSharingStatusCommand),
    tslib_1.__metadata("design:paramtypes", [equipment_sharing_service_1.EquipmentSharingService,
        request_approval_service_1.RequestApprovalService])
], EquipmentSharingStatusHandler);
//# sourceMappingURL=equipment-sharing.status.handler.js.map