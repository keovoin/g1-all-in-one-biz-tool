import { EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { ICandidate } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { CandidatesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { BaseCandidateSelectorComponent } from '../base-candidate-selector.component';
import * as i0 from "@angular/core";
export declare class CandidateSelectComponent extends BaseCandidateSelectorComponent implements OnInit {
    select: FormControl;
    showRejected: boolean;
    searchControl: FormControl;
    filteredCandidates$: Observable<ICandidate[]>;
    private candidatesMap;
    placeholder: string;
    disabled: boolean;
    set reset(value: boolean | null);
    selectedChange: EventEmitter<any>;
    input: any;
    constructor(store: Store, candidatesService: CandidatesService, errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    private filterCandidatesList;
    /**
     *
     * @param candidate
     */
    onCandidateSelected(candidateId: ICandidate['id']): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateSelectComponent, "ga-candidate-select", never, { "placeholder": { "alias": "placeholder"; "required": false; }; "disabled": { "alias": "disabled"; "required": false; }; "reset": { "alias": "reset"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, never, false, never>;
}
