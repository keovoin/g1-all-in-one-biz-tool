import { OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import * as i0 from "@angular/core";
export interface InputOptions {
    value: string;
    label: string;
}
export interface PromptDialogOptions {
    inputType?: 'text' | 'email' | 'number' | 'checkbox' | 'radio' | 'password' | 'textarea' | 'select';
    title?: string;
    label?: string;
    okText?: string;
    cancelText?: string;
    placeholder?: string;
    options?: InputOptions[];
    /** Initial value of the input, e.g. the current name when renaming something. */
    value?: string;
}
export declare class PromptComponent implements OnInit {
    private readonly dialogRef;
    private readonly fb;
    data: PromptDialogOptions;
    form: UntypedFormGroup;
    showPassword: boolean;
    constructor(dialogRef: NbDialogRef<PromptComponent>, fb: UntypedFormBuilder);
    /**
     * Seeds the input with the caller's initial value, so an "edit" style prompt
     * (rename, ...) does not force the user to retype what is already there.
     */
    ngOnInit(): void;
    close(): void;
    submit(): void;
    getInputType(): "text" | "password";
    toggleShowPassword(): void;
    isInvalidControl(control: string): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<PromptComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PromptComponent, "ngx-prompt", never, { "data": { "alias": "data"; "required": false; }; }, {}, never, never, false, never>;
}
