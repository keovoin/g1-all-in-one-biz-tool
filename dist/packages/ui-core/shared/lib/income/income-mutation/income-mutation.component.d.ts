import { AfterViewInit, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { IIncome, ITag, IOrganization, ICurrency, ISelectedEmployee } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { OrganizationSettingService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FormHelpers } from '../../forms/helpers';
import * as i0 from "@angular/core";
export declare class IncomeMutationComponent extends TranslationBaseComponent implements AfterViewInit, OnInit {
    private readonly fb;
    protected readonly dialogRef: NbDialogRef<IncomeMutationComponent>;
    private readonly store;
    readonly translateService: TranslateService;
    private readonly organizationSettingService;
    FormHelpers: typeof FormHelpers;
    organization: IOrganization;
    _income: IIncome;
    get income(): IIncome;
    set income(value: IIncome);
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder, self: IncomeMutationComponent): UntypedFormGroup;
    constructor(fb: UntypedFormBuilder, dialogRef: NbDialogRef<IncomeMutationComponent>, store: Store, translateService: TranslateService, organizationSettingService: OrganizationSettingService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    addOrEditIncome(): Promise<void>;
    close(): void;
    private _initializeForm;
    selectedTagsHandler(tags: ITag[]): void;
    /**
     * Select Employee Selector
     *
     * @param employee
     */
    selectionEmployee(employee: ISelectedEmployee): void;
    currencyChanged($event: ICurrency): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<IncomeMutationComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<IncomeMutationComponent, "ngx-income-mutation", never, { "income": { "alias": "income"; "required": false; }; }, {}, never, never, false, never>;
}
