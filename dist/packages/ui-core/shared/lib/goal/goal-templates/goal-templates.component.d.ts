import { OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { GoalLevelEnum, KeyResultTypeEnum } from '@gauzy/contracts';
import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class GoalTemplatesComponent implements OnInit {
    private fb;
    private dialogRef;
    goalTemplateForm: UntypedFormGroup;
    keyResultTemplateForm: UntypedFormGroup;
    goalLevelEnum: typeof GoalLevelEnum;
    numberUnitsEnum: string[];
    keyResultTypeEnum: typeof KeyResultTypeEnum;
    constructor(fb: UntypedFormBuilder, dialogRef: NbDialogRef<GoalTemplatesComponent>);
    ngOnInit(): void;
    closeDialog(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoalTemplatesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GoalTemplatesComponent, "ga-goal-templates", never, {}, {}, never, never, false, never>;
}
