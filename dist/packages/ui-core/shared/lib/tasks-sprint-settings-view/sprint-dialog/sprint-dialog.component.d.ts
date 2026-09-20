import { OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { IOrganizationSprint } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class SprintDialogComponent implements OnInit {
    private fb;
    action: 'create' | 'edit';
    sprintData?: IOrganizationSprint;
    dialogRef?: any;
    options?: any;
    form: UntypedFormGroup;
    private defaults;
    moment: any;
    constructor(fb: UntypedFormBuilder);
    ngOnInit(): void;
    private generateSprintName;
    private generateSprintStartDate;
    private generateSprintEndDate;
    initForm(): void;
    save(): void;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SprintDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SprintDialogComponent, "ngx-sprint-dialog", never, { "action": { "alias": "action"; "required": false; }; "sprintData": { "alias": "sprintData"; "required": false; }; "dialogRef": { "alias": "dialogRef"; "required": false; }; "options": { "alias": "options"; "required": false; }; }, {}, never, never, false, never>;
}
