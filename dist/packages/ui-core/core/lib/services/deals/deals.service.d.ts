import { HttpClient } from '@angular/common/http';
import { ID, IDeal, IDealCreateInput, IDealFindInput, IPagination } from '@gauzy/contracts';
import { Service } from '../crud/service';
import * as i0 from "@angular/core";
export declare class DealsService extends Service<IDeal, IDealFindInput, IDealCreateInput> {
    readonly http: HttpClient;
    constructor(http: HttpClient);
    /**
     * Fetch all deals with optional relations and filter conditions
     *
     * @param relations Array of relation names to include in the result
     * @param where Filter conditions for fetching deals
     * @returns A promise of paginated deals
     */
    getAll(relations?: string[], where?: IDealFindInput): Promise<IPagination<IDeal>>;
    /**
     * Fetch a deal by its ID with optional relations and filter conditions
     *
     * @param id The ID of the deal to fetch
     * @param where Filter conditions for fetching the deal
     * @param relations Array of relation names to include in the result
     * @returns A promise of the fetched deal
     */
    getById(id: ID, where?: IDealFindInput, relations?: string[]): Promise<IDeal>;
    static ɵfac: i0.ɵɵFactoryDeclaration<DealsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DealsService>;
}
