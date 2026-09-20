import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@nebular/theme";
import * as i3 from "../../directives/img.directive";
export class ContactLinksComponent {
    constructor(_router) {
        this._router = _router;
    }
    /**
     * Navigates to the contact view page for the current value.
     *
     * @return {void} This function does not return anything.
     */
    navigateToContact() {
        if (!this.value) {
            return;
        }
        this._router.navigate([`/pages/contacts/view`, this.value.id]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactLinksComponent, deps: [{ token: i1.Router }], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ContactLinksComponent, isStandalone: false, selector: "ngx-contact-links", inputs: { rowData: "rowData", value: "value" }, ngImport: i0, template: `
		<div class="contact-links-container">
		  @if (value?.name) {
		    <div [nbTooltip]="value.name" (click)="navigateToContact()" class="inner-wrapper">
		      @if (!value.imageUrl) {
		        <div class="prefix">
		          {{ value.name.substr(0, 1).toUpperCase() }}
		        </div>
		      }
		      @if (value.imageUrl) {
		        <div class="avatar">
		          <img [src]="value?.imageUrl" />
		        </div>
		      }
		      <div class="names-wrapper">
		        <a class="link-text">{{ value.name }}</a>
		      </div>
		    </div>
		  }
		</div>
		`, isInline: true, styles: [":host .contact-links-container{width:100%}:host .contact-links-container .inner-wrapper{display:flex;align-items:center}[dir=ltr] :host .contact-links-container .inner-wrapper{padding:5px 14px 5px 7px}[dir=rtl] :host .contact-links-container .inner-wrapper{padding:5px 7px 5px 14px}:host .contact-links-container .inner-wrapper{gap:8px;background:#24bdff1a;border-radius:var(--button-rectangle-border-radius);overflow:hidden;width:fit-content}:host .contact-links-container .inner-wrapper .names-wrapper{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px}:host .contact-links-container .inner-wrapper .link-text{cursor:pointer;text-decoration:none;font-size:12px;font-style:normal;font-weight:400;line-height:15px;letter-spacing:0em;white-space:nowrap;width:100%;text-overflow:ellipsis;color:var(--text-primary-color)}:host .contact-links-container .inner-wrapper .link-text:hover{text-decoration:underline}:host .contact-links-container .inner-wrapper .avatar{display:flex}:host .contact-links-container .inner-wrapper .avatar img{width:18px;height:18px;object-fit:cover;border-radius:var(--button-rectangle-border-radius)}:host .contact-links-container .inner-wrapper .prefix{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:4px 5px;gap:10px;width:18px;height:18px;background:#7e7e8f;border-radius:var(--button-rectangle-border-radius);flex:none;order:0;flex-grow:0;font-size:8px;font-weight:600;line-height:10px;letter-spacing:0em;text-align:center;color:#fff}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i2.NbTooltipDirective, selector: "[nbTooltip]", inputs: ["nbTooltip", "nbTooltipPlacement", "nbTooltipAdjustment", "nbTooltipClass", "nbTooltipIcon", "nbTooltipStatus", "nbTooltipTrigger", "nbTooltipOffset", "nbTooltipDisabled"], outputs: ["nbTooltipShowStateChange"], exportAs: ["nbTooltip"] }, { kind: "directive", type: i3.ImgDirective, selector: "img", inputs: ["type", "skipDefaultImage", "enableFadeIn"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ContactLinksComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ngx-contact-links', template: `
		<div class="contact-links-container">
		  @if (value?.name) {
		    <div [nbTooltip]="value.name" (click)="navigateToContact()" class="inner-wrapper">
		      @if (!value.imageUrl) {
		        <div class="prefix">
		          {{ value.name.substr(0, 1).toUpperCase() }}
		        </div>
		      }
		      @if (value.imageUrl) {
		        <div class="avatar">
		          <img [src]="value?.imageUrl" />
		        </div>
		      }
		      <div class="names-wrapper">
		        <a class="link-text">{{ value.name }}</a>
		      </div>
		    </div>
		  }
		</div>
		`, standalone: false, styles: [":host .contact-links-container{width:100%}:host .contact-links-container .inner-wrapper{display:flex;align-items:center}[dir=ltr] :host .contact-links-container .inner-wrapper{padding:5px 14px 5px 7px}[dir=rtl] :host .contact-links-container .inner-wrapper{padding:5px 7px 5px 14px}:host .contact-links-container .inner-wrapper{gap:8px;background:#24bdff1a;border-radius:var(--button-rectangle-border-radius);overflow:hidden;width:fit-content}:host .contact-links-container .inner-wrapper .names-wrapper{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px}:host .contact-links-container .inner-wrapper .link-text{cursor:pointer;text-decoration:none;font-size:12px;font-style:normal;font-weight:400;line-height:15px;letter-spacing:0em;white-space:nowrap;width:100%;text-overflow:ellipsis;color:var(--text-primary-color)}:host .contact-links-container .inner-wrapper .link-text:hover{text-decoration:underline}:host .contact-links-container .inner-wrapper .avatar{display:flex}:host .contact-links-container .inner-wrapper .avatar img{width:18px;height:18px;object-fit:cover;border-radius:var(--button-rectangle-border-radius)}:host .contact-links-container .inner-wrapper .prefix{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:4px 5px;gap:10px;width:18px;height:18px;background:#7e7e8f;border-radius:var(--button-rectangle-border-radius);flex:none;order:0;flex-grow:0;font-size:8px;font-weight:600;line-height:10px;letter-spacing:0em;text-align:center;color:#fff}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], ctorParameters: () => [{ type: i1.Router }], propDecorators: { rowData: [{
                type: Input
            }], value: [{
                type: Input
            }] } });
//# sourceMappingURL=contact-links.component.js.map