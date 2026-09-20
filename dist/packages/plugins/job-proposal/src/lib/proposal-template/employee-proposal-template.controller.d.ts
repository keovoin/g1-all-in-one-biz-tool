import { UpdateResult } from 'typeorm';
import { ID, IEmployeeProposalTemplate, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from '@gauzy/core';
import { EmployeeProposalTemplate } from './employee-proposal-template.entity';
import { EmployeeProposalTemplateService } from './employee-proposal-template.service';
import { CreateProposalTemplateDTO, UpdateProposalTemplateDTO } from './dto';
import { ProposalTemplateDTO } from './dto/proposal-template.dto';
export declare class EmployeeProposalTemplateController extends CrudController<EmployeeProposalTemplate> {
    private readonly employeeProposalTemplateService;
    constructor(employeeProposalTemplateService: EmployeeProposalTemplateService);
    /**
     * GET employee proposal template via pagination.
     *
     * Retrieves a paginated list of employee proposal templates from the database.
     *
     * @param params Pagination parameters (e.g., `skip`, `take`, filters).
     * @returns A paginated result containing an array of `IEmployeeProposalTemplate`.
     */
    pagination(params: BaseQueryDTO<EmployeeProposalTemplate>): Promise<IPagination<IEmployeeProposalTemplate>>;
    /**
     * CREATE make default template by ID.
     *
     * Marks an existing proposal template as the default template by its ID.
     *
     * @param id The UUID of the proposal template to set as default.
     * @param input The DTO containing extra data needed for the operation (if any).
     * @returns The updated `IEmployeeProposalTemplate`.
     */
    makeDefault(id: ID, input: ProposalTemplateDTO): Promise<IEmployeeProposalTemplate>;
    /**
     * GET all employee proposal templates.
     *
     * Retrieves all employee proposal templates from the database.
     * Optionally supports pagination parameters or query filters.
     *
     * @param params Optional pagination parameters or query filters.
     * @returns A paginated result containing an array of `IEmployeeProposalTemplate`.
     */
    findAll(params?: BaseQueryDTO<EmployeeProposalTemplate>): Promise<IPagination<IEmployeeProposalTemplate>>;
    /**
     * CREATE employee proposal template
     *
     * Creates a new `EmployeeProposalTemplate` entity in the database.
     *
     * @param {CreateProposalTemplateDTO} entity - The DTO containing creation data.
     * @returns {Promise<IEmployeeProposalTemplate>} The newly created proposal template.
     */
    create(entity: CreateProposalTemplateDTO): Promise<IEmployeeProposalTemplate>;
    /**
     * UPDATE employee proposal template
     *
     * Updates an existing `EmployeeProposalTemplate` in the database.
     *
     * @param {ID} id - The unique identifier of the proposal template.
     * @param {UpdateProposalTemplateDTO} entity - The DTO containing updated data.
     * @returns {Promise<IEmployeeProposalTemplate | UpdateResult>} The updated proposal template or a TypeORM UpdateResult.
     */
    update(id: ID, entity: UpdateProposalTemplateDTO): Promise<IEmployeeProposalTemplate | UpdateResult>;
}
