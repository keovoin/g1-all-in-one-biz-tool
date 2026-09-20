import { EventEmitter } from '@angular/core';
import { IUser } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class UserSelectComponent {
    selectedUserIds: string[];
    allUsers: IUser[];
    selectedChange: EventEmitter<any>;
    constructor();
    onMembersSelected(selectEvent: any): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UserSelectComponent, "ga-user-multi-select", never, { "selectedUserIds": { "alias": "selectedUserIds"; "required": false; }; "allUsers": { "alias": "allUsers"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, never, false, never>;
}
