import { ICandidateCreateInput } from '@gauzy/contracts';
import { Candidate } from './candidate.entity';
import { TenantAwareCrudService } from './../core/crud';
import { TypeOrmCandidateRepository } from './repository/type-orm-candidate.repository';
import { MikroOrmCandidateRepository } from './repository/mikro-orm-candidate.repository';
export declare class CandidateService extends TenantAwareCrudService<Candidate> {
    readonly typeOrmCandidateRepository: TypeOrmCandidateRepository;
    readonly mikroOrmCandidateRepository: MikroOrmCandidateRepository;
    constructor(typeOrmCandidateRepository: TypeOrmCandidateRepository, mikroOrmCandidateRepository: MikroOrmCandidateRepository);
    /**
     *
     * @param input
     * @returns
     */
    createBulk(input: ICandidateCreateInput[]): Promise<Candidate[]>;
    /**
     * Candidate Custom Pagination
     *
     * @param options
     * @returns
     */
    pagination(options: any): Promise<{
        items: Candidate[];
        total: number;
    }>;
}
