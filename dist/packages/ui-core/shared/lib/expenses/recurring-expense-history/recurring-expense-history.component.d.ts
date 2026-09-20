import { EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@gauzy/ui-core/core';
import { IOrganization, IRecurringExpenseModel } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class RecurringExpenseHistoryComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly store;
    recordsData: IRecurringExpenseModel[];
    closeHistory: EventEmitter<void>;
    organization: IOrganization;
    constructor(translateService: TranslateService, store: Store);
    ngOnInit(): void;
    emitClose: () => void;
    getMonthString(month: number): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecurringExpenseHistoryComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecurringExpenseHistoryComponent, "ga-recurring-expense-history", never, { "recordsData": { "alias": "recordsData"; "required": false; }; }, { "closeHistory": "closeHistory"; }, never, never, false, never>;
}
