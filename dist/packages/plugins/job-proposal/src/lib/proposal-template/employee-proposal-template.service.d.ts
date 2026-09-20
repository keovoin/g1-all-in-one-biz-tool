import { DeepPartial, FindOptionsWhere, UpdateResult } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { ID, IEmployeeProposalTemplate, IEmployeeProposalTemplateMakeDefaultInput, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, TenantAwareCrudService } from '@gauzy/core';
import { EmployeeProposalTemplate } from './employee-proposal-template.entity';
import { MikroOrmEmployeeProposalTemplateRepository } from './repository/mikro-orm-employee-proposal-template.repository';
import { TypeOrmEmployeeProposalTemplateRepository } from './repository/type-orm-employee-proposal-template.repository';
export declare class EmployeeProposalTemplateService extends TenantAwareCrudService<EmployeeProposalTemplate> {
    readonly typeOrmEmployeeProposalTemplateRepository: TypeOrmEmployeeProposalTemplateRepository;
    readonly mikroOrmEmployeeProposalTemplateRepository: MikroOrmEmployeeProposalTemplateRepository;
    constructor(typeOrmEmployeeProposalTemplateRepository: TypeOrmEmployeeProposalTemplateRepository, mikroOrmEmployeeProposalTemplateRepository: MikroOrmEmployeeProposalTemplateRepository);
    /**
     * Creates a proposal template, sanitizing the rich-text `content` HTML through the shared
     * server-side allowlist before persisting — the content is re-rendered in template views and
     * fed into Gauzy AI proposal generation (see `sanitizeRichHtml`).
     *
     * @param entity - The proposal template data to persist.
     * @returns The persisted proposal template.
     */
    create(entity: DeepPartial<EmployeeProposalTemplate>): Promise<EmployeeProposalTemplate>;
    /**
     * Updates a proposal template, sanitizing the rich-text `content` HTML through the shared
     * server-side allowlist before persisting (see `create`).
     *
     * @param id - The template ID (or where-criteria) to update.
     * @param partialEntity - The partial update payload.
     * @returns The updated template or the TypeORM update result.
     */
    update(id: string | FindOptionsWhere<EmployeeProposalTemplate>, partialEntity: QueryDeepPartialEntity<EmployeeProposalTemplate>): Promise<EmployeeProposalTemplate | UpdateResult>;
    /**
     * Toggles the default status of a proposal template.
     *
     * @param {ID} id - The ID of the proposal template.
     * @param {IEmployeeProposalTemplateMakeDefaultInput} input - The object containing the `isDefault` value.
     * @returns {Promise<IEmployeeProposalTemplate>} The updated proposal template.
     */
    makeDefault(id: ID, input: IEmployeeProposalTemplateMakeDefaultInput): Promise<IEmployeeProposalTemplate>;
    /**
     * Finds all proposal templates matching the given pagination params.
     *
     * @param {BaseQueryDTO<IEmployeeProposalTemplate>} [params] - Pagination parameters.
     * @returns {Promise<IPagination<IEmployeeProposalTemplate>>} Paginated result.
     */
    findAll(params?: BaseQueryDTO<IEmployeeProposalTemplate>): Promise<IPagination<IEmployeeProposalTemplate>>;
}
