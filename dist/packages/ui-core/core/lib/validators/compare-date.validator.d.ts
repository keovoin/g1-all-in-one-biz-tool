import { ValidatorFn } from '@angular/forms';
export declare class CompareDateValidator {
    /**
     * Validates the date range between two form fields.
     * @param fromField The name of the 'from' date form control.
     * @param toField The name of the 'to' date form control.
     * @returns A validator function that returns an object if validation fails, or null if validation succeeds.
     */
    static validateDate(fromField: string, toField: string): ValidatorFn;
}
