import { firstValueFrom } from 'rxjs';
export class Service {
    constructor({ http, basePath }) {
        this.basePath = basePath;
        this.http = http;
    }
    create(data) {
        return firstValueFrom(this.http
            .post(this.basePath, data));
    }
    find(idOrRelations, filter) {
        if (!arguments.length) {
            return firstValueFrom(this.http.get(this.basePath));
        }
        else if ('string' === typeof idOrRelations) {
            return firstValueFrom(this.http
                .get(`${this.basePath}/${idOrRelations}`));
        }
        return firstValueFrom(this.http.get(this.basePath, {
            params: {
                data: JSON.stringify({
                    relations: idOrRelations,
                    filter
                })
            }
        }));
    }
    update(id, data) {
        return firstValueFrom(this.http
            .put(`${this.basePath}/${id}`, data));
    }
    delete(id) {
        return firstValueFrom(this.http
            .delete(`${this.basePath}/${id}`));
    }
}
//# sourceMappingURL=service.js.map