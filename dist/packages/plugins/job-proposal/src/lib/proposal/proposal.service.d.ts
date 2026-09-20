import { FindManyOptions, DeepPartial } from 'typeorm';
import { IPagination } from '@gauzy/contracts';
import { TenantAwareCrudService } from '@gauzy/core';
import { Proposal } from './proposal.entity';
import { MikroOrmProposalRepository } from './repository/mikro-orm-proposal.repository';
import { TypeOrmProposalRepository } from './repository/type-orm-proposal.repository';
export declare class ProposalService extends TenantAwareCrudService<Proposal> {
    readonly typeOrmProposalRepository: TypeOrmProposalRepository;
    readonly mikroOrmProposalRepository: MikroOrmProposalRepository;
    constructor(typeOrmProposalRepository: TypeOrmProposalRepository, mikroOrmProposalRepository: MikroOrmProposalRepository);
    /**
     * Creates (or, via the proposal update command handler, upserts) a proposal, sanitizing the
     * rich-text `jobPostContent` and `proposalContent` HTML through the shared server-side
     * allowlist before persisting — both fields are re-rendered with `[innerHTML]` on the
     * proposal details view (see `sanitizeRichHtml`).
     *
     * @param entity - The proposal data to persist.
     * @returns The persisted proposal.
     */
    create(entity: DeepPartial<Proposal>): Promise<Proposal>;
    /**
     * Retrieves a paginated list of proposals based on optional filtering.
     *
     * @param filter Optional filtering criteria for retrieving proposals.
     * @returns A paginated list of proposals.
     */
    findAll(filter?: FindManyOptions<Proposal>): Promise<IPagination<Proposal>>;
    /**
     * Paginates data based on the provided filter options.
     *
     * @param {FindManyOptions} filter - The filter options for pagination.
     * @returns The paginated data.
     */
    pagination(filter: FindManyOptions): Promise<IPagination<Proposal>>;
}
