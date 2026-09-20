import { IOrganizationGithubRepositoryUpdateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
import { OrganizationGithubRepository } from '../github-repository.entity';
declare const UpdateGithubRepositoryDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & Pick<OrganizationGithubRepository, "hasSyncEnabled">>;
/**
 * A Data Transfer Object (DTO) for updating an organization's GitHub repository.
 * This DTO is used to specify which properties of the repository should be updated.
 * It combines properties from different sources to define the structure for the update.
 */
export declare class UpdateGithubRepositoryDTO extends UpdateGithubRepositoryDTO_base implements IOrganizationGithubRepositoryUpdateInput {
}
export {};
