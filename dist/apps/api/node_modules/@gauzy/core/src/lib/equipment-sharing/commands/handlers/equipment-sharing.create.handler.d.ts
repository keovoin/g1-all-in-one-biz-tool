import { ICommandHandler } from '@nestjs/cqrs';
import { RequestApprovalService } from '../../../request-approval/request-approval.service';
import { EquipmentSharing } from '../../equipment-sharing.entity';
import { EquipmentSharingCreateCommand } from '../equipment-sharing.create.command';
import { EquipmentSharingService } from '../../equipment-sharing.service';
export declare class EquipmentSharingCreateHandler implements ICommandHandler<EquipmentSharingCreateCommand> {
    private readonly _equipmentSharingService;
    private readonly _requestApprovalService;
    constructor(_equipmentSharingService: EquipmentSharingService, _requestApprovalService: RequestApprovalService);
    /**
     * Executes the creation of a new Equipment Sharing record along with its corresponding Request Approval.
     *
     * @param command - The EquipmentSharingCreateCommand containing the equipment sharing data.
     * @returns A promise that resolves to the newly created EquipmentSharing record.
     */
    execute(command: EquipmentSharingCreateCommand): Promise<EquipmentSharing>;
}
