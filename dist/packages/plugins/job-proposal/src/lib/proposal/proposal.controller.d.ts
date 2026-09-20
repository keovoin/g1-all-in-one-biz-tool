import { CommandBus } from '@nestjs/cqrs';
import { IProposal, IPagination } from '@gauzy/contracts';
import { BaseQueryDTO, FindOptionsQueryDTO, CountQueryDTO } from '@gauzy/core';
import { ProposalService } from './proposal.service';
import { Proposal } from './proposal.entity';
import { CreateProposalDTO, UpdateProposalDTO } from './dto';
declare const ProposalController_base: import("dist/packages/common/src").Type<import("@gauzy/core").ICrudController<Proposal>>;
export declare class ProposalController extends ProposalController_base {
    private readonly _proposalService;
    private readonly _commandBus;
    constructor(_proposalService: ProposalService, _commandBus: CommandBus);
    /**
     * Get the count of proposals in the same tenant based on the provided query options.
     *
     * @param options Query options to filter proposal counts.
     * @returns The count of proposals meeting the criteria.
     */
    getCount(options: CountQueryDTO<Proposal>): Promise<number>;
    /**
     * Get proposals by pagination.
     *
     * @param params Pagination parameters including page number and limit.
     * @returns Paginated list of proposals.
     */
    pagination(params: BaseQueryDTO<Proposal>): Promise<IPagination<IProposal>>;
    /**
     * Find all proposals based on the provided options.
     *
     * @param data The options for finding proposals.
     * @returns The found proposals.
     */
    findAll(options: BaseQueryDTO<Proposal>): Promise<IPagination<IProposal>>;
    /**
     * Find a single proposal by its ID.
     *
     * @param id The ID of the proposal to find.
     * @param options Additional options for the query.
     * @returns The found proposal.
     */
    findById(id: string, options: FindOptionsQueryDTO<Proposal>): Promise<IProposal>;
    /**
     * Create a new proposal record.
     *
     * @param entity The data to create the proposal.
     * @returns The newly created proposal.
     */
    create(entity: CreateProposalDTO): Promise<IProposal>;
    /**
     * Update a single proposal by its ID.
     *
     * @param id The ID of the proposal to update.
     * @param entity The updated proposal data.
     * @returns The updated proposal.
     */
    update(id: string, entity: UpdateProposalDTO): Promise<IProposal>;
}
export {};
