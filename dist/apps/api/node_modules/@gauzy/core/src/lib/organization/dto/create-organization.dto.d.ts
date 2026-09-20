import { CurrenciesEnum, IOrganizationCreateInput } from '@gauzy/contracts';
import { Organization } from './../organization.entity';
import { OrganizationBonusesDTO } from './organization-bonuses.dto';
import { OrganizationSettingDTO } from './organization-setting.dto';
import { RelationalTagDTO } from './../../tags/dto';
declare const CreateOrganizationDTO_base: import("@nestjs/common").Type<RelationalTagDTO & OrganizationBonusesDTO & OrganizationSettingDTO & Pick<Organization, "name" | "imageId" | "standardWorkHoursPerDay"> & Pick<Organization, "upworkOrganizationId" | "upworkOrganizationName">>;
/**
 * Organization Create DTO validation
 *
 */
export declare class CreateOrganizationDTO extends CreateOrganizationDTO_base implements IOrganizationCreateInput {
    readonly currency: CurrenciesEnum;
}
export {};
