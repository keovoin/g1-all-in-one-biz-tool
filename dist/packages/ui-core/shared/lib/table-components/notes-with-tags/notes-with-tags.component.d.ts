import { OnInit } from '@angular/core';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import { NbThemeService } from '@nebular/theme';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rgba } from 'ngx-color-picker';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class NotesWithTagsComponent extends TranslationBaseComponent implements OnInit {
    protected readonly themeService: NbThemeService;
    protected readonly translateService: TranslateService;
    rowData: any;
    value: any;
    layout?: ComponentLayoutStyleEnum | undefined;
    private textColor;
    data$: BehaviorSubject<any>;
    data: Observable<any>;
    constructor(themeService: NbThemeService, translateService: TranslateService);
    ngOnInit(): void;
    /**
     *
     * @param bgColor
     * @returns
     */
    background(bgColor: string): string;
    /**
     * Calculates the appropriate text color based on the contrast with the background color.
     *
     * @param {string} bgColor - The background color in hex or RGB format.
     * @returns {string} - The recommended text color ('#ffffff' for dark backgrounds, '#000000' for light backgrounds, or a default color).
     */
    backgroundContrast(bgColor: string, minThreshold?: number, maxThreshold?: number): string;
    /**
     *
     * @param hex
     * @returns
     */
    hex2rgb(hex: string): Rgba;
    /**
     *
     * @param hex
     * @returns
     */
    private _test;
    static ɵfac: i0.ɵɵFactoryDeclaration<NotesWithTagsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<NotesWithTagsComponent, "ga-notes-with-tags", never, { "rowData": { "alias": "rowData"; "required": false; }; "value": { "alias": "value"; "required": false; }; "layout": { "alias": "layout"; "required": false; }; }, {}, never, never, false, never>;
}
