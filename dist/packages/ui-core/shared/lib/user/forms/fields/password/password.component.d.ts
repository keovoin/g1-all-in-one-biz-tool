import { OnDestroy, AfterViewInit, OnChanges, ElementRef, EventEmitter } from '@angular/core';
import { AbstractControl, ControlValueAccessor } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { NbComponentSize } from '@nebular/theme';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class PasswordFormFieldComponent extends TranslationBaseComponent implements ControlValueAccessor, AfterViewInit, OnChanges, OnDestroy {
    readonly translateService: TranslateService;
    showPassword: boolean;
    private innerValue;
    onChange: (_: any) => void;
    onTouched: (_: any) => void;
    /**
     * Getter & Setter accessor including call the onchange callback
     */
    get value(): any;
    set value(v: any);
    _ctrl: AbstractControl;
    get ctrl(): AbstractControl;
    set ctrl(value: AbstractControl);
    _label: string;
    get label(): string;
    set label(value: string);
    _placeholder: string;
    get placeholder(): string;
    set placeholder(value: string);
    _icon: boolean;
    get icon(): boolean;
    set icon(value: boolean);
    _id: string;
    get id(): string;
    set id(value: string);
    _fieldSize: NbComponentSize;
    get fieldSize(): NbComponentSize;
    set fieldSize(value: NbComponentSize);
    _ngClass: any;
    get ngClass(): any;
    set ngClass(value: any);
    autocomplete: string;
    onInputChanged: EventEmitter<string>;
    inputRef: ElementRef;
    constructor(translateService: TranslateService);
    ngOnChanges(): void;
    ngAfterViewInit(): void;
    onInputChange(e: Event, value: any): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PasswordFormFieldComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PasswordFormFieldComponent, "ngx-password-form-field", never, { "ctrl": { "alias": "ctrl"; "required": false; }; "label": { "alias": "label"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; "icon": { "alias": "icon"; "required": false; }; "id": { "alias": "id"; "required": false; }; "fieldSize": { "alias": "fieldSize"; "required": false; }; "ngClass": { "alias": "ngClass"; "required": false; }; "autocomplete": { "alias": "autocomplete"; "required": false; }; }, { "onInputChanged": "onInputChanged"; }, never, [".invalid-feedback"], false, never>;
}
