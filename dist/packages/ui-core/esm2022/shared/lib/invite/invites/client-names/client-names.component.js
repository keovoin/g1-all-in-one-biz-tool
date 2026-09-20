import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ClientNamesComponent {
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ClientNamesComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: ClientNamesComponent, isStandalone: false, selector: "ng-component", inputs: { rowData: "rowData" }, ngImport: i0, template: `
		<div>
		  @for (client of rowData.clientNames; track client) {
		    <a
		      class="link-text mr-2 mb-2"
		      >
		      <span>{{ client.substr(0, 2).toUpperCase() }}</span>
		      {{ client }}
		    </a>
		  }
		</div>
		`, isInline: true, styles: [":host .contact-links-container{width:100%}:host .contact-links-container .inner-wrapper{display:flex;align-items:center}[dir=ltr] :host .contact-links-container .inner-wrapper{padding:5px 14px 5px 7px}[dir=rtl] :host .contact-links-container .inner-wrapper{padding:5px 7px 5px 14px}:host .contact-links-container .inner-wrapper{gap:8px;background:#24bdff1a;border-radius:var(--button-rectangle-border-radius);overflow:hidden;width:fit-content}:host .contact-links-container .inner-wrapper .names-wrapper{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px}:host .contact-links-container .inner-wrapper .link-text{cursor:pointer;text-decoration:none;font-size:12px;font-style:normal;font-weight:400;line-height:15px;letter-spacing:0em;white-space:nowrap;width:100%;text-overflow:ellipsis;color:var(--text-primary-color)}:host .contact-links-container .inner-wrapper .link-text:hover{text-decoration:underline}:host .contact-links-container .inner-wrapper .avatar{display:flex}:host .contact-links-container .inner-wrapper .avatar img{width:18px;height:18px;object-fit:cover;border-radius:var(--button-rectangle-border-radius)}:host .contact-links-container .inner-wrapper .prefix{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:4px 5px;gap:10px;width:18px;height:18px;background:#7e7e8f;border-radius:var(--button-rectangle-border-radius);flex:none;order:0;flex-grow:0;font-size:8px;font-weight:600;line-height:10px;letter-spacing:0em;text-align:center;color:#fff}:host .client-badge{display:inline-block;border-radius:.25rem;padding:.25rem .4rem;background-color:var(--color-success-default)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ClientNamesComponent, decorators: [{
            type: Component,
            args: [{ template: `
		<div>
		  @for (client of rowData.clientNames; track client) {
		    <a
		      class="link-text mr-2 mb-2"
		      >
		      <span>{{ client.substr(0, 2).toUpperCase() }}</span>
		      {{ client }}
		    </a>
		  }
		</div>
		`, standalone: false, styles: [":host .contact-links-container{width:100%}:host .contact-links-container .inner-wrapper{display:flex;align-items:center}[dir=ltr] :host .contact-links-container .inner-wrapper{padding:5px 14px 5px 7px}[dir=rtl] :host .contact-links-container .inner-wrapper{padding:5px 7px 5px 14px}:host .contact-links-container .inner-wrapper{gap:8px;background:#24bdff1a;border-radius:var(--button-rectangle-border-radius);overflow:hidden;width:fit-content}:host .contact-links-container .inner-wrapper .names-wrapper{overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:110px}:host .contact-links-container .inner-wrapper .link-text{cursor:pointer;text-decoration:none;font-size:12px;font-style:normal;font-weight:400;line-height:15px;letter-spacing:0em;white-space:nowrap;width:100%;text-overflow:ellipsis;color:var(--text-primary-color)}:host .contact-links-container .inner-wrapper .link-text:hover{text-decoration:underline}:host .contact-links-container .inner-wrapper .avatar{display:flex}:host .contact-links-container .inner-wrapper .avatar img{width:18px;height:18px;object-fit:cover;border-radius:var(--button-rectangle-border-radius)}:host .contact-links-container .inner-wrapper .prefix{display:flex;flex-direction:column;justify-content:center;align-items:center;padding:4px 5px;gap:10px;width:18px;height:18px;background:#7e7e8f;border-radius:var(--button-rectangle-border-radius);flex:none;order:0;flex-grow:0;font-size:8px;font-weight:600;line-height:10px;letter-spacing:0em;text-align:center;color:#fff}:host .client-badge{display:inline-block;border-radius:.25rem;padding:.25rem .4rem;background-color:var(--color-success-default)}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { rowData: [{
                type: Input
            }] } });
//# sourceMappingURL=client-names.component.js.map