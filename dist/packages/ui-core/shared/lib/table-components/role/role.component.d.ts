import { OnInit } from '@angular/core';
import { NbComponentStatus } from '@nebular/theme';
import { IRole } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class RoleComponent implements OnInit {
    value: string | number | any;
    _status: NbComponentStatus;
    get status(): NbComponentStatus;
    set status(value: NbComponentStatus);
    _role: IRole;
    get role(): IRole;
    set role(value: IRole);
    constructor();
    ngOnInit(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<RoleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RoleComponent, "gauzy-role", never, { "value": { "alias": "value"; "required": false; }; "status": { "alias": "status"; "required": false; }; "role": { "alias": "role"; "required": false; }; }, {}, never, never, false, never>;
}
