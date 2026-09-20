import { Component, Input } from '@angular/core';
import { ComponentLayoutStyleEnum } from '@gauzy/contracts';
import { Color } from '@kurkle/color';
import { NbThemeService } from '@nebular/theme';
import { BehaviorSubject, Observable } from 'rxjs';
import { Rgba } from 'ngx-color-picker';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "@ngx-translate/core";
import * as i3 from "../../directives/img.directive";
import * as i4 from "@angular/common";
export class NotesWithTagsComponent extends TranslationBaseComponent {
    constructor(themeService, translateService) {
        super(translateService);
        this.themeService = themeService;
        this.translateService = translateService;
        this.data$ = new BehaviorSubject(null);
        this.data = new Observable(null);
    }
    ngOnInit() {
        this.themeService.getJsTheme().subscribe((theme) => {
            this.textColor = theme.variables.fgText.toString();
            this.data$.next(this.rowData);
            this.data = this.data$.asObservable();
        });
    }
    /**
     *
     * @param bgColor
     * @returns
     */
    background(bgColor) {
        let color = new Color(bgColor);
        return color.valid ? bgColor : this._test(bgColor);
    }
    /**
     * Calculates the appropriate text color based on the contrast with the background color.
     *
     * @param {string} bgColor - The background color in hex or RGB format.
     * @returns {string} - The recommended text color ('#ffffff' for dark backgrounds, '#000000' for light backgrounds, or a default color).
     */
    backgroundContrast(bgColor, minThreshold = 128, maxThreshold = 186) {
        let color = new Color(bgColor);
        color = color.valid ? color : new Color(this.hex2rgb(bgColor));
        const contrast = color.rgb ? color.rgb.r * 0.299 + color.rgb.g * 0.587 + color.rgb.b * 0.114 : null;
        if (contrast < minThreshold) {
            return '#ffffff';
        }
        else if (contrast > maxThreshold) {
            return '#000000';
        }
        else {
            return this.textColor;
        }
    }
    /**
     *
     * @param hex
     * @returns
     */
    hex2rgb(hex) {
        hex = this._test(hex);
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return new Rgba(r, g, b, 1);
    }
    /**
     *
     * @param hex
     * @returns
     */
    _test(hex) {
        const regex = /^#[0-9A-F]{6}$/i;
        if (regex.test(hex)) {
            return hex;
        }
        else {
            hex = '#' + hex;
            return regex.test(hex) ? hex : '#000000';
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NotesWithTagsComponent, deps: [{ token: i1.NbThemeService }, { token: i2.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: NotesWithTagsComponent, isStandalone: false, selector: "ga-notes-with-tags", inputs: { rowData: "rowData", value: "value", layout: "layout" }, usesInheritance: true, ngImport: i0, template: "<div>\n\t@if (rowData?.notes) {\n\t<div>{{ rowData.notes }}</div>\n\t} @if (rowData?.description) {\n\t<div [hidden]=\"rowData?.title || rowData?.name\">\n\t\t{{ rowData.description }}\n\t</div>\n\t} @if (rowData?.purpose) {\n\t<div>{{ rowData?.purpose }}</div>\n\t} @if (rowData?.invoiceNumber) {\n\t<div>{{ rowData?.invoiceNumber }}</div>\n\t} @if (rowData?.title) {\n\t<div>{{ rowData?.title }}</div>\n\t} @if (rowData?.jobTitle) {\n\t<div>{{ rowData?.jobTitle }}</div>\n\t}\n\t<div [class.contacts-img]=\"layout === 'CARDS_GRID'\">\n\t\t@if (rowData?.imageUrl) {\n\t\t<div>\n\t\t\t<img height=\"30\" width=\"50\" [src]=\"rowData?.imageUrl\" alt=\"Avatar\" class=\"avatar\" />\n\t\t</div>\n\t\t} @if (rowData?.name) {\n\t\t<div>{{ rowData?.name }}</div>\n\t\t}\n\t</div>\n\t@if (rowData?.level) {\n\t<div>{{ rowData?.level }}</div>\n\t}\n\t<div class=\"tags {{ layout === 'CARDS_GRID' ? 'tags-right' : '' }} mt-2\">\n\t\t@for (tag of (data | async)?.tags; track tag) {\n\t\t<nb-badge\n\t\t\tclass=\"color\"\n\t\t\tposition=\"centered\"\n\t\t\t[text]=\"tag.name\"\n\t\t\t[style.background]=\"background(tag.color)\"\n\t\t\t[style.color]=\"backgroundContrast(tag.color)\"\n\t\t></nb-badge>\n\t\t}\n\t</div>\n</div>\n", styles: [".color{position:static;display:inline-block;font-size:var(--gauzy-table-chip-font-size, .6875rem);font-weight:600;line-height:var(--gauzy-table-chip-line-height, .875rem);letter-spacing:0em;padding:var(--gauzy-table-chip-padding-y, .0625rem) var(--gauzy-table-chip-padding-x, .375rem)}.tags{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--gauzy-table-chip-gap, .1875rem);margin-top:var(--gauzy-table-chip-block-gap, .25rem)!important}.tags-right{display:flex;justify-content:flex-end;width:100%}.contacts-img{display:flex;justify-content:space-between}.avatar{width:60px;height:60px;border-radius:50%}\n"], dependencies: [{ kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "directive", type: i3.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }, { kind: "pipe", type: i4.AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: NotesWithTagsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-notes-with-tags', standalone: false, template: "<div>\n\t@if (rowData?.notes) {\n\t<div>{{ rowData.notes }}</div>\n\t} @if (rowData?.description) {\n\t<div [hidden]=\"rowData?.title || rowData?.name\">\n\t\t{{ rowData.description }}\n\t</div>\n\t} @if (rowData?.purpose) {\n\t<div>{{ rowData?.purpose }}</div>\n\t} @if (rowData?.invoiceNumber) {\n\t<div>{{ rowData?.invoiceNumber }}</div>\n\t} @if (rowData?.title) {\n\t<div>{{ rowData?.title }}</div>\n\t} @if (rowData?.jobTitle) {\n\t<div>{{ rowData?.jobTitle }}</div>\n\t}\n\t<div [class.contacts-img]=\"layout === 'CARDS_GRID'\">\n\t\t@if (rowData?.imageUrl) {\n\t\t<div>\n\t\t\t<img height=\"30\" width=\"50\" [src]=\"rowData?.imageUrl\" alt=\"Avatar\" class=\"avatar\" />\n\t\t</div>\n\t\t} @if (rowData?.name) {\n\t\t<div>{{ rowData?.name }}</div>\n\t\t}\n\t</div>\n\t@if (rowData?.level) {\n\t<div>{{ rowData?.level }}</div>\n\t}\n\t<div class=\"tags {{ layout === 'CARDS_GRID' ? 'tags-right' : '' }} mt-2\">\n\t\t@for (tag of (data | async)?.tags; track tag) {\n\t\t<nb-badge\n\t\t\tclass=\"color\"\n\t\t\tposition=\"centered\"\n\t\t\t[text]=\"tag.name\"\n\t\t\t[style.background]=\"background(tag.color)\"\n\t\t\t[style.color]=\"backgroundContrast(tag.color)\"\n\t\t></nb-badge>\n\t\t}\n\t</div>\n</div>\n", styles: [".color{position:static;display:inline-block;font-size:var(--gauzy-table-chip-font-size, .6875rem);font-weight:600;line-height:var(--gauzy-table-chip-line-height, .875rem);letter-spacing:0em;padding:var(--gauzy-table-chip-padding-y, .0625rem) var(--gauzy-table-chip-padding-x, .375rem)}.tags{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--gauzy-table-chip-gap, .1875rem);margin-top:var(--gauzy-table-chip-block-gap, .25rem)!important}.tags-right{display:flex;justify-content:flex-end;width:100%}.contacts-img{display:flex;justify-content:space-between}.avatar{width:60px;height:60px;border-radius:50%}\n"] }]
        }], ctorParameters: () => [{ type: i1.NbThemeService }, { type: i2.TranslateService }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }], layout: [{
                type: Input
            }] } });
//# sourceMappingURL=notes-with-tags.component.js.map