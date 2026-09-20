import { __decorate, __metadata } from "tslib";
import { Component, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { tap } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store, UpworkStoreService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@gauzy/ui-core/shared";
import * as i3 from "@ngx-translate/core";
let UpworkComponent = class UpworkComponent extends TranslationBaseComponent {
    constructor() {
        super(inject(TranslateService));
        this._router = inject(Router);
        this._activatedRoute = inject(ActivatedRoute);
        this._upworkStore = inject(UpworkStoreService);
        this._store = inject(Store);
        this.tabs = signal([], ...(ngDevMode ? [{ debugName: "tabs" }] : []));
        this.menus = signal([], ...(ngDevMode ? [{ debugName: "menus" }] : []));
        this.integrationId = signal(undefined, ...(ngDevMode ? [{ debugName: "integrationId" }] : []));
        this.organization = signal(undefined, ...(ngDevMode ? [{ debugName: "organization" }] : []));
    }
    ngOnInit() {
        this._loadTabs();
        this._applyTranslationOnTabsActions();
        this._activatedRoute.params
            .pipe(tap((params) => {
            this.integrationId.set(params['id']);
        }), tap(() => this._loadMenus()), untilDestroyed(this))
            .subscribe();
        this._store.selectedOrganization$
            .pipe(filter((organization) => !!organization), tap((organization) => {
            this.organization.set(organization);
        }), tap(() => this._getConfig()), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Loads the Upwork integration's non-secret configuration state into the store.
     *
     * The tenant is no longer sent: the API takes it from the authenticated request context, so a
     * client can neither name another tenant nor learn anything about one (GHSA-3rqg-gpm9-gx84).
     */
    _getConfig() {
        const { id: organizationId } = this.organization();
        const integrationId = this.integrationId();
        this._upworkStore.getConfig({ integrationId, organizationId }).pipe(untilDestroyed(this)).subscribe();
    }
    /**
     *
     * @param tabName
     * @returns
     */
    getRoute(tabName) {
        return `./${tabName}`;
    }
    /**
     *
     */
    _loadTabs() {
        this.tabs.set([
            {
                title: this.getTranslation('INTEGRATIONS.UPWORK_PAGE.ACTIVITIES'),
                icon: 'trending-up-outline',
                responsive: true,
                route: this.getRoute('activities')
            },
            {
                title: this.getTranslation('INTEGRATIONS.UPWORK_PAGE.REPORTS'),
                icon: 'file-text-outline',
                responsive: true,
                route: this.getRoute('reports')
            },
            {
                title: this.getTranslation('INTEGRATIONS.UPWORK_PAGE.TRANSACTIONS'),
                icon: 'flip-outline',
                responsive: true,
                route: this.getRoute('transactions')
            },
            {
                title: this.getTranslation('INTEGRATIONS.UPWORK_PAGE.CONTRACTS'),
                icon: 'book-outline',
                responsive: true,
                route: this.getRoute('contracts')
            }
        ]);
    }
    /**
     *
     */
    _loadMenus() {
        this.menus.set([
            {
                title: this.getTranslation('INTEGRATIONS.RE_INTEGRATE'),
                icon: 'text-outline',
                link: `pages/integrations/upwork/regenerate`
            },
            {
                title: this.getTranslation('INTEGRATIONS.SETTINGS'),
                icon: 'settings-2-outline',
                link: `pages/integrations/upwork/${this.integrationId()}/settings`
            }
        ]);
    }
    _applyTranslationOnTabsActions() {
        this.translateService.onLangChange
            .pipe(tap(() => {
            this._loadTabs();
            this._loadMenus();
        }), untilDestroyed(this))
            .subscribe();
    }
    /**
     * Navigate to the "Integrations" page.
     */
    navigateToIntegrations() {
        this._router.navigate(['/pages/integrations']);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpworkComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: UpworkComponent, isStandalone: false, selector: "ngx-upwork", usesInheritance: true, ngImport: i0, template: "<nb-card class=\"card-sroll\">\n\t<nb-card-header>\n\t\t<ngx-back-navigation\n\t\t\t[haveLink]=\"true\"\n\t\t\tclass=\"float-left\"\n\t\t\t(click)=\"navigateToIntegrations()\"\n\t\t></ngx-back-navigation>\n\t\t<nb-actions class=\"float-left pt-2\" size=\"small\">\n\t\t\t<nb-action class=\"toggle-layout p-0\">\n\t\t\t\t<h5>{{ 'MENU.UPWORK' | translate }}</h5>\n\t\t\t\t<nb-icon icon=\"settings-2-outline\" [nbContextMenu]=\"menus()\"></nb-icon>\n\t\t\t</nb-action>\n\t\t</nb-actions>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<div>\n\t\t\t<nb-route-tabset [tabs]=\"tabs()\" fullWidth></nb-route-tabset>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n", dependencies: [{ kind: "component", type: i1.NbActionComponent, selector: "nb-action", inputs: ["link", "href", "title", "icon", "disabled", "badgeDot", "badgeText", "badgeStatus", "badgePosition"] }, { kind: "component", type: i1.NbActionsComponent, selector: "nb-actions", inputs: ["size", "fullWidth"] }, { kind: "component", type: i1.NbCardComponent, selector: "nb-card", inputs: ["size", "status", "accent"] }, { kind: "component", type: i1.NbCardBodyComponent, selector: "nb-card-body" }, { kind: "component", type: i1.NbCardHeaderComponent, selector: "nb-card-header" }, { kind: "directive", type: i1.NbContextMenuDirective, selector: "[nbContextMenu]", inputs: ["nbContextMenuPlacement", "nbContextMenuAdjustment", "nbContextMenuTag", "nbContextMenu", "nbContextMenuTrigger", "nbContextMenuClass"] }, { kind: "component", type: i1.NbIconComponent, selector: "nb-icon", inputs: ["icon", "pack", "options", "status", "config"] }, { kind: "component", type: i1.NbRouteTabsetComponent, selector: "nb-route-tabset", inputs: ["tabs", "activeLinkOptions", "fullWidth"], outputs: ["changeTab"] }, { kind: "component", type: i2.BackNavigationComponent, selector: "ngx-back-navigation", inputs: ["haveLink"] }, { kind: "pipe", type: i3.TranslatePipe, name: "translate" }], changeDetection: i0.ChangeDetectionStrategy.OnPush }); }
};
UpworkComponent = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [])
], UpworkComponent);
export { UpworkComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: UpworkComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-upwork', standalone: false, changeDetection: ChangeDetectionStrategy.OnPush, template: "<nb-card class=\"card-sroll\">\n\t<nb-card-header>\n\t\t<ngx-back-navigation\n\t\t\t[haveLink]=\"true\"\n\t\t\tclass=\"float-left\"\n\t\t\t(click)=\"navigateToIntegrations()\"\n\t\t></ngx-back-navigation>\n\t\t<nb-actions class=\"float-left pt-2\" size=\"small\">\n\t\t\t<nb-action class=\"toggle-layout p-0\">\n\t\t\t\t<h5>{{ 'MENU.UPWORK' | translate }}</h5>\n\t\t\t\t<nb-icon icon=\"settings-2-outline\" [nbContextMenu]=\"menus()\"></nb-icon>\n\t\t\t</nb-action>\n\t\t</nb-actions>\n\t</nb-card-header>\n\t<nb-card-body>\n\t\t<div>\n\t\t\t<nb-route-tabset [tabs]=\"tabs()\" fullWidth></nb-route-tabset>\n\t\t</div>\n\t</nb-card-body>\n</nb-card>\n" }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=upwork.component.js.map