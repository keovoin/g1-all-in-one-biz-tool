import { ICommand } from '@nestjs/cqrs';
import { IResourceLinkUpdateInput, ID } from '@gauzy/contracts';
export declare class ResourceLinkUpdateCommand implements ICommand {
    readonly id: ID;
    readonly input: IResourceLinkUpdateInput;
    static readonly type = "[Resource Link] Update";
    constructor(id: ID, input: IResourceLinkUpdateInput);
}
