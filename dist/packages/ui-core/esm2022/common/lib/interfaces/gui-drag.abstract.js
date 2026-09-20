import { Component, Input, TemplateRef } from '@angular/core';
import * as i0 from "@angular/core";
export class GuiDrag {
    constructor() {
        this._collapsed = false;
        this._move = false;
        this._hide = false;
        this._positions = [];
    }
    onClickSetting(event) { }
    set templateRef(value) {
        this._templateRef = value;
    }
    get templateRef() {
        return this._templateRef;
    }
    set title(value) {
        this._title = value;
    }
    get title() {
        return this._title;
    }
    get position() {
        return this._position;
    }
    set position(value) {
        if (this._positions.length === 0)
            this._positions.push(value);
        this._position = this._positions[0];
    }
    get isExpand() {
        return !this._collapsed;
    }
    set isExpand(value) {
        this._collapsed = !value;
    }
    get isCollapse() {
        return this._collapsed;
    }
    set isCollapse(value) {
        this._collapsed = value;
    }
    get move() {
        return this._move;
    }
    set move(value) {
        this._move = value;
    }
    get hide() {
        return this._hide;
    }
    set hide(value) {
        this._hide = value;
    }
    toObject() {
        return {
            position: this.position,
            isCollapse: this.isCollapse,
            isExpand: this.isExpand,
            hide: this.hide,
            title: this.title
        };
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GuiDrag, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "14.0.0", version: "21.0.7", type: GuiDrag, isStandalone: false, selector: "ng-component", inputs: { templateRef: "templateRef", position: "position", isExpand: "isExpand", isCollapse: "isCollapse" }, ngImport: i0, template: '', isInline: true }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: GuiDrag, decorators: [{
            type: Component,
            args: [{
                    template: '',
                    standalone: false
                }]
        }], ctorParameters: () => [], propDecorators: { templateRef: [{
                type: Input
            }], position: [{
                type: Input
            }], isExpand: [{
                type: Input
            }], isCollapse: [{
                type: Input
            }] } });
//# sourceMappingURL=gui-drag.abstract.js.map