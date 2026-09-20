import { NbThemeService } from '@nebular/theme';
import { Store } from '@gauzy/ui-core/core';
import { ThemeSelectorComponent } from '../theme-selector.component';
import * as i0 from "@angular/core";
export declare class ThemeSelectorImageComponent extends ThemeSelectorComponent {
    readonly themeService: NbThemeService;
    readonly store: Store;
    private readonly _popover;
    constructor(themeService: NbThemeService, store: Store);
    protected get isOpen(): boolean;
    protected selectTheme(theme: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThemeSelectorImageComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ThemeSelectorImageComponent, "gauzy-theme-selector-image", never, {}, {}, never, never, false, never>;
}
