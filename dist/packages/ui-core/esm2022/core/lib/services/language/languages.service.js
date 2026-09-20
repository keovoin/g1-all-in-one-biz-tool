import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class LanguagesService {
    constructor(http) {
        this.http = http;
    }
    insertLanguage(createLanguage) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/languages`, createLanguage));
    }
    getAllLanguages() {
        return firstValueFrom(this.http.get(`${API_PREFIX}/languages`));
    }
    getSystemLanguages() {
        return firstValueFrom(this.http.get(`${API_PREFIX}/languages`, {
            params: toParams({ is_system: 1 })
        }));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/languages/${id}`));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/languages/${id}`, updateInput));
    }
    findByName(name) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/languages/getByName/${name}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguagesService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguagesService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LanguagesService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=languages.service.js.map