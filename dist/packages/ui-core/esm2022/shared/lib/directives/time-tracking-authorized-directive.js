import { __decorate } from "tslib";
import { ChangeDetectorRef, Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { filter, tap, map, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import camelcase from 'camelcase';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
let TimeTrackingAuthorizedDirective = class TimeTrackingAuthorizedDirective {
    constructor() {
        this._permission = []; // Default initialization
        this._templateRef = inject((TemplateRef));
        this._viewContainer = inject(ViewContainerRef);
        this._cdr = inject(ChangeDetectorRef);
        this._store = inject(Store);
    }
    /**
     * Setter for dynamic permission.
     * @param permission - The permission(s) to be set.
     */
    set permission(permission) {
        if (!permission) {
            throw new Error('Permission must be provided');
        }
        this._permission = permission;
    }
    /**
     * Getter for dynamic permission.
     */
    get permission() {
        return this._permission;
    }
    ngOnInit() {
        this._store.selectedOrganization$
            .pipe(distinctUntilChange(), filter((organization) => !!organization), switchMap((organization) => this._store.user$.pipe(filter((user) => !!user), map((user) => this._isAuthorized(organization, user)), distinctUntilChanged() // Only emit when permission status changes
        )), tap((hasPermission) => {
            if (hasPermission) {
                this._viewContainer.clear(); // Clear the container once per status change
                this._viewContainer.createEmbeddedView(this._templateRef);
            }
            else {
                this.showTemplateBlockInView(this.permissionElse);
            }
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Determines if the user has the required permission within the organization.
     *
     * @param organization - The selected organization.
     * @param user - The current user.
     * @returns A boolean indicating if the user is authorized.
     */
    _isAuthorized(organization, user) {
        const permissions = Array.isArray(this.permission) ? this.permission : [this.permission];
        return permissions.some((p) => {
            const key = camelcase(p);
            return !!organization[key] && (!user.employee || !!user.employee[key]);
        });
    }
    /**
     * Show If/Else Render Template
     *
     * @param template
     * @returns
     */
    showTemplateBlockInView(template) {
        this._viewContainer.clear(); // Clear the container once per status change
        if (!template) {
            return;
        }
        this._viewContainer.createEmbeddedView(template);
        this._cdr.markForCheck();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackingAuthorizedDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: TimeTrackingAuthorizedDirective, isStandalone: true, selector: "[ngxTimeTrackingAuthorized]", inputs: { permission: "permission", permissionElse: "permissionElse" }, ngImport: i0 }); }
};
TimeTrackingAuthorizedDirective = __decorate([
    UntilDestroy()
], TimeTrackingAuthorizedDirective);
export { TimeTrackingAuthorizedDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TimeTrackingAuthorizedDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxTimeTrackingAuthorized]',
                    standalone: true
                }]
        }], propDecorators: { permission: [{
                type: Input
            }], permissionElse: [{
                type: Input
            }] } });
//# sourceMappingURL=time-tracking-authorized-directive.js.map