import { ThemeSelectorComponent } from '../theme-selector.component';
import { NbThemeService } from '@nebular/theme';
import { Store } from '@gauzy/ui-core/core';
import { SwitchThemeService } from './switch-theme.service';
import { ActivatedRoute } from '@angular/router';
import * as i0 from "@angular/core";
export declare class SwitchThemeComponent extends ThemeSelectorComponent {
    private readonly switchService;
    readonly themeService: NbThemeService;
    readonly store: Store;
    private readonly activatedRoute;
    private DARK_OS_SCHEME;
    private LIGHT_OS_SCHEME;
    hasText: boolean;
    /**
     *
     * @param switchService
     * @param themeService
     * @param store
     */
    constructor(switchService: SwitchThemeService, themeService: NbThemeService, store: Store, activatedRoute: ActivatedRoute);
    /**
     * this method help to switch to opposite current theme
     */
    switchTheme(): void;
    /**
     * get current OS color and switching to it.
     */
    getPreferColorOsScheme(): void;
    private handleThemeChange;
    static ɵfac: i0.ɵɵFactoryDeclaration<SwitchThemeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SwitchThemeComponent, "gauzy-switch-theme", never, { "hasText": { "alias": "hasText"; "required": false; }; }, {}, never, never, false, never>;
}
