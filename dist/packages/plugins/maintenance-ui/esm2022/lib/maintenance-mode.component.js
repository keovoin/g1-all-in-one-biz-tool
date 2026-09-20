import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { environment } from '@gauzy/ui-config';
import { ServerConnectionService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
import * as i1 from "@gauzy/ui-core/core";
import * as i2 from "@angular/common";
import * as i3 from "@nebular/theme";
import * as i4 from "@ngx-translate/core";
export class MaintenanceModeComponent {
    constructor(_store, _location, _serverConnectionService) {
        this._store = _store;
        this._location = _location;
        this._serverConnectionService = _serverConnectionService;
        this.noInternetLogo = environment['NO_INTERNET_LOGO'];
    }
    ngOnInit() {
        this.checkConnection();
    }
    /**
     * Checks the server connection every 5 seconds.
     */
    async checkConnection() {
        const url = environment.API_BASE_URL;
        console.log('Checking server connection to URL: ', url);
        this.interval = setInterval(async () => {
            console.log('Checking server connection...');
            await this._serverConnectionService.checkServerConnection(url);
            // Check if the server is online
            if (Number(this._store.serverConnection) === 200) {
                console.log('Server is online');
                clearInterval(this.interval);
                this._location.back();
            }
            else {
                console.log('Server is offline');
            }
        }, 5000);
    }
    /**
     * Checks if the company site is defined in the environment.
     *
     * @return {string} The company site name.
     */
    get companySite() {
        return environment.COMPANY_SITE_NAME;
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MaintenanceModeComponent, deps: [{ token: i1.Store }, { token: i2.Location }, { token: i1.ServerConnectionService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: MaintenanceModeComponent, isStandalone: false, selector: "ga-maintenance-mode", ngImport: i0, template: "<nb-layout>\n\t<nb-layout-column class=\"info-page\" scroll=\"false\">\n\t\t<div class=\"maintenance-mode-content\">\n\t\t\t<div class=\"logo\">\n\t\t\t\t<img [src]=\"noInternetLogo\" />\n\t\t\t</div>\n\t\t\t<div class=\"info-message\">\n\t\t\t\t<h3 class=\"mt-4\">{{ 'GAUZY_MAINTENANCE' | translate : { companySite } }}</h3>\n\t\t\t</div>\n\t\t</div>\n\t</nb-layout-column>\n</nb-layout>\n", styles: [".info-page{padding:0!important}.info-page .maintenance-mode-content{color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;height:100%;flex-direction:column}.info-page .maintenance-mode-content img{max-height:96px;max-width:300px;width:auto}.info-page .maintenance-mode-content .info-message h3{color:red;width:100%}\n"], dependencies: [{ kind: "component", type: i3.NbLayoutComponent, selector: "nb-layout", inputs: ["center", "windowMode", "withScroll", "restoreScrollTop"] }, { kind: "component", type: i3.NbLayoutColumnComponent, selector: "nb-layout-column", inputs: ["left", "start"] }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MaintenanceModeComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-maintenance-mode', standalone: false, template: "<nb-layout>\n\t<nb-layout-column class=\"info-page\" scroll=\"false\">\n\t\t<div class=\"maintenance-mode-content\">\n\t\t\t<div class=\"logo\">\n\t\t\t\t<img [src]=\"noInternetLogo\" />\n\t\t\t</div>\n\t\t\t<div class=\"info-message\">\n\t\t\t\t<h3 class=\"mt-4\">{{ 'GAUZY_MAINTENANCE' | translate : { companySite } }}</h3>\n\t\t\t</div>\n\t\t</div>\n\t</nb-layout-column>\n</nb-layout>\n", styles: [".info-page{padding:0!important}.info-page .maintenance-mode-content{color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;height:100%;flex-direction:column}.info-page .maintenance-mode-content img{max-height:96px;max-width:300px;width:auto}.info-page .maintenance-mode-content .info-message h3{color:red;width:100%}\n"] }]
        }], ctorParameters: () => [{ type: i1.Store }, { type: i2.Location }, { type: i1.ServerConnectionService }] });
//# sourceMappingURL=maintenance-mode.component.js.map