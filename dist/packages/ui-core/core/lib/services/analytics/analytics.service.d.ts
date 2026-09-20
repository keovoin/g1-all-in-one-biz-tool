import { Router } from '@angular/router';
import { Location } from '@angular/common';
import * as i0 from "@angular/core";
export declare class AnalyticsService {
    private location;
    private router;
    private enabled;
    constructor(location: Location, router: Router);
    trackPageViews(): void;
    trackEvent(eventName: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AnalyticsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AnalyticsService>;
}
