import { AbstractControl, ValidatorFn } from '@angular/forms';
export declare class UrlPatternValidator {
    /**
     * Validate website URLs based on the provided pattern.
     * @param field The name of the website URL form control.
     * @returns A validator function to validate the website URL field.
     */
    static websiteUrlValidator(field: string): ValidatorFn;
    /**
     * Validate image URLs based on the provided pattern.
     * @param field The name of the image URL form control.
     * @returns A validator function to validate the image URL field.
     */
    static imageUrlValidator(field: string): ValidatorFn;
    /**
     * Validate URLs based on the provided pattern.
     * @param control The form control to validate.
     * @param pattern The regular expression pattern to match against.
     * @returns An object containing validation errors, or null if validation passes.
     */
    static urlAbstractValidator(control: AbstractControl, pattern: RegExp): {
        urlValid: boolean;
    };
    /**
     * Check if the URL is valid based on the provided RegExp pattern.
     * @param urlString The URL to validate.
     * @param regExp The RegExp pattern to match against.
     * @returns True if the URL is valid, otherwise false.
     */
    static isValidUrl(urlString: string, regExp: RegExp): boolean;
}
