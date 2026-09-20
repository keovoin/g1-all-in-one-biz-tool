import { RippleGlobalOptions } from '@angular/material/core';
import * as i0 from "@angular/core";
export declare class AppGlobalRippleOptions implements RippleGlobalOptions {
    /** Whether ripples should be disabled globally. */
    disabled: boolean;
    /**
     * Toggles the Ripple effect.
     * @param enabled Whether to enable or disable the Ripple effect.
     * For more information on updating global options at runtime, refer to:
     * {@link https://material.angular.io/components/ripple/overview#updating-global-options-at-runtime}
     */
    toggle(enabled: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AppGlobalRippleOptions, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AppGlobalRippleOptions>;
}
