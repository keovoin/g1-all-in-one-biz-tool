import { Component, Input } from '@angular/core';
import { RolesEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
import * as i1 from "@nebular/theme";
import * as i2 from "../../pipes/replace.pipe";
export class RoleComponent {
    get status() {
        return this._status;
    }
    set status(value) {
        this._status = value;
    }
    get role() {
        return this._role;
    }
    set role(value) {
        this._role = value;
    }
    constructor() { }
    ngOnInit() {
        this.role = this.value;
        switch (this.role.name) {
            case RolesEnum.ADMIN:
                this.status = 'primary';
                break;
            case RolesEnum.CANDIDATE:
                this.status = 'control';
                break;
            case RolesEnum.SUPER_ADMIN:
                this.status = 'success';
                break;
            case RolesEnum.DATA_ENTRY:
                this.status = 'info';
                break;
            case RolesEnum.INTERVIEWER:
                this.status = 'primary';
                break;
            case RolesEnum.MANAGER:
                this.status = 'danger';
                break;
            case RolesEnum.VIEWER:
                this.status = 'warning';
                break;
            case RolesEnum.EMPLOYEE:
                this.status = 'info';
                break;
            default:
                break;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: RoleComponent, isStandalone: false, selector: "gauzy-role", inputs: { value: "value", status: "status", role: "role" }, ngImport: i0, template: "<div class=\"badge-container\">\n  @if (role) {\n    <nb-badge\n      position=\"left\"\n      [status]=\"status\"\n      [text]=\"role?.name | replace: '_':' '\"\n    ></nb-badge>\n  }\n</div>", styles: [".badge-container nb-badge{position:relative;border-radius:4px;font-size:12px;font-weight:600;line-height:15px;letter-spacing:0em;text-align:left}\n"], dependencies: [{ kind: "component", type: i1.NbBadgeComponent, selector: "nb-badge", inputs: ["text", "position", "dotMode", "status"] }, { kind: "pipe", type: i2.ReplacePipe, name: "replace" }] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: RoleComponent, decorators: [{
            type: Component,
            args: [{ selector: 'gauzy-role', standalone: false, template: "<div class=\"badge-container\">\n  @if (role) {\n    <nb-badge\n      position=\"left\"\n      [status]=\"status\"\n      [text]=\"role?.name | replace: '_':' '\"\n    ></nb-badge>\n  }\n</div>", styles: [".badge-container nb-badge{position:relative;border-radius:4px;font-size:12px;font-weight:600;line-height:15px;letter-spacing:0em;text-align:left}\n"] }]
        }], ctorParameters: () => [], propDecorators: { value: [{
                type: Input
            }], status: [{
                type: Input
            }], role: [{
                type: Input
            }] } });
//# sourceMappingURL=role.component.js.map