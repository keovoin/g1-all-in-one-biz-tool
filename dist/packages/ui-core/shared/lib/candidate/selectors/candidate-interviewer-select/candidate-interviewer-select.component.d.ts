import { EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ICandidate, IEmployee } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CandidateInterviewerSelectComponent {
    select: FormControl;
    placeholder: string;
    disabledIds: string[];
    interviewers: IEmployee[];
    isAllMembers: boolean;
    disabled: boolean;
    isPlaceholderSelected: boolean;
    set reset(value: boolean | null);
    selectedChange: EventEmitter<any>;
    /**
     *
     * @param candidate
     */
    onInterviewerSelected(candidate: ICandidate['id']): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateInterviewerSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateInterviewerSelectComponent, "ga-candidate-interviewer-select", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "disabledIds": { "alias": "disabledIds"; "required": false; }; "interviewers": { "alias": "interviewers"; "required": false; }; "isAllMembers": { "alias": "isAllMembers"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "isPlaceholderSelected": { "alias": "isPlaceholderSelected"; "required": false; }; "reset": { "alias": "reset"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, never, false, never>;
}
