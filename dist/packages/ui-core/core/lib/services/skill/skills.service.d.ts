import { HttpClient } from '@angular/common/http';
import { ISkill } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class SkillsService {
    private http;
    constructor(http: HttpClient);
    insertSkills(createSkills: ISkill[]): Promise<ISkill[]>;
    insertSkill(createSkill: ISkill): Promise<ISkill>;
    getAllSkills(): Promise<{
        items: ISkill[];
    }>;
    delete(id: string): Promise<any>;
    update(id: string, updateInput: ISkill): Promise<Object>;
    findByName(name: string): Promise<{
        item: ISkill;
    }>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SkillsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SkillsService>;
}
