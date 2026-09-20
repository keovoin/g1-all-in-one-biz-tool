import { AbstractControl, ValidatorFn } from '@angular/forms';
export declare class EmailValidator {
    /**
     * Validate emails based on the provided pattern.
     * @param field The name of the email form control.
     * @returns A validator function to validate the email field.
     */
    static pattern(field: string): ValidatorFn;
    /**
     * Validate emails based on the provided pattern.
     * @param control The form control to validate.
     * @param pattern The regular expression pattern to match against.
     * @returns An object containing validation errors, or null if validation passes.
     */
    static validator(control: AbstractControl, pattern: RegExp): {
        emailValid: boolean;
    };
    /**
     * Check if the email is valid based on the provided RegExp pattern.
     * @param email The email to validate.
     * @param regExp The RegExp pattern to match against.
     * @returns True if the email is valid, otherwise false.
     */
    static isValid(email: string, regExp: RegExp): boolean;
}
