import { OnInit, EventEmitter } from '@angular/core';
import { NgModel, UntypedFormGroup } from '@angular/forms';
import { SkillsService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class SkillsInputComponent implements OnInit {
    private readonly skillsService;
    shownInput: NgModel;
    skills: any;
    form: UntypedFormGroup;
    selectedSkills: any;
    items: any;
    selectedSkillsEvent: EventEmitter<any>;
    constructor(skillsService: SkillsService);
    onChange(): Promise<void>;
    ngOnInit(): void;
    selectedSkillsHandler(ev: any): void;
    getAllSkills(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SkillsInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SkillsInputComponent, "ngx-skills-input", never, { "skills": { "alias": "skills"; "required": false; }; "form": { "alias": "form"; "required": false; }; "selectedSkills": { "alias": "selectedSkills"; "required": false; }; "items": { "alias": "items"; "required": false; }; }, { "selectedSkillsEvent": "selectedSkillsEvent"; }, never, never, false, never>;
}
