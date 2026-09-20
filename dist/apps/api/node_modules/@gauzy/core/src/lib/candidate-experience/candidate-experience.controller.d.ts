import { ICandidateExperience, IPagination } from '@gauzy/contracts';
import { UpdateResult } from 'typeorm';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { CandidateExperienceService } from './candidate-experience.service';
import { CandidateExperience } from './candidate-experience.entity';
import { CreateCandidateExperienceDTO, UpdateCandidateExperienceDTO } from './dto';
export declare class CandidateExperienceController extends CrudController<CandidateExperience> {
    private readonly candidateExperienceService;
    constructor(candidateExperienceService: CandidateExperienceService);
    /**
     * GET candidate experiences by pagination
     *
     * @param params
     * @returns
     */
    pagination(params: BaseQueryDTO<CandidateExperience>): Promise<IPagination<ICandidateExperience>>;
    /**
     * GET candidate experiences
     *
     * @param params
     * @returns
     */
    findAll(params: BaseQueryDTO<CandidateExperience>): Promise<IPagination<ICandidateExperience>>;
    /**
     * CREATE candidate experience
     *
     * @param entity
     * @returns
     */
    create(entity: CreateCandidateExperienceDTO): Promise<ICandidateExperience>;
    /**
     * UPDATE candidate experience
     *
     * @param entity
     * @returns
     */
    update(id: ICandidateExperience['id'], entity: UpdateCandidateExperienceDTO): Promise<ICandidateExperience | UpdateResult>;
}
