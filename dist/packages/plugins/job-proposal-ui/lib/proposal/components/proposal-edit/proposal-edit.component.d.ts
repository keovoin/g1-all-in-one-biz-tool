import { AfterViewInit, ChangeDetectorRef, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { IProposal, ITag } from '@gauzy/contracts';
import { ErrorHandlingService, OrganizationSettingService, ProposalsService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class ProposalEditComponent extends TranslationBaseComponent implements OnInit, AfterViewInit {
    readonly translateService: TranslateService;
    private readonly _route;
    private readonly _fb;
    private readonly _router;
    private readonly _toastrService;
    private readonly _proposalsService;
    private readonly _organizationSettingService;
    private readonly _cdRef;
    private readonly _errorHandlingService;
    proposal: IProposal;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder, self: ProposalEditComponent): UntypedFormGroup;
    constructor(translateService: TranslateService, _route: ActivatedRoute, _fb: UntypedFormBuilder, _router: Router, _toastrService: ToastrService, _proposalsService: ProposalsService, _organizationSettingService: OrganizationSettingService, _cdRef: ChangeDetectorRef, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Selects the proposal and sets the form values.
     *
     * @param proposal
     */
    selectProposal(proposal: IProposal): void;
    /**
     * Patches the form with values from the current proposal, if available.
     *
     * This method populates the form fields with data from the existing proposal,
     * which is useful for initializing or editing a form.
     */
    private _patchFormValue;
    /**
     * Edits an existing proposal if the form is valid and a proposal is specified.
     *
     * This function updates a proposal based on the form's input values. It validates the form,
     * extracts necessary information, and uses the `proposalsService` to perform the update.
     * Success or error messages are displayed based on the outcome.
     *
     * @returns A promise that resolves upon successful editing or rejects with an error.
     */
    editProposal(): Promise<void>;
    /**
     * Updates the 'tags' field in the form based on the selected tags.
     *
     * @param tags An array of selected tags to be set in the form.
     */
    selectedTagsEvent(tags: ITag[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalEditComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProposalEditComponent, "ngx-proposal-edit", never, {}, {}, never, never, false, never>;
}
