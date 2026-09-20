import { CommandBus } from '@nestjs/cqrs';
import { CandidateStatusType, LanguagesEnum, ICandidate, IPagination, ID } from '@gauzy/contracts';
import { FindOptionsWhere } from 'typeorm';
import { CrudController, FindOptionsQueryDTO, BaseQueryDTO } from './../core/crud';
import { CandidateService } from './candidate.service';
import { Candidate } from './candidate.entity';
import { CreateCandidateDTO, UpdateCandidateDTO, CandidateBulkInputDTO } from './dto';
export declare class CandidateController extends CrudController<Candidate> {
    private readonly candidateService;
    private readonly commandBus;
    constructor(candidateService: CandidateService, commandBus: CommandBus);
    /**
     * CREATE bulk candidate
     *
     * @param body
     * @param languageCode
     * @returns
     */
    createBulk(entity: CandidateBulkInputDTO, themeLanguage: LanguagesEnum, languageCode: LanguagesEnum, originUrl: string): Promise<ICandidate[]>;
    /**
     * GET candidate counts
     *
     * @param options
     * @returns
     */
    getCount(options: FindOptionsWhere<Candidate>): Promise<number>;
    /**
     * GET candidates by pagination
     *
     * @param options
     * @returns
     */
    pagination(options: BaseQueryDTO<Candidate>): Promise<IPagination<ICandidate>>;
    /**
     * GET all candidates
     *
     * @param data
     * @returns
     */
    findAll(options: BaseQueryDTO<Candidate>): Promise<IPagination<ICandidate>>;
    /**
     * GET candidate by id
     * @param id
     * @param data
     * @returns
     */
    findById(id: ID, params: FindOptionsQueryDTO<Candidate>): Promise<ICandidate>;
    /**
     * CREATE new candidate
     *
     * @param body
     * @returns
     */
    create(entity: CreateCandidateDTO, languageCode: LanguagesEnum, originUrl: string): Promise<ICandidate>;
    /**
     * UPDATE Candidate By Id
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: ID, entity: UpdateCandidateDTO): Promise<ICandidate>;
    /**
     * Update candidate status (Hired/Rejected) by Id
     * UPDATE Candidate By Id
     *
     * @param id
     * @param status
     * @returns
     */
    updateCandidateStatus(id: ID, status: CandidateStatusType): Promise<ICandidate>;
}
