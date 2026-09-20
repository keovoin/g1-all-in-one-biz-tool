import { ID, IOrganizationContact, IOrganizationContactFindInput, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from './../core/crud';
import { OrganizationContact } from './organization-contact.entity';
import { TypeOrmOrganizationContactRepository } from './repository/type-orm-organization-contact.repository';
import { MikroOrmOrganizationContactRepository } from './repository/mikro-orm-organization-contact.repository';
export declare class OrganizationContactService extends TenantAwareCrudService<OrganizationContact> {
    readonly typeOrmOrganizationContactRepository: TypeOrmOrganizationContactRepository;
    readonly mikroOrmOrganizationContactRepository: MikroOrmOrganizationContactRepository;
    constructor(typeOrmOrganizationContactRepository: TypeOrmOrganizationContactRepository, mikroOrmOrganizationContactRepository: MikroOrmOrganizationContactRepository);
    /**
     * Find employee assigned contacts
     *
     * @param employeeId
     * @param options
     * @returns
     */
    findByEmployee(employeeId: ID, options: IOrganizationContactFindInput): Promise<IOrganizationContact[]>;
    findAllOrganizationContacts(data: any): Promise<IPagination<OrganizationContact>>;
    getOrganizationContactByEmployee(data: any): Promise<{
        items: OrganizationContact[];
        total: number;
    }>;
    /**
     * Finds an organization contact by its ID and includes the specified relations.
     *
     * @param id - The unique identifier for the organization contact.
     * @param relations - An array of relation names to include in the result.
     * @returns A promise that resolves to an IOrganizationContact.
     */
    findById(id: ID, relations: string[]): Promise<IOrganizationContact>;
    /**
     * Organization contact by pagination
     *
     * @param filter - The pagination parameters, including custom filters.
     * @returns A promise that resolves with paginated organization contacts.
     */
    pagination(filter?: BaseQueryDTO<OrganizationContact>): Promise<IPagination<IOrganizationContact>>;
}
