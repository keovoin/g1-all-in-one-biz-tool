import { ICommand } from '@nestjs/cqrs';
import { ID } from '@gauzy/contracts';
export declare class EquipmentSharingStatusCommand implements ICommand {
    readonly id: ID;
    readonly status: number;
    static readonly type = "[EquipmentSharing] Status";
    constructor(id: ID, status: number);
}
