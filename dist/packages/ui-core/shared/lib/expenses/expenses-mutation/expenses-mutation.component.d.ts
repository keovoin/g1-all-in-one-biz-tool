import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TaxTypesEnum, ExpenseTypesEnum, ITag, IOrganizationContact, IOrganizationProject, ISelectedEmployee, IOrganization, IExpense, ICurrency } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { OrganizationSettingService, Store } from '@gauzy/ui-core/core';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
export declare class ExpensesMutationComponent extends TranslationBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly dialogRef: NbDialogRef<ExpensesMutationComponent>;
    private readonly dialogService;
    private readonly fb;
    private readonly store;
    readonly translateService: TranslateService;
    private readonly organizationSettingService;
    FormHelpers: typeof FormHelpers;
    _expense: IExpense;
    get expense(): IExpense;
    set expense(expense: IExpense);
    expenseTypes: ExpenseTypesEnum[];
    expenseTypesEnum: typeof ExpenseTypesEnum;
    taxTypes: TaxTypesEnum[];
    statuses: string[];
    defaultImage: string;
    calculatedValue: string;
    duplicate: boolean;
    showNotes: boolean;
    showWarning: boolean;
    showTooltip: boolean;
    showTaxesInput: boolean;
    organization: IOrganization;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder, self: ExpensesMutationComponent): UntypedFormGroup;
    constructor(dialogRef: NbDialogRef<ExpensesMutationComponent>, dialogService: NbDialogService, fb: UntypedFormBuilder, store: Store, translateService: TranslateService, organizationSettingService: OrganizationSettingService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Added statuses dropdown selector
     */
    setExpenseStatuses(typeOfExpense: ExpenseTypesEnum): void;
    /**
     * Selected Organization Contact
     *
     * @param contact
     */
    selectedOrganizationContact(contact: IOrganizationContact): void;
    /**
     * Selected Project
     *
     * @param project
     */
    selectedProject(project: IOrganizationProject): void;
    /**
     * Selected Tags Handler
     *
     * @param tags
     */
    selectedTagsHandler(tags: ITag[]): void;
    addOrEditExpense(): Promise<void>;
    showNotesInput(): boolean;
    includeTaxes(): boolean;
    private _initializeForm;
    private calculateTaxes;
    closeWarning(): void;
    attachReceipt(): void;
    onEmployeeChange(employee: ISelectedEmployee): void;
    close(): void;
    currencyChanged(currency: ICurrency): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ExpensesMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ExpensesMutationComponent, "ga-expenses-mutation", never, { "expense": { "alias": "expense"; "required": false; }; }, {}, never, never, false, never>;
}
