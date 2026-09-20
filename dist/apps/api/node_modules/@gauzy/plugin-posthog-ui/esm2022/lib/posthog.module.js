import { NgModule, inject, provideAppInitializer } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { PostHogTrackDirective } from './directives/posthog-track.directive';
import { PostHogInterceptor } from './interceptors/posthog.interceptor';
import { PostHogService } from './services/posthog.service';
import { POSTHOG_CONFIG, POSTHOG_DEBUG_MODE } from './interfaces/posthog.interface';
import { initializePostHogFactory } from './services/posthog-init.factory';
import { PostHogServiceManager } from './services/posthog-manager.service';
import { PostHogFormTrackDirective } from './directives/posthog-form-track.directive';
import * as i0 from "@angular/core";
/**
 * Module for integrating PostHog into Angular applications
 */
export class PostHogModule {
    /**
     * Configures and provides the PostHog module with initialization options
     * @param config - Configuration options including API key
     * @returns Module with providers configured
     */
    static forRoot(config) {
        return {
            ngModule: PostHogModule,
            providers: [
                // Core services
                PostHogService,
                PostHogServiceManager,
                {
                    provide: POSTHOG_CONFIG,
                    useValue: config
                },
                {
                    provide: POSTHOG_DEBUG_MODE,
                    useValue: config.debug || false
                },
                // Initialize PostHog during app startup
                provideAppInitializer(() => {
                    const manager = inject(PostHogServiceManager);
                    const posthogConfig = inject(POSTHOG_CONFIG);
                    return initializePostHogFactory(manager, posthogConfig)();
                }),
                // Conditionally add HTTP interceptor for error tracking
                ...(config.options?.capture_exceptions !== false
                    ? [
                        {
                            provide: HTTP_INTERCEPTORS,
                            useClass: PostHogInterceptor,
                            multi: true
                        }
                    ]
                    : [])
            ]
        };
    }
    /**
     * Provides PostHog for testing/mocking purposes without initialization
     */
    static forTesting() {
        return {
            ngModule: PostHogModule,
            providers: [
                PostHogService,
                PostHogServiceManager,
                {
                    provide: POSTHOG_CONFIG,
                    useValue: { apiKey: 'test-key', options: { loaded: () => { } } }
                },
                {
                    provide: POSTHOG_DEBUG_MODE,
                    useValue: true
                }
            ]
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: PostHogModule, imports: [CommonModule, PostHogTrackDirective, PostHogFormTrackDirective], exports: [PostHogTrackDirective, PostHogFormTrackDirective] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogModule, imports: [CommonModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PostHogModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, PostHogTrackDirective, PostHogFormTrackDirective],
                    exports: [PostHogTrackDirective, PostHogFormTrackDirective]
                }]
        }] });
//# sourceMappingURL=posthog.module.js.map