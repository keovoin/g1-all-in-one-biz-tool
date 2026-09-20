import { ICommand } from '@nestjs/cqrs';
import { ID, IEquipmentSharingUpdateInput } from '@gauzy/contracts';
export declare class EquipmentSharingUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IEquipmentSharingUpdateInput;
    static readonly type = "[EquipmentSharing] Update";
    constructor(id: ID, input: IEquipmentSharingUpdateInput);
}
