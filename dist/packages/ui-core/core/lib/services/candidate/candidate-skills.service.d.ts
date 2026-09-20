import { HttpClient } from '@angular/common/http';
import { ICandidateSkillCreateInput, ISkill, ICandidateSkillFindInput, IPagination } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateSkillsService {
    private http;
    constructor(http: HttpClient);
    create(createInput: ICandidateSkillCreateInput): Promise<ISkill>;
    getAll(where?: ICandidateSkillFindInput): Promise<IPagination<ISkill>>;
    update(id: string, updateInput: any): Promise<any>;
    delete(id: string): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateSkillsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CandidateSkillsService>;
}
