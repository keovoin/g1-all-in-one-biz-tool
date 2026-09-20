import { EventEmitter, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IOrganization, IRecurringExpenseModel, IEmployee } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class RecurringExpenseBlockComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    recurringExpense: IRecurringExpenseModel;
    splitExpense?: boolean;
    employeeName?: boolean;
    selected?: boolean;
    fetchedHistories: IRecurringExpenseModel[];
    selectedOrganization: IOrganization;
    editRecurringExpense: EventEmitter<void>;
    deleteRecurringExpense: EventEmitter<void>;
    fetchRecurringExpenseHistory: EventEmitter<void>;
    showMenu: boolean;
    showHistory: boolean;
    currentEmployee: IEmployee;
    constructor(translateService: TranslateService);
    ngOnInit(): void;
    emitEdit(): void;
    emitDelete(): void;
    emitFetchHistory(): void;
    getStartDate(): string;
    getCategoryName(categoryName: string): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecurringExpenseBlockComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecurringExpenseBlockComponent, "ga-recurring-expense-block", never, { "recurringExpense": { "alias": "recurringExpense"; "required": false; }; "splitExpense": { "alias": "splitExpense"; "required": false; }; "employeeName": { "alias": "employeeName"; "required": false; }; "selected": { "alias": "selected"; "required": false; }; "fetchedHistories": { "alias": "fetchedHistories"; "required": false; }; "selectedOrganization": { "alias": "selectedOrganization"; "required": false; }; "showHistory": { "alias": "showHistory"; "required": false; }; }, { "editRecurringExpense": "editRecurringExpense"; "deleteRecurringExpense": "deleteRecurringExpense"; "fetchRecurringExpenseHistory": "fetchRecurringExpenseHistory"; }, never, never, false, never>;
}
