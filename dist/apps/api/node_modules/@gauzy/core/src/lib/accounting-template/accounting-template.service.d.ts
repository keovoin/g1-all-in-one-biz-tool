import { IAccountingTemplate, IAccountingTemplateFindInput, IAccountingTemplateUpdateInput, IPagination, LanguagesEnum } from '@gauzy/contracts';
import { AccountingTemplate } from './accounting-template.entity';
import { BaseQueryDTO, TenantAwareCrudService } from './../core/crud';
import { TypeOrmAccountingTemplateRepository } from './repository/type-orm-accounting-template.repository';
import { MikroOrmAccountingTemplateRepository } from './repository/mikro-orm-accounting-template.repository';
export declare class AccountingTemplateService extends TenantAwareCrudService<AccountingTemplate> {
    constructor(typeOrmAccountingTemplateRepository: TypeOrmAccountingTemplateRepository, mikroOrmAccountingTemplateRepository: MikroOrmAccountingTemplateRepository);
    generatePreview(input: any): {
        html: string;
    };
    /**
     * Save accounting template to the organization
     *
     * @param input
     * @returns
     */
    saveTemplate(input: IAccountingTemplateUpdateInput): Promise<AccountingTemplate | import("typeorm").UpdateResult>;
    /**
     * GET single accounting template by conditions
     *
     * @param options
     * @param themeLanguage
     * @returns
     */
    getAccountTemplate(options: IAccountingTemplateFindInput, themeLanguage: LanguagesEnum): Promise<IAccountingTemplate>;
    /**
     * Finds the GLOBAL (tenant-less, organization-less) template for a language/type pair.
     *
     * Runs on the raw repositories on purpose: TenantAwareCrudService would scope the lookup to the
     * caller's tenant, and the global row has no tenant. Both ORM branches pin `tenantId` AND
     * `organizationId` to `IS NULL` — see accounting-template.criteria.ts.
     *
     * @param lookup - The language code and template type to look up.
     * @returns The global template, or null when none is seeded for that pair.
     */
    private findGlobalTemplate;
    /**
     * Get Accounting Templates using pagination params
     *
     * @param params
     * @returns
     */
    findAll(params: BaseQueryDTO<AccountingTemplate>): Promise<IPagination<IAccountingTemplate>>;
    /**
     * Finds a single accounting template by its ID while considering tenant
     * and organization scope. If no specific tenant or organization is set,
     * it retrieves global templates.
     *
     * @param id - The ID of the accounting template to retrieve.
     * @returns The matching accounting template or null if not found.
     */
    findOneByIdString(id: string): Promise<AccountingTemplate>;
}
