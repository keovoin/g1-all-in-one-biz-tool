import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class SwitchThemeService {
    private readonly store;
    private _isAlreadyLoaded;
    private _hasAlreadyPreferredTheme;
    constructor(store: Store);
    get isAlreadyLoaded(): boolean;
    set isAlreadyLoaded(value: boolean);
    get hasAlreadyPreferredTheme(): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwitchThemeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SwitchThemeService>;
}
