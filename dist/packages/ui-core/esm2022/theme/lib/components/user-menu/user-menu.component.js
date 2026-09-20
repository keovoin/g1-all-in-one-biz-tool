import { __decorate, __metadata } from "tslib";
import { Component, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { environment } from '@gauzy/ui-config';
import { EmployeesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { distinctUntilChange } from '@gauzy/ui-core/common';
import { BehaviorSubject, tap, Observable, filter, firstValueFrom, combineLatest, map, distinctUntilChanged } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/router";
import * as i3 from "@nebular/theme";
import * as i4 from "../theme-sidebar/theme-settings/components/theme-language-selector/theme-language-selector.component";
import * as i5 from "../theme-sidebar/theme-settings/components/theme-selector/switch-theme/switch-theme.component";
import * as i6 from "../theme-sidebar/theme-settings/components/theme-selector/container/theme-selector-container.component";
import * as i7 from "@gauzy/ui-core/shared";
import * as i8 from "../user/user.component";
import * as i9 from "@angular/common";
import * as i10 from "@ngx-translate/core";
let UserMenuComponent = class UserMenuComponent {
    trackOverlayClick(target) {
        this.clickedInOverlay = target instanceof Element && !!target.closest('.cdk-overlay-container');
    }
    constructor(_employeeService, _errorHandler) {
        this._employeeService = _employeeService;
        this._errorHandler = _errorHandler;
        this.close = new EventEmitter(null);
        /**
         * Whether an outside click is allowed to close this panel yet. Same reason
         * as `gauzy-workspace-menu`: `gauzyOutside` listens on `document`, so arming
         * has to be deferred past the click that opened the panel. This replaces a
         * counter that required TWO outside clicks to dismiss — the first was
         * swallowed by the panel (576x288 over the lower-left of the page) and did
         * nothing at all, which is one of the "clicks do nothing" reports.
         */
        this.armed = false;
        this.clickedInOverlay = false;
        /**
         * Identifies the employee lookup currently in flight. The panel can stay open
         * across a user or organization switch, so a slow earlier request can settle
         * after a newer one; anything that no longer matches this counter is stale and
         * must not touch the employee or the loading state.
         */
        this.lookupId = 0;
        /**
         * Each entry carries a `label` translation key because the anchors render an
         * icon only — without it a screen reader announces five identical links.
         */
        this.downloadApps = [
            {
                link: environment.DESKTOP_APP_DOWNLOAD_LINK_APPLE,
                icon: 'fab fa-apple',
                label: 'USER_MENU.DOWNLOAD_MACOS'
            },
            {
                link: environment.DESKTOP_APP_DOWNLOAD_LINK_WINDOWS,
                icon: 'fa-brands fa-windows',
                label: 'USER_MENU.DOWNLOAD_WINDOWS'
            },
            {
                link: environment.DESKTOP_APP_DOWNLOAD_LINK_LINUX,
                icon: 'fa-brands fa-linux',
                label: 'USER_MENU.DOWNLOAD_LINUX'
            },
            {
                link: environment.MOBILE_APP_DOWNLOAD_LINK,
                icon: 'fas fa-mobile',
                label: 'USER_MENU.DOWNLOAD_MOBILE'
            },
            {
                link: environment.EXTENSION_DOWNLOAD_LINK,
                icon: 'fa-brands fa-chrome',
                label: 'USER_MENU.DOWNLOAD_BROWSER_EXTENSION'
            }
        ];
        this._user$ = new Observable();
        this._employee$ = new BehaviorSubject(null);
        this._isLoadingEmployee$ = new BehaviorSubject(false);
        this._isUpdatingStatus$ = new BehaviorSubject(false);
        this._isSubmit$ = combineLatest([this._isLoadingEmployee$, this._isUpdatingStatus$]).pipe(map(([isLoadingEmployee, isUpdatingStatus]) => isLoadingEmployee || isUpdatingStatus), distinctUntilChanged());
        this.platFormWebSiteUrl = environment.PLATFORM_WEBSITE_URL;
    }
    ngOnInit() {
        this.armTimer = setTimeout(() => (this.armed = true));
        this.user$
            .pipe(distinctUntilChange(), tap((user) => {
            // A user without an employee still has to invalidate the lookup in
            // flight: the filter below drops the emission, so without this an
            // earlier request could settle afterwards and repopulate the menu with
            // the previous employee, letting onChangeStatus() update that record.
            if (!user?.employee) {
                this.lookupId++;
                this._employee$.next(null);
                this._isLoadingEmployee$.next(false);
            }
        }), filter((user) => !!user?.employee), tap(async (user) => {
            const employeeId = user.employee.id;
            const lookupId = ++this.lookupId;
            this._isLoadingEmployee$.next(true);
            try {
                const employee = await firstValueFrom(this._employeeService.getEmployeeById(employeeId));
                if (lookupId !== this.lookupId) {
                    return;
                }
                this._employee$.next(employee);
            }
            catch (error) {
                // A superseded lookup owns nothing on screen any more: neither its
                // failure nor its error message belongs to the employee now shown.
                if (lookupId !== this.lookupId) {
                    return;
                }
                // Clear the cached employee only when it belongs to someone else:
                // keeping a stale employee would let onChangeStatus() write the away
                // flag to the wrong one, while a failed refresh of the same employee
                // should leave the status control on the data it already has.
                if (this.employee?.id !== employeeId) {
                    this._employee$.next(null);
                }
                this._errorHandler.handleError(error);
            }
            finally {
                // Always release the loading state, otherwise a failed load leaves
                // the status control stuck behind a spinner for the whole session.
                // A superseded lookup leaves it to the newer one still running.
                if (lookupId === this.lookupId) {
                    this._isLoadingEmployee$.next(false);
                }
            }
        }), untilDestroyed(this))
            .subscribe();
    }
    onClick() {
        this.close.emit();
    }
    onClickOutside(clickedInside) {
        if (!clickedInside && !this.clickedInOverlay && this.armed) {
            this.onClick();
        }
    }
    ngOnDestroy() {
        clearTimeout(this.armTimer);
    }
    async onChangeStatus() {
        // Guard against a second activation while a request is already in flight:
        // the disabled attribute covers pointer and keyboard, this covers the rest.
        // A lookup in flight counts too — the employee on screen is about to change.
        if (!this.employee || this._isLoadingEmployee$.getValue() || this._isUpdatingStatus$.getValue()) {
            return;
        }
        this._isUpdatingStatus$.next(true);
        try {
            const { id, isAway, tenantId, organizationId } = this.employee;
            // The guard above rules out a lookup in flight, so this is the lookup the
            // employee on screen came from. A user switch starting mid-update advances
            // the counter, which is how the write below spots that it is obsolete.
            const lookupId = this.lookupId;
            const payload = {
                isAway: !isAway,
                tenantId,
                organizationId
            };
            await this._employeeService.updateProfile(id, payload);
            // A user switch may have happened while this update was in flight. The
            // cached employee alone cannot tell: it still holds the previous one until
            // the new lookup settles, so the counter has to agree as well — otherwise
            // the away flag of the user who just left lands on the menu.
            if (lookupId === this.lookupId && this.employee?.id === id) {
                this._employee$.next({ ...this.employee, ...payload });
            }
        }
        catch (error) {
            this._errorHandler.handleError(error);
        }
        finally {
            this._isUpdatingStatus$.next(false);
        }
    }
    get employee() {
        return this._employee$.getValue();
    }
    get employee$() {
        return this._employee$.asObservable();
    }
    set user$(value) {
        if (value) {
            this._user$ = value;
        }
    }
    get user$() {
        return this._user$;
    }
    get isSubmit$() {
        return this._isSubmit$;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserMenuComponent, deps: [{ token: i1.EmployeesService }, { token: i1.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: UserMenuComponent, isStandalone: false, selector: "gauzy-user-menu", inputs: { user$: "user$" }, outputs: { close: "close" }, host: { listeners: { "document:click": "trackOverlayClick($event.target)" } }, ngImport: i0, template: "<div gauzyOutside (clickOutside)=\"onClickOutside($event)\" class=\"account-panel\">\n\t<header class=\"panel-header\">\n\t\t<gauzy-user showIdentity=\"true\" [user$]=\"user$\" (clicked)=\"onClick()\"></gauzy-user>\n\t\t<button type=\"button\" class=\"panel-close\" [attr.aria-label]=\"'BUTTONS.CLOSE' | translate\" (click)=\"onClick()\">\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</header>\n\n\t<div class=\"panel-section\">\n\t\t<span class=\"panel-overline\">{{ 'USER_MENU.ACCOUNT' | translate }}</span>\n\n\t\t<div class=\"status-control\" [nbSpinner]=\"isSubmit$ | async\" nbSpinnerSize=\"tiny\">\n\t\t\t@if (employee$ | async) {\n\t\t\t\t<button type=\"button\" class=\"panel-row\" [disabled]=\"isSubmit$ | async\" (click)=\"onChangeStatus()\">\n\t\t\t\t\t<nb-icon icon=\"moon-outline\"></nb-icon>\n\t\t\t\t\t<span\n\t\t\t\t\t\t[innerHTML]=\"\n\t\t\t\t\t\t\t((employee$ | async)?.isAway\n\t\t\t\t\t\t\t\t? 'USER_MENU.SET_YOURSELF_AS_ACTIVE'\n\t\t\t\t\t\t\t\t: 'USER_MENU.SET_YOURSELF_AS_AWAY'\n\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t\"\n\t\t\t\t\t></span>\n\t\t\t\t</button>\n\t\t\t}\n\t\t</div>\n\t\t<a class=\"panel-row\" routerLink=\"/pages/auth/profile\" (click)=\"onClick()\">\n\t\t\t<nb-icon icon=\"person-outline\"></nb-icon>\n\t\t\t<span>{{ 'USER_MENU.PROFILE' | translate }}</span>\n\t\t</a>\n\t</div>\n\n\t<div class=\"panel-divider\"></div>\n\n\t<div class=\"panel-section\">\n\t\t<span class=\"panel-overline\">{{ 'USER_MENU.PREFERENCES' | translate }}</span>\n\n\t\t<div class=\"control-row\">\n\t\t\t<gauzy-switch-theme class=\"theme\"></gauzy-switch-theme>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<ngx-theme-selector-container class=\"theme\"></ngx-theme-selector-container>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<ngx-theme-language-selector class=\"theme\"></ngx-theme-language-selector>\n\t\t</div>\n\t</div>\n\n\t<div class=\"panel-divider\"></div>\n\n\t<div class=\"panel-section\">\n\t\t<a class=\"panel-row\" target=\"_blank\" rel=\"noopener\" [href]=\"platFormWebSiteUrl\" (click)=\"onClick()\">\n\t\t\t<nb-icon icon=\"question-mark-circle-outline\"></nb-icon>\n\t\t\t<span>{{ 'USER_MENU.HELP' | translate }}</span>\n\t\t</a>\n\t\t<button type=\"button\" class=\"panel-row\" underConstruction>\n\t\t\t<nb-icon icon=\"keypad-outline\"></nb-icon>\n\t\t\t<span>{{ 'USER_MENU.HOTKEYS' | translate }}</span>\n\t\t</button>\n\t\t<a class=\"panel-row\" routerLink=\"/auth/logout\">\n\t\t\t<nb-icon icon=\"log-out-outline\"></nb-icon>\n\t\t\t<span>{{ 'USER_MENU.SIGN_OUT' | translate }}</span>\n\t\t</a>\n\t</div>\n\n\t<footer class=\"panel-footer\">\n\t\t<span class=\"download-label\">{{ 'USER_MENU.DOWNLOAD_APPS' | translate }}</span>\n\t\t<span class=\"download-icons\">\n\t\t\t@for (app of downloadApps; track app.label) {\n\t\t\t\t<a target=\"_blank\" [href]=\"app.link\" rel=\"noopener\" [attr.aria-label]=\"app.label | translate\">\n\t\t\t\t\t<i [class]=\"app.icon\" aria-hidden=\"true\"></i>\n\t\t\t\t</a>\n\t\t\t}\n\t\t</span>\n\t</footer>\n</div>\n\n<!-- TODO: Implement commented features\n\n<div underConstruction class=\"sub-menu\">\n  <span><i class=\"far fa-smile\"></i>{{ 'USER_MENU.STATUS' | translate }}</span>\n  <div class=\"status\">\n    <div class=\"button selected\">{{ 'USER_MENU.AVAILABLE' | translate }}</div>\n    <div class=\"button\">{{ 'USER_MENU.UNAVAILABLE' | translate }}</div>\n  </div>\n</div>\n<div underConstruction class=\"sub-menu\">\n  <span>{{ 'USER_MENU.PAUSE_NOTIFICATIONS' | translate }}</span>\n  <div class=\"notifications\">\n    <div class=\"button\">{{ 'USER_MENU.FOR_1_HOUR' | translate }}</div>\n    <div class=\"button\">{{ 'USER_MENU.FOR_2_HOURS' | translate }}</div>\n    <div class=\"button selected\">{{ 'USER_MENU.UNTIL_TOMORROW' | translate }}</div>\n    <div class=\"button\">{{ 'USER_MENU.CUSTOM' | translate }}</div>\n    <div class=\"button\">\n      <i class=\"far fa-calendar\"></i>\n      {{ 'USER_MENU.SET_AS_NOTIFICATION_SCHEDULE' | translate }}\n    </div>\n  </div>\n</div>\n-->\n", styles: [":host{display:block}.account-panel{border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, 8px);box-shadow:var(--gauzy-overlay-shadow, 0 8px 24px -6px rgba(0, 0, 0, .16), 0 2px 6px -2px rgba(0, 0, 0, .08));background-color:var(--background-basic-color-1);color:var(--text-basic-color);font-family:var(--font-family-primary);font-size:.75rem;line-height:1.4;display:flex;flex-direction:column;width:17.5rem;max-width:calc(100vw - 1.5rem);max-height:calc(100vh - 6rem);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding:.375rem;box-sizing:border-box}.panel-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:-.375rem -.375rem 0;padding:.5rem .625rem .5rem 1rem;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.panel-header gauzy-user{flex:1 1 auto;min-width:0}.panel-header gauzy-user ::ng-deep .user-container.with-identity{padding-inline:0}.panel-close{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.375rem;height:1.375rem;padding:0;border:0;border-radius:var(--gauzy-radius-sm, 6px);background:transparent;color:var(--text-hint-color);cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}.panel-close:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}.panel-close:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}.panel-close nb-icon,.panel-close i{font-size:.875rem;width:.875rem;height:.875rem;line-height:1}.panel-section{display:flex;flex-direction:column;gap:.125rem}.panel-overline{display:block;margin:0;padding:.5rem .625rem .25rem;font-size:.75rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;line-height:1;color:var(--text-hint-color);-webkit-user-select:none;user-select:none}.panel-divider{height:1px;margin:.375rem 0;border:0;background-color:var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.panel-row{display:flex;align-items:center;gap:.5rem;width:100%;margin:0;padding:.375rem .625rem;border:0;border-radius:var(--gauzy-radius-sm, 6px);box-shadow:none;background-color:transparent;color:var(--text-basic-color);font-size:.75rem;font-weight:400;line-height:1rem;text-align:start;text-decoration:none;cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}.panel-row:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}.panel-row:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}.panel-row nb-icon,.panel-row i{flex:0 0 auto;font-size:.9375rem;width:.9375rem;height:.9375rem;color:var(--text-hint-color)}.panel-row{font-family:inherit}.panel-row ::ng-deep strong{font-weight:600}.panel-row:disabled{cursor:default;opacity:.5}.status-control{display:flex;flex-direction:column;min-height:1.5rem}.control-row{display:flex;align-items:center;justify-content:space-between;gap:.75rem;width:100%;margin:0;padding:.375rem .625rem;font-size:.75rem;font-weight:400;line-height:1rem;color:var(--text-basic-color)}.control-row .theme{width:100%}.panel-footer{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:.375rem -.375rem -.375rem;padding:.4375rem 1rem;border-top:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));font-size:.6875rem;line-height:1;color:var(--text-hint-color)}.panel-footer .download-label{white-space:nowrap}.panel-footer .download-icons{display:flex;align-items:center;gap:.125rem}.panel-footer .download-icons a{display:inline-flex;align-items:center;justify-content:center;width:1.25rem;height:1.25rem;border-radius:var(--gauzy-radius-sm, 6px);color:var(--text-hint-color);text-decoration:none;transition:background-color .12s ease-in-out,color .12s ease-in-out}.panel-footer .download-icons a:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}.panel-footer .download-icons a i{font-size:.875rem;line-height:1}.account-panel ::ng-deep .theme-container,.account-panel ::ng-deep .switch-container{font-size:.75rem;font-weight:400;line-height:1rem;color:var(--text-basic-color);gap:.75rem;flex-wrap:nowrap}.account-panel ::ng-deep nb-select.appearance-outline .select-button{width:8.25rem;min-width:8.25rem;height:1.75rem;min-height:1.75rem;padding:0 .5rem;border:0;box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--gauzy-radius-sm, 6px);background-color:transparent;font-size:.75rem;font-weight:400;color:var(--text-basic-color)}.account-panel ::ng-deep nb-select.appearance-outline.status-basic .select-button.placeholder{font-size:.75rem;color:var(--text-basic-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.RouterLink, selector: "[routerLink]", inputs: ["target", "queryParams", "fragment", "queryParamsHandling", "state", "info", "relativeTo", "preserveFragment", "skipLocationChange", "replaceUrl", "routerLink"] }, { kind: "component", type: i3.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "directive", type: i3.NbSpinnerDirective, selector: "[nbSpinner]", inputs: ["nbSpinnerMessage", "nbSpinnerStatus", "nbSpinnerSize", "nbSpinner"] }, { kind: "component", type: i4.ThemeLanguageSelectorComponent, selector: "ngx-theme-language-selector" }, { kind: "component", type: i5.SwitchThemeComponent, selector: "gauzy-switch-theme", inputs: ["hasText"] }, { kind: "component", type: i6.ThemeSelectorContainerComponent, selector: "ngx-theme-selector-container", inputs: ["isClassic"] }, { kind: "directive", type: i7.OutsideDirective, selector: "[gauzyOutside]", outputs: ["clickOutside"] }, { kind: "directive", type: i7.UnderConstructionDirective, selector: "[underConstruction]" }, { kind: "component", type: i8.UserComponent, selector: "gauzy-user", inputs: ["showIdentity", "user$"], outputs: ["clicked"] }, { kind: "pipe", type: i9.AsyncPipe, name: "async" }, { kind: "pipe", type: i10.TranslatePipe, name: "translate" }] }); }
};
UserMenuComponent = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [EmployeesService,
        ErrorHandlingService])
], UserMenuComponent);
export { UserMenuComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UserMenuComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-user-menu', standalone: false, template: "<div gauzyOutside (clickOutside)=\"onClickOutside($event)\" class=\"account-panel\">\n\t<header class=\"panel-header\">\n\t\t<gauzy-user showIdentity=\"true\" [user$]=\"user$\" (clicked)=\"onClick()\"></gauzy-user>\n\t\t<button type=\"button\" class=\"panel-close\" [attr.aria-label]=\"'BUTTONS.CLOSE' | translate\" (click)=\"onClick()\">\n\t\t\t<nb-icon icon=\"close-outline\"></nb-icon>\n\t\t</button>\n\t</header>\n\n\t<div class=\"panel-section\">\n\t\t<span class=\"panel-overline\">{{ 'USER_MENU.ACCOUNT' | translate }}</span>\n\n\t\t<div class=\"status-control\" [nbSpinner]=\"isSubmit$ | async\" nbSpinnerSize=\"tiny\">\n\t\t\t@if (employee$ | async) {\n\t\t\t\t<button type=\"button\" class=\"panel-row\" [disabled]=\"isSubmit$ | async\" (click)=\"onChangeStatus()\">\n\t\t\t\t\t<nb-icon icon=\"moon-outline\"></nb-icon>\n\t\t\t\t\t<span\n\t\t\t\t\t\t[innerHTML]=\"\n\t\t\t\t\t\t\t((employee$ | async)?.isAway\n\t\t\t\t\t\t\t\t? 'USER_MENU.SET_YOURSELF_AS_ACTIVE'\n\t\t\t\t\t\t\t\t: 'USER_MENU.SET_YOURSELF_AS_AWAY'\n\t\t\t\t\t\t\t) | translate\n\t\t\t\t\t\t\"\n\t\t\t\t\t></span>\n\t\t\t\t</button>\n\t\t\t}\n\t\t</div>\n\t\t<a class=\"panel-row\" routerLink=\"/pages/auth/profile\" (click)=\"onClick()\">\n\t\t\t<nb-icon icon=\"person-outline\"></nb-icon>\n\t\t\t<span>{{ 'USER_MENU.PROFILE' | translate }}</span>\n\t\t</a>\n\t</div>\n\n\t<div class=\"panel-divider\"></div>\n\n\t<div class=\"panel-section\">\n\t\t<span class=\"panel-overline\">{{ 'USER_MENU.PREFERENCES' | translate }}</span>\n\n\t\t<div class=\"control-row\">\n\t\t\t<gauzy-switch-theme class=\"theme\"></gauzy-switch-theme>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<ngx-theme-selector-container class=\"theme\"></ngx-theme-selector-container>\n\t\t</div>\n\t\t<div class=\"control-row\">\n\t\t\t<ngx-theme-language-selector class=\"theme\"></ngx-theme-language-selector>\n\t\t</div>\n\t</div>\n\n\t<div class=\"panel-divider\"></div>\n\n\t<div class=\"panel-section\">\n\t\t<a class=\"panel-row\" target=\"_blank\" rel=\"noopener\" [href]=\"platFormWebSiteUrl\" (click)=\"onClick()\">\n\t\t\t<nb-icon icon=\"question-mark-circle-outline\"></nb-icon>\n\t\t\t<span>{{ 'USER_MENU.HELP' | translate }}</span>\n\t\t</a>\n\t\t<button type=\"button\" class=\"panel-row\" underConstruction>\n\t\t\t<nb-icon icon=\"keypad-outline\"></nb-icon>\n\t\t\t<span>{{ 'USER_MENU.HOTKEYS' | translate }}</span>\n\t\t</button>\n\t\t<a class=\"panel-row\" routerLink=\"/auth/logout\">\n\t\t\t<nb-icon icon=\"log-out-outline\"></nb-icon>\n\t\t\t<span>{{ 'USER_MENU.SIGN_OUT' | translate }}</span>\n\t\t</a>\n\t</div>\n\n\t<footer class=\"panel-footer\">\n\t\t<span class=\"download-label\">{{ 'USER_MENU.DOWNLOAD_APPS' | translate }}</span>\n\t\t<span class=\"download-icons\">\n\t\t\t@for (app of downloadApps; track app.label) {\n\t\t\t\t<a target=\"_blank\" [href]=\"app.link\" rel=\"noopener\" [attr.aria-label]=\"app.label | translate\">\n\t\t\t\t\t<i [class]=\"app.icon\" aria-hidden=\"true\"></i>\n\t\t\t\t</a>\n\t\t\t}\n\t\t</span>\n\t</footer>\n</div>\n\n<!-- TODO: Implement commented features\n\n<div underConstruction class=\"sub-menu\">\n  <span><i class=\"far fa-smile\"></i>{{ 'USER_MENU.STATUS' | translate }}</span>\n  <div class=\"status\">\n    <div class=\"button selected\">{{ 'USER_MENU.AVAILABLE' | translate }}</div>\n    <div class=\"button\">{{ 'USER_MENU.UNAVAILABLE' | translate }}</div>\n  </div>\n</div>\n<div underConstruction class=\"sub-menu\">\n  <span>{{ 'USER_MENU.PAUSE_NOTIFICATIONS' | translate }}</span>\n  <div class=\"notifications\">\n    <div class=\"button\">{{ 'USER_MENU.FOR_1_HOUR' | translate }}</div>\n    <div class=\"button\">{{ 'USER_MENU.FOR_2_HOURS' | translate }}</div>\n    <div class=\"button selected\">{{ 'USER_MENU.UNTIL_TOMORROW' | translate }}</div>\n    <div class=\"button\">{{ 'USER_MENU.CUSTOM' | translate }}</div>\n    <div class=\"button\">\n      <i class=\"far fa-calendar\"></i>\n      {{ 'USER_MENU.SET_AS_NOTIFICATION_SCHEDULE' | translate }}\n    </div>\n  </div>\n</div>\n-->\n", styles: [":host{display:block}.account-panel{border:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--border-radius, 8px);box-shadow:var(--gauzy-overlay-shadow, 0 8px 24px -6px rgba(0, 0, 0, .16), 0 2px 6px -2px rgba(0, 0, 0, .08));background-color:var(--background-basic-color-1);color:var(--text-basic-color);font-family:var(--font-family-primary);font-size:.75rem;line-height:1.4;display:flex;flex-direction:column;width:17.5rem;max-width:calc(100vw - 1.5rem);max-height:calc(100vh - 6rem);overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;padding:.375rem;box-sizing:border-box}.panel-header{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:-.375rem -.375rem 0;padding:.5rem .625rem .5rem 1rem;border-bottom:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.panel-header gauzy-user{flex:1 1 auto;min-width:0}.panel-header gauzy-user ::ng-deep .user-container.with-identity{padding-inline:0}.panel-close{display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;width:1.375rem;height:1.375rem;padding:0;border:0;border-radius:var(--gauzy-radius-sm, 6px);background:transparent;color:var(--text-hint-color);cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}.panel-close:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}.panel-close:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}.panel-close nb-icon,.panel-close i{font-size:.875rem;width:.875rem;height:.875rem;line-height:1}.panel-section{display:flex;flex-direction:column;gap:.125rem}.panel-overline{display:block;margin:0;padding:.5rem .625rem .25rem;font-size:.75rem;font-weight:600;letter-spacing:.06em;text-transform:uppercase;line-height:1;color:var(--text-hint-color);-webkit-user-select:none;user-select:none}.panel-divider{height:1px;margin:.375rem 0;border:0;background-color:var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18))}.panel-row{display:flex;align-items:center;gap:.5rem;width:100%;margin:0;padding:.375rem .625rem;border:0;border-radius:var(--gauzy-radius-sm, 6px);box-shadow:none;background-color:transparent;color:var(--text-basic-color);font-size:.75rem;font-weight:400;line-height:1rem;text-align:start;text-decoration:none;cursor:pointer;transition:background-color .12s ease-in-out,color .12s ease-in-out}.panel-row:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}.panel-row:focus-visible{outline:2px solid var(--color-primary-default);outline-offset:-2px}.panel-row nb-icon,.panel-row i{flex:0 0 auto;font-size:.9375rem;width:.9375rem;height:.9375rem;color:var(--text-hint-color)}.panel-row{font-family:inherit}.panel-row ::ng-deep strong{font-weight:600}.panel-row:disabled{cursor:default;opacity:.5}.status-control{display:flex;flex-direction:column;min-height:1.5rem}.control-row{display:flex;align-items:center;justify-content:space-between;gap:.75rem;width:100%;margin:0;padding:.375rem .625rem;font-size:.75rem;font-weight:400;line-height:1rem;color:var(--text-basic-color)}.control-row .theme{width:100%}.panel-footer{display:flex;align-items:center;justify-content:space-between;gap:.5rem;margin:.375rem -.375rem -.375rem;padding:.4375rem 1rem;border-top:1px solid var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));font-size:.6875rem;line-height:1;color:var(--text-hint-color)}.panel-footer .download-label{white-space:nowrap}.panel-footer .download-icons{display:flex;align-items:center;gap:.125rem}.panel-footer .download-icons a{display:inline-flex;align-items:center;justify-content:center;width:1.25rem;height:1.25rem;border-radius:var(--gauzy-radius-sm, 6px);color:var(--text-hint-color);text-decoration:none;transition:background-color .12s ease-in-out,color .12s ease-in-out}.panel-footer .download-icons a:hover{background-color:var(--gauzy-hover-tint, rgba(126, 126, 143, .12));color:var(--text-basic-color)}.panel-footer .download-icons a i{font-size:.875rem;line-height:1}.account-panel ::ng-deep .theme-container,.account-panel ::ng-deep .switch-container{font-size:.75rem;font-weight:400;line-height:1rem;color:var(--text-basic-color);gap:.75rem;flex-wrap:nowrap}.account-panel ::ng-deep nb-select.appearance-outline .select-button{width:8.25rem;min-width:8.25rem;height:1.75rem;min-height:1.75rem;padding:0 .5rem;border:0;box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));border-radius:var(--gauzy-radius-sm, 6px);background-color:transparent;font-size:.75rem;font-weight:400;color:var(--text-basic-color)}.account-panel ::ng-deep nb-select.appearance-outline.status-basic .select-button.placeholder{font-size:.75rem;color:var(--text-basic-color)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.EmployeesService }, { type: i1.ErrorHandlingService }], propDecorators: { close: [{
                type: Output
            }], trackOverlayClick: [{
                type: HostListener,
                args: ['document:click', ['$event.target']]
            }], user$: [{
                type: Input
            }] } });
//# sourceMappingURL=user-menu.component.js.map