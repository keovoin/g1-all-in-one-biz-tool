import { OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { IOrganization, IOrganizationContact } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store } from '@gauzy/ui-core/core';
import { OrganizationContactService, ErrorHandlingService, ToastrService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ContactSelectComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly store;
    private readonly toastrService;
    private readonly errorHandler;
    private readonly organizationContactService;
    hasEditEmployee$: Observable<boolean>;
    contacts: IOrganizationContact[];
    organization: IOrganization;
    subject$: Subject<any>;
    _disabled: boolean;
    get disabled(): boolean;
    set disabled(value: boolean);
    _placeholder: string;
    get placeholder(): string;
    set placeholder(value: string);
    _clearable: boolean;
    get clearable(): boolean;
    set clearable(value: boolean);
    _addTag: boolean;
    get addTag(): boolean;
    set addTag(value: boolean);
    _searchable: boolean;
    get searchable(): boolean;
    set searchable(value: boolean);
    onChange: any;
    onTouched: any;
    private _organizationContact;
    set organizationContact(val: IOrganizationContact);
    get organizationContact(): IOrganizationContact;
    onChanged: EventEmitter<IOrganizationContact>;
    constructor(translateService: TranslateService, store: Store, toastrService: ToastrService, errorHandler: ErrorHandlingService, organizationContactService: OrganizationContactService);
    ngOnInit(): void;
    getContacts(): Promise<void>;
    writeValue(value: IOrganizationContact): void;
    registerOnChange(fn: (rating: number) => void): void;
    registerOnTouched(fn: () => void): void;
    setDisabledState(isDisabled: boolean): void;
    selectContact(contact: IOrganizationContact): void;
    searchContact(term: string, item: any): any;
    /**
     * Adds a new organization contact with the specified name.
     *
     * @param name The name of the contact to add.
     * @returns A promise that resolves to the created organization contact object.
     */
    addOrganizationContact: (name: string) => Promise<IOrganizationContact | null>;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ContactSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ContactSelectComponent, "ga-contact-select", never, { "disabled": { "alias": "disabled"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "clearable": { "alias": "clearable"; "required": false; }; "addTag": { "alias": "addTag"; "required": false; }; "searchable": { "alias": "searchable"; "required": false; }; }, { "onChanged": "onChanged"; }, never, never, false, never>;
}
