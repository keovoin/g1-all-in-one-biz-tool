import { Component } from '@angular/core';
import { DefaultFilter } from 'angular2-smart-table';
import { faCheck, faBan, faTimes } from '@fortawesome/free-solid-svg-icons';
import * as i0 from "@angular/core";
import * as i1 from "@fortawesome/angular-fontawesome";
export class ToggleFilterComponent extends DefaultFilter {
    constructor() {
        super();
        this.faCheck = faCheck;
        this.faBan = faBan;
        this.faTimes = faTimes;
        this._isChecked = false;
    }
    get isChecked() {
        return this._isChecked;
    }
    set isChecked(value) {
        this._isChecked = value;
    }
    onChange() {
        switch (this.choice) {
            case 'accept':
                this.isChecked = true;
                break;
            case 'deny':
                this.isChecked = false;
                break;
            default:
                this.isChecked = null;
        }
        this.column.filterFunction(this.isChecked, this.column.id);
    }
    ngOnChanges(changes) { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ToggleFilterComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: ToggleFilterComponent, isStandalone: false, selector: "ga-toggle-filter", usesInheritance: true, usesOnChanges: true, ngImport: i0, template: "<div class=\"container\">\n\t<div class=\"btn-grp\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tclass=\"check\"\n\t\t\t[class.on]=\"choice === 'accept'\"\n\t\t\t[class.off]=\"choice !== 'accept'\"\n\t\t\ttype=\"button\"\n\t\t\t(click)=\"choice = 'accept'; onChange()\"\n\t\t>\n\t\t\t<fa-icon [icon]=\"faCheck\"></fa-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tclass=\"na\"\n\t\t\t[class.on]=\"!(choice?.length > 0)\"\n\t\t\t[class.off]=\"choice?.length > 0\"\n\t\t\t(click)=\"choice = ''; onChange()\"\n\t\t>\n\t\t\t<fa-icon [icon]=\"faBan\"></fa-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tclass=\"deny\"\n\t\t\t[class.on]=\"choice === 'deny'\"\n\t\t\t[class.off]=\"choice !== 'deny'\"\n\t\t\t(click)=\"choice = 'deny'; onChange()\"\n\t\t>\n\t\t\t<fa-icon [icon]=\"faTimes\"></fa-icon>\n\t\t</button>\n\t</div>\n</div>\n", styles: [".container{text-align:center;width:auto}.btn-grp:before{position:absolute;content:\"\";top:0;left:25px;height:32px;background-color:var(--gauzy-sidebar-background-3);border-radius:var(--button-rectangle-border-radius);z-index:-1}button,fa-icon{display:flex;align-items:center;justify-content:center}fa-icon,.check,.na,.deny{height:20px;width:20px}.btn-grp{position:relative;display:flex;gap:6px;background-color:var(--gauzy-sidebar-background-3);border-radius:var(--button-rectangle-border-radius);padding:6px;box-shadow:var(--gauzy-shadow) inset}.check{border-radius:var(--border-radius);border:none}.check.on{box-shadow:var(--gauzy-shadow);background-color:var(--color-success-default);color:#fff}.check.off{color:var(--gauzy-text-color-2);background:transparent}.na{border-radius:var(--border-radius);border:none}.na.on{background-color:var(--gauzy-card-1);box-shadow:var(--gauzy-shadow)}.na.off{color:var(--gauzy-text-color-2);background:transparent}.deny{border-radius:var(--border-radius);border:none}.deny.on{background-color:var(--color-danger-default);box-shadow:var(--gauzy-shadow);color:#fff}.deny.off{color:var(--gauzy-text-color-2);background:transparent}\n"], dependencies: [{ kind: "component", type: i1.FaIconComponent, selector: "fa-icon", inputs: ["icon", "title", "animation", "mask", "flip", "size", "pull", "border", "inverse", "symbol", "rotate", "fixedWidth", "transform", "a11yRole"], outputs: ["iconChange", "titleChange", "animationChange", "maskChange", "flipChange", "sizeChange", "pullChange", "borderChange", "inverseChange", "symbolChange", "rotateChange", "fixedWidthChange", "transformChange", "a11yRoleChange"] }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: ToggleFilterComponent, decorators: [{
            type: Component,
            args: [{ selector: 'ga-toggle-filter', standalone: false, template: "<div class=\"container\">\n\t<div class=\"btn-grp\">\n\t\t<button\n\t\t\tnbButton\n\t\t\tclass=\"check\"\n\t\t\t[class.on]=\"choice === 'accept'\"\n\t\t\t[class.off]=\"choice !== 'accept'\"\n\t\t\ttype=\"button\"\n\t\t\t(click)=\"choice = 'accept'; onChange()\"\n\t\t>\n\t\t\t<fa-icon [icon]=\"faCheck\"></fa-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tclass=\"na\"\n\t\t\t[class.on]=\"!(choice?.length > 0)\"\n\t\t\t[class.off]=\"choice?.length > 0\"\n\t\t\t(click)=\"choice = ''; onChange()\"\n\t\t>\n\t\t\t<fa-icon [icon]=\"faBan\"></fa-icon>\n\t\t</button>\n\t\t<button\n\t\t\tnbButton\n\t\t\tclass=\"deny\"\n\t\t\t[class.on]=\"choice === 'deny'\"\n\t\t\t[class.off]=\"choice !== 'deny'\"\n\t\t\t(click)=\"choice = 'deny'; onChange()\"\n\t\t>\n\t\t\t<fa-icon [icon]=\"faTimes\"></fa-icon>\n\t\t</button>\n\t</div>\n</div>\n", styles: [".container{text-align:center;width:auto}.btn-grp:before{position:absolute;content:\"\";top:0;left:25px;height:32px;background-color:var(--gauzy-sidebar-background-3);border-radius:var(--button-rectangle-border-radius);z-index:-1}button,fa-icon{display:flex;align-items:center;justify-content:center}fa-icon,.check,.na,.deny{height:20px;width:20px}.btn-grp{position:relative;display:flex;gap:6px;background-color:var(--gauzy-sidebar-background-3);border-radius:var(--button-rectangle-border-radius);padding:6px;box-shadow:var(--gauzy-shadow) inset}.check{border-radius:var(--border-radius);border:none}.check.on{box-shadow:var(--gauzy-shadow);background-color:var(--color-success-default);color:#fff}.check.off{color:var(--gauzy-text-color-2);background:transparent}.na{border-radius:var(--border-radius);border:none}.na.on{background-color:var(--gauzy-card-1);box-shadow:var(--gauzy-shadow)}.na.off{color:var(--gauzy-text-color-2);background:transparent}.deny{border-radius:var(--border-radius);border:none}.deny.on{background-color:var(--color-danger-default);box-shadow:var(--gauzy-shadow);color:#fff}.deny.off{color:var(--gauzy-text-color-2);background:transparent}\n"] }]
        }], ctorParameters: () => [] });
//# sourceMappingURL=toggle-filter.component.js.map