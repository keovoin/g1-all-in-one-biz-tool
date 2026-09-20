import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class SkillsService {
    constructor(http) {
        this.http = http;
    }
    insertSkills(createSkills) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/skills`, createSkills));
    }
    insertSkill(createSkill) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/skills`, createSkill));
    }
    getAllSkills() {
        return firstValueFrom(this.http.get(`${API_PREFIX}/skills`));
    }
    delete(id) {
        return firstValueFrom(this.http.delete(`${API_PREFIX}/skills/${id}`));
    }
    update(id, updateInput) {
        return firstValueFrom(this.http.put(`${API_PREFIX}/skills/${id}`, updateInput));
    }
    findByName(name) {
        return firstValueFrom(this.http.get(`${API_PREFIX}/skills/getByName/${name}`));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkillsService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkillsService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SkillsService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=skills.service.js.map