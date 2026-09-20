import { EventEmitter, OnDestroy, OnInit } from "@angular/core";
import * as i0 from "@angular/core";
export declare class PhoneFormInputComponent implements OnInit, OnDestroy {
    onChange: any;
    onTouched: any;
    private _phoneNumber;
    set phoneNumber(val: string);
    get phoneNumber(): string;
    private _placeholder;
    get placeholder(): string;
    set placeholder(value: string);
    onChanged: EventEmitter<string>;
    constructor();
    /**
     *
     */
    ngOnInit(): void;
    /**
     *
     * @param value
     */
    writeValue(value: string): void;
    /**
     *
     * @param fn
     */
    registerOnChange(fn: (rating: number) => void): void;
    /**
     *
     * @param fn
     */
    registerOnTouched(fn: () => void): void;
    /**
     *
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PhoneFormInputComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PhoneFormInputComponent, "ngx-phone-form-input", never, { "phoneNumber": { "alias": "phoneNumber"; "required": false; }; "placeholder": { "alias": "placeholder"; "required": false; }; }, { "onChanged": "onChanged"; }, never, never, false, never>;
}
