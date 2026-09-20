import { ICommand } from '@nestjs/cqrs';
import { ID, IEquipmentSharingCreateInput } from '@gauzy/contracts';
export declare class EquipmentSharingCreateCommand implements ICommand {
    readonly organizationId: ID;
    readonly input: IEquipmentSharingCreateInput;
    static readonly type = "[EquipmentSharing] Create";
    constructor(organizationId: ID, input: IEquipmentSharingCreateInput);
}
