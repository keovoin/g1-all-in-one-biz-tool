import { OrganizationContact } from './../organization-contact.entity';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { RelationalTagDTO } from '../../tags/dto';
declare const OrganizationContactDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & RelationalTagDTO & Pick<OrganizationContact, "name" | "imageId" | "notes" | "primaryEmail" | "primaryPhone" | "inviteStatus" | "contactType" | "budget" | "budgetType">>;
export declare class OrganizationContactDTO extends OrganizationContactDTO_base {
}
export {};
