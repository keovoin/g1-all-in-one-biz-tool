import { ID } from '@gauzy/contracts';
import { ICommand } from '@nestjs/cqrs';
import { IPluginCategoryUpdateInput } from '../../../shared';
export declare class UpdatePluginCategoryCommand implements ICommand {
    readonly id: ID;
    readonly input: IPluginCategoryUpdateInput;
    static readonly type = "[Plugin Category] Update";
    constructor(id: ID, input: IPluginCategoryUpdateInput);
}
