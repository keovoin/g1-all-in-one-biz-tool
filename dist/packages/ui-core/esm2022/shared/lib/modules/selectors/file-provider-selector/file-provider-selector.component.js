import { __decorate } from "tslib";
import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { FileStorageProviderEnum } from '@gauzy/contracts';
import * as i0 from "@angular/core";
import * as i1 from "@angular/forms";
import * as i2 from "@nebular/theme";
import * as i3 from "@angular/common";
import * as i4 from "@ngx-translate/core";
let FileProviderSelectorComponent = class FileProviderSelectorComponent {
    constructor() {
        this.fileStorageProviders = [];
        this.onChange = () => { };
        this.onTouched = () => { };
        this.onSelectionChanged = new EventEmitter();
    }
    set provider(val) {
        this._provider = val;
        this.onChange(val);
        this.onTouched(val);
    }
    get provider() {
        return this._provider;
    }
    ngOnInit() {
        this.fileStorageProviders = Object.keys(FileStorageProviderEnum).map((label) => ({
            label,
            value: FileStorageProviderEnum[label]
        }));
    }
    /**
     *
     * @param value
     */
    writeValue(value) {
        if (value) {
            this._provider = value;
        }
    }
    /**
     *
     * @param fn
     */
    registerOnChange(fn) {
        this.onChange = fn;
    }
    /**
     *
     * @param fn
     */
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    /**
     * On changed file storage provider
     *
     * @param provider
     */
    onSelectionChange(provider) {
        if (provider) {
            this.onSelectionChanged.emit(provider);
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileProviderSelectorComponent, deps: [], target: i0.ɵɵFactoryTarget.Component }); }
    static { this.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "17.0.0", version: "21.0.7", type: FileProviderSelectorComponent, isStandalone: false, selector: "file-provider-selector", inputs: { provider: "provider" }, outputs: { onSelectionChanged: "onSelectionChanged" }, providers: [
            {
                provide: NG_VALUE_ACCESSOR,
                useExisting: forwardRef(() => FileProviderSelectorComponent),
                multi: true
            }
        ], ngImport: i0, template: "@if (fileStorageProviders.length > 0) {\n  <div class=\"form-group\">\n    <label class=\"label\">\n      {{ 'SETTINGS_FILE_STORAGE.FILE_PROVIDER' | translate }}\n    </label>\n    <nb-select\n      class=\"d-block\"\n      size=\"medium\"\n      [(ngModel)]=\"provider\"\n      (selectedChange)=\"onSelectionChange($event)\"\n      >\n      @for (providerName of fileStorageProviders; track providerName) {\n        <nb-option\n          [value]=\"providerName.value | uppercase\"\n          >\n          {{ providerName?.label | titlecase }}\n        </nb-option>\n      }\n    </nb-select>\n  </div>\n}\n", styles: ["@charset \"UTF-8\";:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2);display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}:host .d-block{width:10rem}:host .label{font-size:11px;font-weight:600;line-height:13px;letter-spacing:-.01em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"], dependencies: [{ kind: "directive", type: i1.NgControlStatus, selector: "[formControlName],[ngModel],[formControl]" }, { kind: "directive", type: i1.NgModel, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: ["name", "disabled", "ngModel", "ngModelOptions"], outputs: ["ngModelChange"], exportAs: ["ngModel"] }, { kind: "component", type: i2.NbSelectComponent, selector: "nb-select", inputs: ["size", "status", "shape", "appearance", "optionsListClass", "optionsPanelClass", "optionsWidth", "outline", "filled", "hero", "disabled", "fullWidth", "placeholder", "compareWith", "selected", "multiple", "optionsOverlayOffset", "scrollStrategy"], outputs: ["selectedChange"] }, { kind: "component", type: i2.NbOptionComponent, selector: "nb-option", inputs: ["value", "disabled"], outputs: ["selectionChange"] }, { kind: "pipe", type: i3.UpperCasePipe, name: "uppercase" }, { kind: "pipe", type: i3.TitleCasePipe, name: "titlecase" }, { kind: "pipe", type: i4.TranslatePipe, name: "translate" }] }); }
};
FileProviderSelectorComponent = __decorate([
    UntilDestroy({ checkProperties: true })
], FileProviderSelectorComponent);
export { FileProviderSelectorComponent };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: FileProviderSelectorComponent, decorators: [{
            type: Component,
            args: [{ selector: 'file-provider-selector', providers: [
                        {
                            provide: NG_VALUE_ACCESSOR,
                            useExisting: forwardRef(() => FileProviderSelectorComponent),
                            multi: true
                        }
                    ], standalone: false, template: "@if (fileStorageProviders.length > 0) {\n  <div class=\"form-group\">\n    <label class=\"label\">\n      {{ 'SETTINGS_FILE_STORAGE.FILE_PROVIDER' | translate }}\n    </label>\n    <nb-select\n      class=\"d-block\"\n      size=\"medium\"\n      [(ngModel)]=\"provider\"\n      (selectedChange)=\"onSelectionChange($event)\"\n      >\n      @for (providerName of fileStorageProviders; track providerName) {\n        <nb-option\n          [value]=\"providerName.value | uppercase\"\n          >\n          {{ providerName?.label | titlecase }}\n        </nb-option>\n      }\n    </nb-select>\n  </div>\n}\n", styles: ["@charset \"UTF-8\";:host ::ng-deep nb-select.shape-rectangle .select-button{border-radius:var(--gauzy-radius-sm);box-shadow:inset 0 0 0 1px var(--gauzy-overlay-border-color, rgba(126, 126, 143, .18));min-height:calc(var(--select-medium-text-line-height) + .4375rem * 2);display:flex;align-items:center;border:none}:host ::ng-deep nb-select.size-medium .select-button.placeholder{font-size:var(--select-medium-text-font-size)}:host ::ng-deep nb-select.appearance-outline.size-medium .select-button{border:none}:host ::ng-deep nb-select button span{display:block;overflow-x:hidden;text-overflow:ellipsis}:host .d-block{width:10rem}:host .label{font-size:11px;font-weight:600;line-height:13px;letter-spacing:-.01em}\n/**\n * @license\n * Copyright Akveo. All Rights Reserved.\n * Licensed under the MIT License. See License.txt in the project root for license information.\n */\n"] }]
        }], propDecorators: { provider: [{
                type: Input
            }], onSelectionChanged: [{
                type: Output
            }] } });
//# sourceMappingURL=file-provider-selector.component.js.map