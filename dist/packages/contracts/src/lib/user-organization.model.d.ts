import { IBasePerTenantAndOrganizationEntityModel, ID } from './base-entity.model';
import { IUser } from './user.model';
export interface IBaseUserOrganization extends IBasePerTenantAndOrganizationEntityModel {
    userId?: ID;
    isDefault: boolean;
}
export interface IUserOrganization extends IBaseUserOrganization {
    user?: IUser;
}
export interface IUserOrganizationFindInput extends Partial<IBaseUserOrganization> {
}
export interface IUserOrganizationCreateInput extends IBaseUserOrganization {
}
