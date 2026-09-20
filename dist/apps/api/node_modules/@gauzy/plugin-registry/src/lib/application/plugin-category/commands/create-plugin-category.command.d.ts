import { ICommand } from '@nestjs/cqrs';
import { IPluginCategoryCreateInput } from '../../../shared';
export declare class CreatePluginCategoryCommand implements ICommand {
    readonly input: IPluginCategoryCreateInput;
    static readonly type = "[Plugin Category] Create";
    constructor(input: IPluginCategoryCreateInput);
}
