import { __decorate, __metadata } from "tslib";
import { Directive, Input, Output, HostListener, EventEmitter, inject } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { PromptComponent } from '../prompt/prompt.component';
import * as i0 from "@angular/core";
let PromptDirective = class PromptDirective extends TranslationBaseComponent {
    get label() {
        return this._label;
    }
    set label(value) {
        this._label = value;
    }
    get title() {
        return this._title;
    }
    set title(value) {
        this._title = value;
    }
    get okText() {
        return this._okText;
    }
    set okText(value) {
        this._okText = value;
    }
    get cancelText() {
        return this._cancelText;
    }
    set cancelText(value) {
        this._cancelText = value;
    }
    get placeholder() {
        return this._placeholder;
    }
    set placeholder(value) {
        this._placeholder = value;
    }
    get inputType() {
        return this._inputType;
    }
    set inputType(value) {
        this._inputType = value;
    }
    constructor() {
        super(inject(TranslateService));
        /*
         * Getter & Setter for okText
         */
        this._okText = this.getTranslation('BUTTONS.OK');
        /*
         * Getter & Setter for cancelText
         */
        this._cancelText = this.getTranslation('BUTTONS.CANCEL');
        /*
         * Getter & Setter for inputType
         */
        this._inputType = 'text';
        this.callback = new EventEmitter();
        this.dialogService = inject(NbDialogService);
    }
    /**
     * Handles the click event for the onClick function.
     *
     * @param {any} $event - The click event object.
     * @return {void} This function does not return anything.
     */
    onClick($event) {
        $event.stopPropagation();
        const { cancelText, inputType, label, okText, placeholder, title } = this;
        const dialogRef = this.dialogService.open(PromptComponent, {
            dialogClass: 'modal-lg',
            context: {
                data: {
                    cancelText,
                    inputType,
                    label,
                    okText,
                    placeholder,
                    title
                }
            }
        });
        dialogRef.onClose.pipe(untilDestroyed(this)).subscribe((confirm) => {
            if (confirm) {
                this.callback.emit(confirm);
            }
        });
    }
    ngOnDestroy() { }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PromptDirective, deps: [], target: i0.ɵɵFactoryTarget.Directive }); }
    static { this.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "21.0.7", type: PromptDirective, isStandalone: true, selector: "[ngxPromptDialog]", inputs: { label: "label", title: "title", okText: "okText", cancelText: "cancelText", placeholder: "placeholder", inputType: "inputType" }, outputs: { callback: "callback" }, host: { listeners: { "click": "onClick($event)" } }, usesInheritance: true, ngImport: i0 }); }
};
PromptDirective = __decorate([
    UntilDestroy({ checkProperties: true }),
    __metadata("design:paramtypes", [])
], PromptDirective);
export { PromptDirective };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: PromptDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[ngxPromptDialog]',
                    standalone: true
                }]
        }], ctorParameters: () => [], propDecorators: { label: [{
                type: Input
            }], title: [{
                type: Input
            }], okText: [{
                type: Input
            }], cancelText: [{
                type: Input
            }], placeholder: [{
                type: Input
            }], inputType: [{
                type: Input
            }], callback: [{
                type: Output
            }], onClick: [{
                type: HostListener,
                args: ['click', ['$event']]
            }] } });
//# sourceMappingURL=prompt.directive.js.map