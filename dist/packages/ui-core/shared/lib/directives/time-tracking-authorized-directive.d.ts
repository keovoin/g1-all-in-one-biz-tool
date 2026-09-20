import { OnInit, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export declare class TimeTrackingAuthorizedDirective implements OnInit {
    private _permission;
    /**
     * Setter for dynamic permission.
     * @param permission - The permission(s) to be set.
     */
    set permission(permission: string | string[]);
    /**
     * Getter for dynamic permission.
     */
    get permission(): string | string[];
    permissionElse: TemplateRef<any>;
    private readonly _templateRef;
    private readonly _viewContainer;
    private readonly _cdr;
    private readonly _store;
    ngOnInit(): void;
    /**
     * Determines if the user has the required permission within the organization.
     *
     * @param organization - The selected organization.
     * @param user - The current user.
     * @returns A boolean indicating if the user is authorized.
     */
    private _isAuthorized;
    /**
     * Show If/Else Render Template
     *
     * @param template
     * @returns
     */
    showTemplateBlockInView(template: TemplateRef<any>): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackingAuthorizedDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<TimeTrackingAuthorizedDirective, "[ngxTimeTrackingAuthorized]", never, { "permission": { "alias": "permission"; "required": false; }; "permissionElse": { "alias": "permissionElse"; "required": false; }; }, {}, never, never, true, never>;
}
