import { IIntegrationTenantUpdateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../core/dto';
import { IntegrationTenant } from '../integration-tenant.entity';
declare const UpdateIntegrationTenantDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<IntegrationTenant, "isActive" | "isArchived">>;
/**
 * Represent a DTO (Data Transfer Object) for updating an integration tenant.
 */
export declare class UpdateIntegrationTenantDTO extends UpdateIntegrationTenantDTO_base implements Partial<IIntegrationTenantUpdateInput> {
}
export {};
