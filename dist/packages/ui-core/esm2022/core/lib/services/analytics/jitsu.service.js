import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { jitsuAnalytics, emptyAnalytics } from '@jitsu/js';
import { environment } from '@gauzy/ui-config';
import { JitsuAnalyticsEventsEnum } from './event.type';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "@angular/router";
export class JitsuService {
    constructor(location, router) {
        this.location = location;
        this.router = router;
        this.jitsuClient =
            environment.JITSU_BROWSER_URL && environment.JITSU_BROWSER_WRITE_KEY
                ? jitsuAnalytics({
                    host: environment.JITSU_BROWSER_URL,
                    writeKey: environment.JITSU_BROWSER_WRITE_KEY,
                    debug: false,
                    echoEvents: false
                })
                : emptyAnalytics;
    }
    async identify(id, traits) {
        return await this.jitsuClient.identify(id, traits);
    }
    trackPageViews() {
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.page(JitsuAnalyticsEventsEnum.PAGE_VIEW, this.location.path());
        });
    }
    async trackEvents(event, properties) {
        return await this.jitsuClient.track(event, properties);
    }
    async page(name, url) {
        return await this.jitsuClient.page({
            name: name,
            path: url,
            environment: window.navigator.platform,
            context: {
                page: {
                    url: url
                }
            }
        });
    }
    // this deletes the data store
    async reset() {
        return await this.jitsuClient.reset();
    }
    async group(id, traits) {
        return await this.jitsuClient.group(id, traits);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JitsuService, deps: [{ token: i1.Location }, { token: i2.Router }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JitsuService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: JitsuService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.Location }, { type: i2.Router }] });
//# sourceMappingURL=jitsu.service.js.map