import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { JitsuAnalyticsEvents } from './event.type';
import * as i0 from "@angular/core";
export declare class JitsuService {
    private readonly location;
    private readonly router;
    private jitsuClient;
    constructor(location: Location, router: Router);
    identify(id?: string | object, traits?: Record<string, any> | Function | null): Promise<any>;
    trackPageViews(): void;
    trackEvents(event: string, properties?: Record<string, any> | null | JitsuAnalyticsEvents): Promise<any>;
    page(name: string, url: string): Promise<any>;
    reset(): Promise<any>;
    group(id: string | object, traits?: Record<string, any> | null): Promise<any>;
    static ɵfac: i0.ɵɵFactoryDeclaration<JitsuService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<JitsuService>;
}
