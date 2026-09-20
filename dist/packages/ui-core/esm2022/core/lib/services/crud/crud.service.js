import { take } from 'rxjs/operators';
import { toParams } from '@gauzy/ui-core/common';
export class CrudService {
    constructor(http, API_URL) {
        this.http = http;
        this.API_URL = API_URL;
    }
    /**
     * The create() method accepts a partial model as an argument and returns the created model from the server.
     *
     * @param entity
     * @returns
     */
    create(entity) {
        return this.http.post(`${this.API_URL}`, entity).pipe(take(1));
    }
    /**
     * The get() method returns an Observable with a list of all existing resources.
     *
     * @returns
     */
    get(params) {
        return this.http.get(`${this.API_URL}`, {
            params: toParams({ ...params })
        });
    }
    /**
     * When we want to update an existing resource, we’ll use the update() method.
     *
     * @param id
     * @param entity
     * @returns
     */
    update(id, entity) {
        return this.http.put(`${this.API_URL}/${id}`, entity).pipe(take(1));
    }
    /**
     * When we want to delete an existing resource, we’ll use the delete() method.
     *
     * @param id
     * @returns
     */
    delete(id) {
        return this.http.delete(`${this.API_URL}/${id}`).pipe(take(1));
    }
}
//# sourceMappingURL=crud.service.js.map