import { IGithubIssueFindInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '@gauzy/core';
export declare class GithubIssuesQueryDTO extends TenantOrganizationBaseDTO implements IGithubIssueFindInput {
    /**
     * Limit (paginated) - max number of entities should be taken.
     */
    readonly per_page: number;
    /**
     * Offset (paginated) where from entities should be taken.
     */
    readonly page: number;
}
