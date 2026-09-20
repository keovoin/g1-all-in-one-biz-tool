import { EventEmitter } from '@angular/core';
import { IOrganization } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class UserOrganizationsSelectComponent {
    selectedOrganizationsId: string[];
    allOrganizations: IOrganization[];
    selectedChange: EventEmitter<any>;
    constructor();
    onOrganizationsSelected(selectEvent: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserOrganizationsSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UserOrganizationsSelectComponent, "ga-user-organizations-multi-select", never, { "selectedOrganizationsId": { "alias": "selectedOrganizationsId"; "required": false; }; "allOrganizations": { "alias": "allOrganizations"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, never, false, never>;
}
