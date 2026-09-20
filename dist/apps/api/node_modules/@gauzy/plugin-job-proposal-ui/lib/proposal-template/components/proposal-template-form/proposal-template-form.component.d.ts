import { OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IEmployeeProposalTemplate, IOrganization, ISelectedEmployee } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ErrorHandlingService, ProposalTemplateService, Store, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProposalTemplateFormComponent extends TranslationBaseComponent implements OnInit {
    private readonly _dialogRef;
    private readonly _fb;
    private readonly _proposalTemplateService;
    private readonly _toastrService;
    private readonly _store;
    private readonly _errorHandlingService;
    organization: IOrganization;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    _selectedEmployee: ISelectedEmployee;
    get selectedEmployee(): ISelectedEmployee;
    set selectedEmployee(employee: ISelectedEmployee);
    _proposalTemplate: IEmployeeProposalTemplate;
    get proposalTemplate(): IEmployeeProposalTemplate;
    set proposalTemplate(value: IEmployeeProposalTemplate);
    constructor(translateService: TranslateService, _dialogRef: NbDialogRef<ProposalTemplateFormComponent>, _fb: UntypedFormBuilder, _proposalTemplateService: ProposalTemplateService, _toastrService: ToastrService, _store: Store, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Set form values based on the selected proposal template.
     */
    private _setFormValues;
    /**
     * Close the dialog.
     */
    close(): void;
    /**
     * Saves the proposal template.
     * @returns {Promise<void>}
     */
    onSave(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalTemplateFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProposalTemplateFormComponent, "ga-proposal-template-form", never, { "selectedEmployee": { "alias": "selectedEmployee"; "required": false; }; "proposalTemplate": { "alias": "proposalTemplate"; "required": false; }; }, {}, never, never, false, never>;
}
