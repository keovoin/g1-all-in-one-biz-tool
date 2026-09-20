import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ID, IDeal, IPagination, IPipeline, IPipelineCreateInput, IPipelineFindInput } from '@gauzy/contracts';
import { Service } from '../crud/service';
import * as i0 from "@angular/core";
export declare class PipelinesService extends Service<IPipeline, IPipelineFindInput, IPipelineCreateInput> {
    readonly http: HttpClient;
    constructor(http: HttpClient);
    /**
     * Fetches all pipelines with optional relations and filtering conditions.
     *
     * @param relations - An optional array of relation names to include in the response.
     * @param where - Optional filtering conditions.
     * @returns A promise that resolves with the paginated pipelines.
     */
    getAll(relations?: string[], where?: IPipelineFindInput): Promise<IPagination<IPipeline>>;
    /**
     * Fetches a pipeline by its ID with optional relations.
     *
     * @param id - The ID of the pipeline to fetch.
     * @param relations - An array of relation names to include in the response.
     * @returns A promise that resolves with the pipeline.
     */
    getById(id: ID, where?: IPipelineFindInput, relations?: string[]): Observable<IPipeline>;
    /**
     * Find deals associated with a specific pipeline
     *
     * @param pipelineId The ID of the pipeline
     * @param where Filter conditions for fetching the deals
     * @returns A promise of paginated deals
     */
    getPipelineDeals(pipelineId: ID, where?: IPipelineFindInput, relations?: string[]): Promise<IPagination<IDeal>>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PipelinesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PipelinesService>;
}
