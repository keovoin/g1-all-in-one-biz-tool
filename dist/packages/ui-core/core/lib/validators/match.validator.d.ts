import { ValidatorFn } from '@angular/forms';
/**
 * custom validator to check that two fields match
 */
export declare class MatchValidator {
    /**
     * Custom validator to check that two fields match.
     * @param controlName The name of the first form control.
     * @param matchingControlName The name of the second form control to compare against.
     * @returns A validator function to validate the matching of the two fields.
     */
    static mustMatch(controlName: string, matchingControlName: string): ValidatorFn;
}
