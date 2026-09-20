import { IQuery } from '@nestjs/cqrs';
import { IPluginCategoryFindInput } from '../../../shared';
export declare class GetPluginCategoryTreeQuery implements IQuery {
    readonly options?: IPluginCategoryFindInput;
    static readonly type = "[Plugin Category] Get Category Tree";
    constructor(options?: IPluginCategoryFindInput);
}
