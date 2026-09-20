import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { IEmployee, IOrganization, IOrganizationContact } from '@gauzy/contracts';
import { Observable, Subject } from 'rxjs';
import { Store } from '@gauzy/ui-core/core';
import { ToastrService } from '@gauzy/ui-core/core';
import { OrganizationContactService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ContactSelectorComponent implements AfterViewInit, OnInit, OnDestroy {
    private readonly organizationContactService;
    private readonly store;
    private readonly toastrService;
    organization: IOrganization;
    contacts: IOrganizationContact[];
    disabled: boolean;
    multiple: boolean;
    /**
     * Prompt shown while nothing is selected. Left null so the template keeps
     * falling back to the generic "Client", for the call sites that render the
     * selector without a label of its own.
     */
    placeholder: string | null;
    private _employeeId;
    get employeeId(): IEmployee['id'];
    set employeeId(value: IEmployee['id']);
    private _contactId;
    get contactId(): string | string[];
    set contactId(val: string | string[]);
    subject$: Subject<boolean>;
    hasEditContact$: Observable<boolean>;
    onChange: any;
    onTouched: any;
    constructor(organizationContactService: OrganizationContactService, store: Store, toastrService: ToastrService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    getContacts(): Promise<void>;
    writeValue(value: string | string[]): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    createNew: (name: IOrganizationContact["name"]) => Promise<void>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContactSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContactSelectorComponent, "ga-contact-selector", never, { "disabled": { "alias": "disabled"; "required": false; }; "multiple": { "alias": "multiple"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "employeeId": { "alias": "employeeId"; "required": false; }; "contactId": { "alias": "contactId"; "required": false; }; }, {}, never, never, false, never>;
}
