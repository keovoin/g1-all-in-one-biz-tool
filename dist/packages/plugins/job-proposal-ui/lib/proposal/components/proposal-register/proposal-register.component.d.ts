import { OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { NbDateService } from '@nebular/theme';
import { ITag, IOrganization, IEmployee, IEmployeeProposalTemplate, IOrganizationContact, ISelectedEmployee, ID } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ErrorHandlingService, OrganizationSettingService, ProposalsService, Store, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProposalRegisterComponent extends TranslationBaseComponent implements OnInit, OnDestroy, AfterViewInit {
    readonly translateService: TranslateService;
    private readonly _fb;
    private readonly _store;
    private readonly _router;
    private readonly _dateService;
    private readonly _proposalsService;
    private readonly _toastrService;
    private readonly _cdRef;
    private readonly _organizationSettingService;
    private readonly _errorHandlingService;
    proposalTemplate: IEmployeeProposalTemplate;
    proposalTemplateId: ID;
    organization: IOrganization;
    selectedEmployee: IEmployee;
    minDate: Date;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder, self: ProposalRegisterComponent): UntypedFormGroup;
    constructor(translateService: TranslateService, _fb: UntypedFormBuilder, _store: Store, _router: Router, _dateService: NbDateService<Date>, _proposalsService: ProposalsService, _toastrService: ToastrService, _cdRef: ChangeDetectorRef, _organizationSettingService: OrganizationSettingService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Select Employee Selector
     *
     * @param employee
     */
    selectionEmployee(employee: ISelectedEmployee): void;
    /**
     * Updates the 'proposalContent' field in the form based on a given template.
     *
     * @param item An `IEmployeeProposalTemplate` object. If `null` or empty, the 'proposalContent' field is set to `null`.
     */
    onProposalTemplateChange(item: IEmployeeProposalTemplate | null): void;
    /**
     * Registers a new proposal based on the form input, validating required conditions.
     *
     * If the form is valid and an organization is set, it extracts relevant data from the form,
     * creates a proposal via the proposalsService, and navigates to the appropriate page.
     *
     * Displays success or error messages based on the operation's outcome.
     *
     * @returns A promise that resolves when the proposal is registered or rejects with an error.
     */
    registerProposal(): Promise<void>;
    /**
     * Sets the 'organizationContact' field on the form with the given value.
     *
     * @param organizationContact The selected organization contact to be set in the form.
     */
    selectOrganizationContact(contact: IOrganizationContact): void;
    /**
     * Sets the 'tags' field on the form with the given list of tags.
     *
     * @param tags An array of selected tags to be set in the form.
     */
    selectedTagsEvent(tags: ITag[]): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalRegisterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProposalRegisterComponent, "ga-proposal-register", never, {}, {}, never, never, false, never>;
}
