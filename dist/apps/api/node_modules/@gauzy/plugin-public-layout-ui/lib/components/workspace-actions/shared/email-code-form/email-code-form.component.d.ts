import { EventEmitter, OnInit } from '@angular/core';
import { UntypedFormGroup, AbstractControl } from '@angular/forms';
import * as i0 from "@angular/core";
/**
 * Shared component for email and code input form.
 * Used across workspace-create, workspace-signin, and workspace-find components.
 */
export declare class EmailCodeFormComponent implements OnInit {
    form: UntypedFormGroup;
    isLoading: boolean;
    isCodeSent: boolean;
    isCodeResent: boolean;
    countdown: number;
    submitButtonText: string;
    sendCodeButtonText: string;
    showForgotEmailLink: boolean;
    forgotEmailLink: string;
    showEditEmailButton: boolean;
    descriptionText: string;
    successSentCodeTitle: string;
    successSentCodeSubTitle: string;
    readonly sendCode: EventEmitter<void>;
    readonly resendCode: EventEmitter<void>;
    readonly submitForm: EventEmitter<void>;
    readonly editEmail: EventEmitter<void>;
    readonly codeLength = 8;
    ngOnInit(): void;
    /**
     * Getter for the email form control.
     */
    get email(): AbstractControl | null;
    /**
     * Getter for the code form control.
     */
    get code(): AbstractControl | null;
    /**
     * Handle send code button click
     */
    onSendCode(): void;
    /**
     * Handle resend code link click
     */
    onResendCode(): void;
    /**
     * Handle form submission
     */
    onSubmit(): void;
    /**
     * Handle edit email button click
     */
    onEditEmail(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EmailCodeFormComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<EmailCodeFormComponent, "ga-email-code-form", never, { "form": { "alias": "form"; "required": true; }; "isLoading": { "alias": "isLoading"; "required": false; }; "isCodeSent": { "alias": "isCodeSent"; "required": false; }; "isCodeResent": { "alias": "isCodeResent"; "required": false; }; "countdown": { "alias": "countdown"; "required": false; }; "submitButtonText": { "alias": "submitButtonText"; "required": false; }; "sendCodeButtonText": { "alias": "sendCodeButtonText"; "required": false; }; "showForgotEmailLink": { "alias": "showForgotEmailLink"; "required": false; }; "forgotEmailLink": { "alias": "forgotEmailLink"; "required": false; }; "showEditEmailButton": { "alias": "showEditEmailButton"; "required": false; }; "descriptionText": { "alias": "descriptionText"; "required": false; }; "successSentCodeTitle": { "alias": "successSentCodeTitle"; "required": false; }; "successSentCodeSubTitle": { "alias": "successSentCodeSubTitle"; "required": false; }; }, { "sendCode": "sendCode"; "resendCode": "resendCode"; "submitForm": "submitForm"; "editEmail": "editEmail"; }, never, never, false, never>;
}
