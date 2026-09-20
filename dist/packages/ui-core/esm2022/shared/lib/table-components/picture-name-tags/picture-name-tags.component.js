import { Component, Input } from '@angular/core';
import { NotesWithTagsComponent } from '../notes-with-tags/notes-with-tags.component';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../components/avatar/avatar.component";
import * as i3 from "@angular/common";
export class PictureNameTagsComponent extends NotesWithTagsComponent {
    constructor() {
        super(...arguments);
        this.isTags = true;
    }
    /**
     * Returns the avatar data based on the properties of the current row data.
     *
     * @returns An object representing the avatar data.
     */
    get avatar() {
        const { id, employeeId, fullName, name, employee } = this.rowData;
        const avatarId = employeeId === id ? id : employeeId;
        return {
            ...this.rowData,
            id: avatarId || null,
            name: fullName || name || null,
            imageUrl: this.rowData.user?.image?.fullUrl || this.rowData.imageUrl,
            employee
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PictureNameTagsComponent, deps: null, target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: PictureNameTagsComponent, isStandalone: false, selector: "ga-picture-name-tags", inputs: { isTags: "isTags" }, usesInheritance: true, ngImport: i0, template: `
		<ngx-avatar
		  [src]="avatar?.imageUrl"
		  [name]="avatar?.name"
		  [id]="avatar?.id"
		  [employee]="avatar.employee"
		  class="report-table"
		></ngx-avatar>
		@if (rowData?.isDefault) {
		  <nb-badge
		    class="color default-badge"
		    position="centered"
		    [style.background]="background(rowData?.color)"
		    [style.color]="backgroundContrast(rowData?.brandColor)"
		    text="Default"
		  ></nb-badge>
		}
		@if (isTags) {
		  <div class="badges-block">
		    @for (tag of (data | async)?.tags; track tag) {
		      <nb-badge
		        class="color"
		        position="centered"
		        [style.background]="background(tag?.color)"
		        [style.color]="backgroundContrast(tag?.color)"
		        [text]="tag?.name"
		      ></nb-badge>
		    }
		  </div>
		}
		`, isInline: true, styles: [".badges-block{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--gauzy-table-chip-gap, .1875rem);margin-top:var(--gauzy-table-chip-block-gap, .25rem)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".image-container{width:70px;height:63px;display:flex;justify-content:center}.color{position:static;display:inline-block;font-size:var(--gauzy-table-chip-font-size, .6875rem);font-weight:600;line-height:var(--gauzy-table-chip-line-height, .875rem);letter-spacing:0em;padding:var(--gauzy-table-chip-padding-y, .0625rem) var(--gauzy-table-chip-padding-x, .375rem)}.default-badge{margin-top:var(--gauzy-table-chip-gap, .1875rem);margin-right:var(--gauzy-table-chip-gap, .1875rem)}.tags{display:flex;width:200px;flex-wrap:wrap}img{height:100%;max-width:70px;border-radius:50%}.tags-right{justify-content:flex-end}\n"], dependencies: [{ kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "component", type: i2.AvatarComponent, selector: "ngx-avatar", inputs: ["size", "src", "appendCaption", "caption", "id", "isOption", "employee", "value", "name"] }, { kind: "pipe", type: i3.AsyncPipe, name: "async" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PictureNameTagsComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-picture-name-tags', template: `
		<ngx-avatar
		  [src]="avatar?.imageUrl"
		  [name]="avatar?.name"
		  [id]="avatar?.id"
		  [employee]="avatar.employee"
		  class="report-table"
		></ngx-avatar>
		@if (rowData?.isDefault) {
		  <nb-badge
		    class="color default-badge"
		    position="centered"
		    [style.background]="background(rowData?.color)"
		    [style.color]="backgroundContrast(rowData?.brandColor)"
		    text="Default"
		  ></nb-badge>
		}
		@if (isTags) {
		  <div class="badges-block">
		    @for (tag of (data | async)?.tags; track tag) {
		      <nb-badge
		        class="color"
		        position="centered"
		        [style.background]="background(tag?.color)"
		        [style.color]="backgroundContrast(tag?.color)"
		        [text]="tag?.name"
		      ></nb-badge>
		    }
		  </div>
		}
		`, standalone: false, styles: [".badges-block{display:flex;flex-wrap:wrap;align-items:flex-start;gap:var(--gauzy-table-chip-gap, .1875rem);margin-top:var(--gauzy-table-chip-block-gap, .25rem)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n", ".image-container{width:70px;height:63px;display:flex;justify-content:center}.color{position:static;display:inline-block;font-size:var(--gauzy-table-chip-font-size, .6875rem);font-weight:600;line-height:var(--gauzy-table-chip-line-height, .875rem);letter-spacing:0em;padding:var(--gauzy-table-chip-padding-y, .0625rem) var(--gauzy-table-chip-padding-x, .375rem)}.default-badge{margin-top:var(--gauzy-table-chip-gap, .1875rem);margin-right:var(--gauzy-table-chip-gap, .1875rem)}.tags{display:flex;width:200px;flex-wrap:wrap}img{height:100%;max-width:70px;border-radius:50%}.tags-right{justify-content:flex-end}\n"] }]
        }], propDecorators: { isTags: [{
                type: Input
            }] } });
//# sourceMappingURL=picture-name-tags.component.js.map