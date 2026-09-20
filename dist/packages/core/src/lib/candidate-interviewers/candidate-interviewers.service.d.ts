import { ICandidateInterviewersCreateInput, ID } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { TypeOrmCandidateInterviewersRepository } from './repository/type-orm-candidate-interviewers.repository';
import { MikroOrmCandidateInterviewersRepository } from './repository/mikro-orm-candidate-interviewers.repository';
import { CandidateInterviewers } from './candidate-interviewers.entity';
export declare class CandidateInterviewersService extends TenantAwareCrudService<CandidateInterviewers> {
    constructor(typeOrmCandidateInterviewersRepository: TypeOrmCandidateInterviewersRepository, mikroOrmCandidateInterviewersRepository: MikroOrmCandidateInterviewersRepository);
    /**
     * Get interviewers by interview ID.
     */
    getInterviewersByInterviewId(interviewId: ID): Promise<CandidateInterviewers[]>;
    /**
     * Create interviewers in bulk.
     */
    createBulk(input?: ICandidateInterviewersCreateInput[]): Promise<CandidateInterviewers[]>;
}
