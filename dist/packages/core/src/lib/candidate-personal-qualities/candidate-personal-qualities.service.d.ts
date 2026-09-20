import { ICandidatePersonalQualities, ICandidatePersonalQualitiesCreateInput } from '@gauzy/contracts';
import { TenantAwareCrudService } from './../core/crud';
import { TypeOrmCandidatePersonalQualitiesRepository } from './repository/type-orm-candidate-personal-qualities.repository';
import { MikroOrmCandidatePersonalQualitiesRepository } from './repository/mikro-orm-candidate-personal-qualities.repository';
import { CandidatePersonalQualities } from './candidate-personal-qualities.entity';
export declare class CandidatePersonalQualitiesService extends TenantAwareCrudService<CandidatePersonalQualities> {
    constructor(typeOrmCandidatePersonalQualitiesRepository: TypeOrmCandidatePersonalQualitiesRepository, mikroOrmCandidatePersonalQualitiesRepository: MikroOrmCandidatePersonalQualitiesRepository);
    /**
     *
     * @param createInput
     * @returns
     */
    createBulk(createInput: ICandidatePersonalQualitiesCreateInput[]): Promise<CandidatePersonalQualities[]>;
    /**
     *
     * @param interviewId
     * @returns
     */
    getPersonalQualitiesByInterviewId(interviewId: string): Promise<ICandidatePersonalQualities[]>;
}
