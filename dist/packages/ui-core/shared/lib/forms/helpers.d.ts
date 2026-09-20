import { FormArray, UntypedFormGroup } from '@angular/forms';
export declare class FormHelpers {
    /**
     * Loop and mark all it has
     *
     * @param {FormGroup} formGroup
     * @param markAs
     * @param opts
     *
     */
    static deepMark(formGroup: UntypedFormGroup | FormArray, markAs: 'touched' | 'untouched' | 'dirty' | 'pristine' | 'pending', opts?: {
        onlySelf: boolean;
    }): void;
    /**
     * Deep check invalid control
     *
     * @param {FormGroup} formGroup
     * @param control
     * @returns
     */
    static isInvalidControl(formGroup: UntypedFormGroup, control: string): boolean;
    /**
     * Deep check valid control
     *
     * @param {FormGroup} formGroup
     * @param control
     * @returns
     */
    static isValidControl(formGroup: UntypedFormGroup, control: string): boolean;
}
