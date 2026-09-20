import { UntypedFormGroup } from '@angular/forms';
/**
 * Validates that at least one field in the group has a valid, non-null, and non-undefined value.
 *
 * @param group - The form group to validate.
 * @returns A validation error object if no valid value is found in the group, otherwise null.
 */
export declare function AtLeastOneFieldValidator(group: UntypedFormGroup): {
    [key: string]: any;
};
