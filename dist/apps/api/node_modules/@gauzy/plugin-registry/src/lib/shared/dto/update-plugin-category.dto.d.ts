import { IPluginCategoryUpdateInput } from '../models';
export declare class UpdatePluginCategoryDTO implements IPluginCategoryUpdateInput {
    readonly name?: string;
    readonly description?: string;
    readonly slug?: string;
    readonly color?: string;
    readonly icon?: string;
    readonly order?: number;
    readonly isActive?: boolean;
    readonly parentId?: string;
}
