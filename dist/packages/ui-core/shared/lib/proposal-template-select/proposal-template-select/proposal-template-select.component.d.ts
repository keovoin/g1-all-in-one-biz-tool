import { EventEmitter, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ID, IEmployeeProposalTemplate, IOrganization } from '@gauzy/contracts';
import { ErrorHandlingService, ProposalTemplateService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProposalTemplateSelectComponent implements OnInit {
    private readonly _proposalTemplateService;
    private readonly _store;
    private readonly _errorHandlingService;
    proposalTemplates: IEmployeeProposalTemplate[];
    organization: IOrganization;
    subject$: Subject<any>;
    onChange: any;
    onTouched: any;
    disabled: boolean;
    multiple: boolean;
    private _employeeId;
    get employeeId(): ID;
    set employeeId(value: ID);
    /**
     * Proposal template id
     */
    private _proposalTemplateId;
    set proposalTemplateId(val: string | string[]);
    get proposalTemplateId(): string | string[];
    selectedChange: EventEmitter<IEmployeeProposalTemplate | null>;
    constructor(_proposalTemplateService: ProposalTemplateService, _store: Store, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     * Write value
     * @param value - The value to be written, can be a string or an array of strings
     */
    writeValue(value: string | string[]): void;
    /**
     * On selected change
     * @param selectedItem - The ID of the selected item
     */
    onSelectedChange(selectedItem: ID): void;
    /**
     * Register on change
     * @param fn - A function that takes a number (rating) as an argument and returns void
     */
    registerOnChange(fn: (rating: number) => void): void;
    /**
     * Register on touched
     * @param fn - A function that takes no arguments and returns void
     */
    registerOnTouched(fn: () => void): void;
    /**
     * Set disabled state
     * @param isDisabled - A boolean indicating whether the control should be disabled
     */
    setDisabledState(isDisabled: boolean): void;
    /**
     * Get proposal templates
     */
    getProposalTemplates(): Promise<void>;
    /**
     * Set default selected proposal template
     */
    defaultSelectedTemplate(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalTemplateSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProposalTemplateSelectComponent, "ngx-proposal-template-select", never, { "disabled": { "alias": "disabled"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "employeeId": { "alias": "employeeId"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, ["*"], false, never>;
}
