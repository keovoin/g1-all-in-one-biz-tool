import { OnInit, EventEmitter } from '@angular/core';
import { IUser } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class UserComponent implements OnInit {
    showIdentity: boolean;
    user$: Observable<IUser>;
    clicked: EventEmitter<any>;
    online$: Observable<boolean>;
    constructor();
    ngOnInit(): void;
    /**
     * Initials to stand in for a missing avatar: the first letter of the first and
     * last name parts, or of the email when there is no name.
     */
    initials(user: IUser): string;
    onClicked(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<UserComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UserComponent, "gauzy-user", never, { "showIdentity": { "alias": "showIdentity"; "required": false; }; "user$": { "alias": "user$"; "required": false; }; }, { "clicked": "clicked"; }, never, never, false, never>;
}
