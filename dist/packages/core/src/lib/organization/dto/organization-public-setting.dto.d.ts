import { Organization } from '../organization.entity';
declare const OrganizationPublicSettingDTO_base: import("@nestjs/common").Type<Pick<Organization, "show_income" | "show_profits" | "show_bonuses_paid" | "show_total_hours" | "show_minimum_project_size" | "show_projects_count" | "show_clients_count" | "show_clients" | "show_employees_count">>;
/**
 * Organization Public Setting DTO
 */
export declare class OrganizationPublicSettingDTO extends OrganizationPublicSettingDTO_base {
}
export {};
