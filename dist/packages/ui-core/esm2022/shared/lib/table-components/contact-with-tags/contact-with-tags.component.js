import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NbThemeService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { PictureNameTagsComponent } from '../picture-name-tags/picture-name-tags.component';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@nebular/theme";
import * as i3 from "@ngx-translate/core";
import * as i4 from "../../components/avatar/avatar.component";
import * as i5 from "@angular/common";
export class ContactWithTagsComponent extends PictureNameTagsComponent {
    constructor(_router, themeService, translateService) {
        super(themeService, translateService);
        this._router = _router;
        this.themeService = themeService;
        this.translateService = translateService;
    }
    navigateToContact() {
        if (!this.rowData) {
            return;
        }
        this._router.navigate([`/pages/contacts/view/${this.rowData.id}`]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactWithTagsComponent, deps: [{ token: i1.Router }, { token: i2.NbThemeService }, { token: i3.TranslateService }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ContactWithTagsComponent, isStandalone: false, selector: "ga-contact-link-with-tags", usesInheritance: true, ngImport: i0, template: "<ngx-avatar\n  [src]=\"rowData?.imageUrl\"\n  [name]=\"rowData?.fullName ? rowData?.fullName : rowData?.name\"\n  (click)=\"navigateToContact()\"\n  class=\"report-table\"\n></ngx-avatar>\n@if (rowData?.isDefault) {\n  <nb-badge\n    class=\"color\"\n    position=\"centered\"\n    [style.background]=\"background(rowData?.color)\"\n    [style.color]=\"backgroundContrast(rowData?.brandColor)\"\n    text=\"Default\"\n  ></nb-badge>\n}\n@if (isTags) {\n  <div class=\"badges-block\">\n    @for (tag of (data | async)?.tags; track tag) {\n      <nb-badge\n        class=\"color\"\n        position=\"centered\"\n        [style.background]=\"background(tag?.color)\"\n        [style.color]=\"backgroundContrast(tag?.color)\"\n        [text]=\"tag?.name\"\n      ></nb-badge>\n    }\n  </div>\n}\n", styles: [".badges-block{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--gauzy-table-chip-gap, .1875rem);margin-top:var(--gauzy-table-chip-block-gap, .25rem)}.image-container{width:70px;height:63px;display:flex;justify-content:center}.color{position:static;display:inline-block;font-size:var(--gauzy-table-chip-font-size, .6875rem);font-weight:600;line-height:var(--gauzy-table-chip-line-height, .875rem);letter-spacing:0em;padding:var(--gauzy-table-chip-padding-y, .0625rem) var(--gauzy-table-chip-padding-x, .375rem)}.tags{display:flex;width:200px;flex-wrap:wrap;gap:var(--gauzy-table-chip-gap, .1875rem)}img{height:100%;max-width:70px;border-radius:50%}.tags-right{justify-content:flex-end}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "component", type: i2.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "component", type: i4.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "pipe", type: i5.AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactWithTagsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-contact-link-with-tags', standalone: false, template: "<ngx-avatar\n  [src]=\"rowData?.imageUrl\"\n  [name]=\"rowData?.fullName ? rowData?.fullName : rowData?.name\"\n  (click)=\"navigateToContact()\"\n  class=\"report-table\"\n></ngx-avatar>\n@if (rowData?.isDefault) {\n  <nb-badge\n    class=\"color\"\n    position=\"centered\"\n    [style.background]=\"background(rowData?.color)\"\n    [style.color]=\"backgroundContrast(rowData?.brandColor)\"\n    text=\"Default\"\n  ></nb-badge>\n}\n@if (isTags) {\n  <div class=\"badges-block\">\n    @for (tag of (data | async)?.tags; track tag) {\n      <nb-badge\n        class=\"color\"\n        position=\"centered\"\n        [style.background]=\"background(tag?.color)\"\n        [style.color]=\"backgroundContrast(tag?.color)\"\n        [text]=\"tag?.name\"\n      ></nb-badge>\n    }\n  </div>\n}\n", styles: [".badges-block{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--gauzy-table-chip-gap, .1875rem);margin-top:var(--gauzy-table-chip-block-gap, .25rem)}.image-container{width:70px;height:63px;display:flex;justify-content:center}.color{position:static;display:inline-block;font-size:var(--gauzy-table-chip-font-size, .6875rem);font-weight:600;line-height:var(--gauzy-table-chip-line-height, .875rem);letter-spacing:0em;padding:var(--gauzy-table-chip-padding-y, .0625rem) var(--gauzy-table-chip-padding-x, .375rem)}.tags{display:flex;width:200px;flex-wrap:wrap;gap:var(--gauzy-table-chip-gap, .1875rem)}img{height:100%;max-width:70px;border-radius:50%}.tags-right{justify-content:flex-end}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }, { type: i2.NbThemeService }, { type: i3.TranslateService }] });
//# sourceMappingURL=contact-with-tags.component.js.map