import { ICommandHandler } from '@nestjs/cqrs';
import { RequestApprovalService } from '../../../request-approval/request-approval.service';
import { EquipmentSharing } from '../../equipment-sharing.entity';
import { EquipmentSharingUpdateCommand } from '../equipment-sharing.update.command';
import { EquipmentSharingService } from '../../equipment-sharing.service';
export declare class EquipmentSharingUpdateHandler implements ICommandHandler<EquipmentSharingUpdateCommand> {
    private readonly _equipmentSharingService;
    private readonly _requestApprovalService;
    constructor(_equipmentSharingService: EquipmentSharingService, _requestApprovalService: RequestApprovalService);
    /**
     * Executes an update for an Equipment Sharing record.
     *
     * @param command - The EquipmentSharingUpdateCommand containing the record's ID and the updated equipment sharing data.
     * @returns A promise that resolves to the updated EquipmentSharing record.
     */
    execute(command: EquipmentSharingUpdateCommand): Promise<EquipmentSharing>;
}
