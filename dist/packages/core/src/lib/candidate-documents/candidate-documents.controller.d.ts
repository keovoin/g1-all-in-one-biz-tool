import { ICandidateDocument, IPagination } from '@gauzy/contracts';
import { CrudController, BaseQueryDTO } from './../core/crud';
import { CandidateDocumentsService } from './candidate-documents.service';
import { CandidateDocument } from './candidate-documents.entity';
export declare class CandidateDocumentsController extends CrudController<CandidateDocument> {
    private readonly candidateDocumentsService;
    constructor(candidateDocumentsService: CandidateDocumentsService);
    /**
     * GET all candidate documents
     *
     * @param params
     * @returns
     */
    findAll(params: BaseQueryDTO<CandidateDocument>): Promise<IPagination<ICandidateDocument>>;
}
