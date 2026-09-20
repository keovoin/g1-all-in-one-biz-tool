import { ICommand } from '@nestjs/cqrs';
import { IResourceLinkCreateInput } from '@gauzy/contracts';
export declare class ResourceLinkCreateCommand implements ICommand {
    readonly input: IResourceLinkCreateInput;
    static readonly type = "[Resource Link] Create";
    constructor(input: IResourceLinkCreateInput);
}
