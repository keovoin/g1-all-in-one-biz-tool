import { EventEmitter, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IBaseEntityWithMembers, IEditEntityByMemberInput, IEmployee, IOrganization } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class EditEmployeeMembershipFormComponent implements OnInit {
    private readonly fb;
    private readonly store;
    organizationEntities: IBaseEntityWithMembers[];
    employeeEntities: IBaseEntityWithMembers[];
    selectedEmployee: IEmployee;
    placeholder: string;
    title: string;
    entitiesAdded: EventEmitter<IEditEntityByMemberInput>;
    entitiesRemoved: EventEmitter<IEditEntityByMemberInput>;
    showAddCard: boolean;
    organization: IOrganization;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(fb: UntypedFormBuilder, store: Store);
    ngOnInit(): void;
    removeDepartment(id: string): Promise<void>;
    submitForm(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<EditEmployeeMembershipFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EditEmployeeMembershipFormComponent, "ga-edit-employee-membership", never, { "organizationEntities": { "alias": "organizationEntities"; "required": false; }; "employeeEntities": { "alias": "employeeEntities"; "required": false; }; "selectedEmployee": { "alias": "selectedEmployee"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "title": { "alias": "title"; "required": false; }; }, { "entitiesAdded": "entitiesAdded"; "entitiesRemoved": "entitiesRemoved"; }, never, never, false, never>;
}
