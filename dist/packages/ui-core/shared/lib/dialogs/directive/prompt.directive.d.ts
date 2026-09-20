import { EventEmitter, OnDestroy } from '@angular/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { PromptDialogOptions } from '../prompt/prompt.component';
import * as i0 from "@angular/core";
export declare class PromptDirective extends TranslationBaseComponent implements OnDestroy {
    _label: string;
    get label(): string;
    set label(value: string);
    _title: string;
    get title(): string;
    set title(value: string);
    _okText: string;
    get okText(): string;
    set okText(value: string);
    _cancelText: string;
    get cancelText(): string;
    set cancelText(value: string);
    _placeholder: string;
    get placeholder(): string;
    set placeholder(value: string);
    _inputType: PromptDialogOptions['inputType'];
    get inputType(): PromptDialogOptions['inputType'];
    set inputType(value: PromptDialogOptions['inputType']);
    callback: EventEmitter<string | string[]>;
    private readonly dialogService;
    constructor();
    /**
     * Handles the click event for the onClick function.
     *
     * @param {any} $event - The click event object.
     * @return {void} This function does not return anything.
     */
    onClick($event: any): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PromptDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<PromptDirective, "[ngxPromptDialog]", never, { "label": { "alias": "label"; "required": false; }; "title": { "alias": "title"; "required": false; }; "okText": { "alias": "okText"; "required": false; }; "cancelText": { "alias": "cancelText"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "inputType": { "alias": "inputType"; "required": false; }; }, { "callback": "callback"; }, never, never, true, never>;
}
