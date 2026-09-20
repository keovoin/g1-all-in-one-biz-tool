import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IPagination } from '@gauzy/contracts';
import { ICrudService } from './icrud.service';
export declare abstract class CrudService<T> implements ICrudService<T> {
    protected readonly http: HttpClient;
    protected readonly API_URL: string;
    constructor(http: HttpClient, API_URL: string);
    /**
     * The create() method accepts a partial model as an argument and returns the created model from the server.
     *
     * @param entity
     * @returns
     */
    create(entity: Partial<T>): Observable<T>;
    /**
     * The get() method returns an Observable with a list of all existing resources.
     *
     * @returns
     */
    get<T>(params?: Partial<T>): Observable<IPagination<T>>;
    /**
     * When we want to update an existing resource, we’ll use the update() method.
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id: any, entity: Partial<T>): Observable<T>;
    /**
     * When we want to delete an existing resource, we’ll use the delete() method.
     *
     * @param id
     * @returns
     */
    delete(id: any): Observable<T>;
}
