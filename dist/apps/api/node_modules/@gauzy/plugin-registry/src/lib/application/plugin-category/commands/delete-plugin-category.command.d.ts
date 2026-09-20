import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
export declare class DeletePluginCategoryCommand implements ICommand {
    readonly id: ID;
    static readonly type = "[Plugin Category] Delete";
    constructor(id: ID);
}
