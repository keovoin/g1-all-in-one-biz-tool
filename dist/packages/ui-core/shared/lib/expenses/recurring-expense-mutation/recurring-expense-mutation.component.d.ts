import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { DateRangePickerBuilderService, EmployeeRecurringExpenseService, EmployeesService, ErrorHandlingService, ExpenseCategoriesStoreService, OrganizationRecurringExpenseService, Store, ToastrService } from '@gauzy/ui-core/core';
import { ComponentType, IRecurringExpenseModel, StartDateUpdateTypeEnum, IOrganization, IExpenseCategory } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { EmployeeSelectorComponent } from '../../selectors/employee/employee.component';
import * as i0 from "@angular/core";
export declare class RecurringExpenseMutationComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    private readonly fb;
    protected readonly dialogRef: NbDialogRef<RecurringExpenseMutationComponent>;
    private readonly store;
    private readonly dateRangePickerBuilderService;
    private readonly employeesService;
    private readonly expenseCategoriesStore;
    readonly translate: TranslateService;
    private readonly toastrService;
    private readonly errorHandler;
    private readonly organizationRecurringExpenseService;
    private readonly employeeRecurringExpenseService;
    employeeSelector: EmployeeSelectorComponent;
    startDateUpdateType: StartDateUpdateTypeEnum;
    startDateChangeLoading: boolean;
    defaultFilteredCategories: {
        label: string;
        value: string;
    }[];
    defaultCategories: {
        category: string;
        types: ComponentType[];
    }[];
    _recurringExpense: IRecurringExpenseModel;
    get recurringExpense(): IRecurringExpenseModel;
    set recurringExpense(recurringExpense: IRecurringExpenseModel);
    ComponentTypeEnum: typeof ComponentType;
    componentType: ComponentType;
    conflicts: IRecurringExpenseModel[];
    organization: IOrganization;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder, self: RecurringExpenseMutationComponent): UntypedFormGroup;
    constructor(fb: UntypedFormBuilder, dialogRef: NbDialogRef<RecurringExpenseMutationComponent>, store: Store, dateRangePickerBuilderService: DateRangePickerBuilderService, employeesService: EmployeesService, expenseCategoriesStore: ExpenseCategoriesStoreService, translate: TranslateService, toastrService: ToastrService, errorHandler: ErrorHandlingService, organizationRecurringExpenseService: OrganizationRecurringExpenseService, employeeRecurringExpenseService: EmployeeRecurringExpenseService);
    get currencyValue(): any;
    get currency(): import("@angular/forms").AbstractControl<any, any, any>;
    get startDate(): any;
    get value(): any;
    formatToOrganizationDate(date: string): string;
    previousMonth(date: string): string;
    month(date: string): string;
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * GET expense categories by organization
     *
     * @returns
     */
    getExpenseCategories(): void;
    /**
     * Mapped Expense Categories
     *
     * @param categories
     */
    mappedExpenseCategories(categories: IExpenseCategory[]): void;
    submitForm(): void;
    closeAndSubmit(): Promise<void>;
    getTranslatedExpenseCategory(categoryName: any): string;
    addCustomCategoryName(term: any): {
        value: any;
        label: any;
    };
    addNewCustomCategory: (name: string) => Promise<any>;
    private _initializeForm;
    datePickerChanged(newValue: string): Promise<void>;
    close(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RecurringExpenseMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RecurringExpenseMutationComponent, "ga-recurring-expense-mutation", never, { "recurringExpense": { "alias": "recurringExpense"; "required": false; }; }, {}, never, never, false, never>;
}
