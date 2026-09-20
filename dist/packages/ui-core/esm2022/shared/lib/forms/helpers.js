import { FormArray, UntypedFormGroup } from '@angular/forms';
import * as _ from 'underscore.string';
export class FormHelpers {
    /**
     * Loop and mark all it has
     *
     * @param {FormGroup} formGroup
     * @param markAs
     * @param opts
     *
     */
    static deepMark(formGroup, markAs, opts = { onlySelf: false }) {
        Object.values(formGroup.controls).forEach((c) => {
            if (c instanceof UntypedFormGroup || c instanceof FormArray) {
                FormHelpers.deepMark(c, markAs, opts);
            }
            else {
                c[`markAs${_.capitalize(markAs)}`](opts);
            }
        });
    }
    /**
     * Deep check invalid control
     *
     * @param {FormGroup} formGroup
     * @param control
     * @returns
     */
    static isInvalidControl(formGroup, control) {
        if (!formGroup.contains(control)) {
            return true;
        }
        return (formGroup.get(control).touched || formGroup.get(control).dirty) && formGroup.get(control).invalid;
    }
    /**
     * Deep check valid control
     *
     * @param {FormGroup} formGroup
     * @param control
     * @returns
     */
    static isValidControl(formGroup, control) {
        if (!formGroup.contains(control)) {
            return false;
        }
        return (formGroup.get(control).touched || formGroup.get(control).dirty) && formGroup.get(control).valid;
    }
}
//# sourceMappingURL=helpers.js.map