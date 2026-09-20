import { ICommandHandler } from '@nestjs/cqrs';
import { IEquipmentSharing } from '@gauzy/contracts';
import { RequestApprovalService } from '../../../request-approval/request-approval.service';
import { EquipmentSharingStatusCommand } from '../equipment-sharing.status.command';
import { EquipmentSharingService } from '../../equipment-sharing.service';
export declare class EquipmentSharingStatusHandler implements ICommandHandler<EquipmentSharingStatusCommand> {
    private readonly _equipmentSharingService;
    private readonly _requestApprovalService;
    constructor(_equipmentSharingService: EquipmentSharingService, _requestApprovalService: RequestApprovalService);
    /**
     * Updates the status of an Equipment Sharing record and its corresponding Request Approval.
     *
     * @param command - An object containing the equipment sharing record's ID and the new status.
     * @returns A promise that resolves to the updated Equipment Sharing record.
     */
    execute(command: EquipmentSharingStatusCommand): Promise<IEquipmentSharing>;
}
