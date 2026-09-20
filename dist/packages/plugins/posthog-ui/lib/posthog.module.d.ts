import { ModuleWithProviders } from '@angular/core';
import { PostHogModuleConfig } from './interfaces/posthog.interface';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
import * as i2 from "./directives/posthog-track.directive";
import * as i3 from "./directives/posthog-form-track.directive";
/**
 * Module for integrating PostHog into Angular applications
 */
export declare class PostHogModule {
    /**
     * Configures and provides the PostHog module with initialization options
     * @param config - Configuration options including API key
     * @returns Module with providers configured
     */
    static forRoot(config: PostHogModuleConfig): ModuleWithProviders<PostHogModule>;
    /**
     * Provides PostHog for testing/mocking purposes without initialization
     */
    static forTesting(): ModuleWithProviders<PostHogModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<PostHogModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<PostHogModule, never, [typeof i1.CommonModule, typeof i2.PostHogTrackDirective, typeof i3.PostHogFormTrackDirective], [typeof i2.PostHogTrackDirective, typeof i3.PostHogFormTrackDirective]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<PostHogModule>;
}
