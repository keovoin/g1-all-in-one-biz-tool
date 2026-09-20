import { OnInit } from '@angular/core';
import { Store } from '@gauzy/ui-core/core';
import { NbThemeService } from '@nebular/theme';
import { BehaviorSubject, Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class ThemeSelectorComponent implements OnInit {
    protected readonly themeService: NbThemeService;
    protected readonly store: Store;
    _themes: {
        light: {
            value: string;
            name: string;
            imageUrl: string;
        };
        dark: {
            value: string;
            name: string;
            imageUrl: string;
        };
    }[];
    switch: Observable<boolean>;
    switch$: BehaviorSubject<boolean>;
    currentTheme: string;
    currentTheme$: BehaviorSubject<string>;
    selected: Observable<any>;
    selected$: BehaviorSubject<any>;
    constructor(themeService: NbThemeService, store: Store);
    ngOnInit(): void;
    toggleTheme(): void;
    get themes(): string[];
    updateSwitch(): void;
    updateCard(): void;
    onSelectedTheme(theme: any): void;
    reverseTheme(): void;
    /**
     * Checks if the current theme is dark or light and provides information about the opposite theme.
     * @returns An object containing information about the current theme state and its opposite.
     */
    get isDark(): {
        previous: any;
        reverse: string;
        state: boolean;
    };
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ThemeSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ThemeSelectorComponent, "gauzy-theme-selector", never, {}, {}, never, never, false, never>;
}
