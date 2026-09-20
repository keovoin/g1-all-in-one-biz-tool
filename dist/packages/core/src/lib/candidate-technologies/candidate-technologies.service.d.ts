import { ICandidateTechnologies, ICandidateTechnologiesCreateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { CandidateTechnologies } from './candidate-technologies.entity';
import { TypeOrmCandidateTechnologiesRepository } from './repository/type-orm-candidate-technologies.repository';
import { MikroOrmCandidateTechnologiesRepository } from './repository/mikro-orm-candidate-technologies.repository';
export declare class CandidateTechnologiesService extends TenantAwareCrudService<CandidateTechnologies> {
    constructor(typeOrmCandidateTechnologiesRepository: TypeOrmCandidateTechnologiesRepository, mikroOrmCandidateTechnologiesRepository: MikroOrmCandidateTechnologiesRepository);
    /**
     *
     * @param createInput
     * @returns
     */
    createBulk(createInput: ICandidateTechnologiesCreateInput[]): Promise<CandidateTechnologies[]>;
    /**
     *
     * @param interviewId
     * @returns
     */
    getTechnologiesByInterviewId(interviewId: string): Promise<ICandidateTechnologies[]>;
}
