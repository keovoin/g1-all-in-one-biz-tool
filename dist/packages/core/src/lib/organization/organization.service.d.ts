import { TenantAwareCrudService } from './../core/crud';
import { IPartialEntity } from './../core/crud/icrud.service';
import { Organization } from './organization.entity';
import { TypeOrmOrganizationRepository } from './repository/type-orm-organization.repository';
import { MikroOrmOrganizationRepository } from './repository/mikro-orm-organization.repository';
export declare class OrganizationService extends TenantAwareCrudService<Organization> {
    readonly typeOrmOrganizationRepository: TypeOrmOrganizationRepository;
    readonly mikroOrmOrganizationRepository: MikroOrmOrganizationRepository;
    constructor(typeOrmOrganizationRepository: TypeOrmOrganizationRepository, mikroOrmOrganizationRepository: MikroOrmOrganizationRepository);
    /**
     * Creates (or, via the organization update command handler, upserts) an organization,
     * sanitizing the rich-text `overview` HTML through the shared server-side allowlist before
     * persisting. `Organization.overview` is rendered with raw `[innerHTML]` on the PUBLIC
     * organization page, so every write path must be sanitized (see `sanitizeRichHtml`).
     *
     * @param entity - The organization data to persist.
     * @returns The persisted organization.
     */
    create(entity: IPartialEntity<Organization>): Promise<Organization>;
}
