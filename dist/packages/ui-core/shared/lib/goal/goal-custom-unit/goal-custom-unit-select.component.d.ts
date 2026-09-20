import { OnInit, OnDestroy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { KeyResultTypeEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class GoalCustomUnitSelectComponent implements OnInit, OnDestroy {
    private readonly store;
    parentFormGroup: UntypedFormGroup;
    numberUnits: string[];
    keyResultTypeEnum: typeof KeyResultTypeEnum;
    createNew: boolean;
    defaultCurrency: string;
    constructor(store: Store);
    ngOnInit(): void;
    createNewUnit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoalCustomUnitSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GoalCustomUnitSelectComponent, "ga-goal-custom-unit-select", never, { "parentFormGroup": { "alias": "parentFormGroup"; "required": false; }; "numberUnits": { "alias": "numberUnits"; "required": false; }; }, {}, never, never, false, never>;
}
