import { Organization } from '../organization.entity';
declare const OrganizationSettingDTO_base: import("@nestjs/common").Type<Pick<Organization, "defaultValueDateType" | "regionCode" | "startWeekOn" | "inviteExpiryPeriod">>;
/**
 * Organization Setting DTO validation
 */
export declare class OrganizationSettingDTO extends OrganizationSettingDTO_base {
}
export {};
