import { IOrganization, IOrganizationContact, IPagination } from '@gauzy/contracts';
import { FindOptionsWhere } from 'typeorm';
import { Organization, OrganizationContact, OrganizationProject } from './../../core/entities/internal';
import { TypeOrmOrganizationRepository } from '../../organization/repository/type-orm-organization.repository';
import { MikroOrmOrganizationRepository } from '../../organization/repository/mikro-orm-organization.repository';
import { TypeOrmOrganizationContactRepository } from '../../organization-contact/repository/type-orm-organization-contact.repository';
import { MikroOrmOrganizationContactRepository } from '../../organization-contact/repository/mikro-orm-organization-contact.repository';
import { TypeOrmOrganizationProjectRepository } from '../../organization-project/repository/type-orm-organization-project.repository';
import { MikroOrmOrganizationProjectRepository } from '../../organization-project/repository/mikro-orm-organization-project.repository';
export declare class PublicOrganizationService {
    private readonly typeOrmOrganizationRepository;
    private readonly mikroOrmOrganizationRepository;
    private readonly typeOrmOrganizationContactRepository;
    private readonly mikroOrmOrganizationContactRepository;
    private readonly typeOrmOrganizationProjectRepository;
    private readonly mikroOrmOrganizationProjectRepository;
    constructor(typeOrmOrganizationRepository: TypeOrmOrganizationRepository, mikroOrmOrganizationRepository: MikroOrmOrganizationRepository, typeOrmOrganizationContactRepository: TypeOrmOrganizationContactRepository, mikroOrmOrganizationContactRepository: MikroOrmOrganizationContactRepository, typeOrmOrganizationProjectRepository: TypeOrmOrganizationProjectRepository, mikroOrmOrganizationProjectRepository: MikroOrmOrganizationProjectRepository);
    /**
     * GET organization by profile link
     *
     * @param options
     * @param relations
     * @returns
     */
    findOneByProfileLink(where: FindOptionsWhere<Organization>, relations: string[]): Promise<IOrganization>;
    /**
     * GET all public clients by organization condition
     *
     * @param options
     * @returns
     */
    findPublicClientsByOrganization(options: FindOptionsWhere<OrganizationContact>): Promise<IPagination<IOrganizationContact>>;
    /**
     * GET all public client counts by organization condition
     *
     * @param options
     * @returns
     */
    findPublicClientCountsByOrganization(options: FindOptionsWhere<OrganizationContact>): Promise<Number>;
    /**
     * GET all public project counts by organization condition
     *
     * @param options
     * @returns
     */
    findPublicProjectCountsByOrganization(options: FindOptionsWhere<OrganizationProject>): Promise<Number>;
}
