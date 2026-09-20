import { EventEmitter, OnInit } from '@angular/core';
import { ICandidate } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import { CandidatesService, ErrorHandlingService } from '@gauzy/ui-core/core';
import { BaseCandidateSelectorComponent } from '../base-candidate-selector.component';
import * as i0 from "@angular/core";
export declare class CandidateMultiSelectComponent extends BaseCandidateSelectorComponent implements OnInit {
    selectedCandidateIds: string[];
    selectedChange: EventEmitter<any>;
    constructor(store: Store, candidatesService: CandidatesService, errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    /**
     *
     * @param candidate
     */
    onCandidateSelected(candidate: ICandidate['id']): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CandidateMultiSelectComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<CandidateMultiSelectComponent, "ga-candidate-multi-select", never, { "selectedCandidateIds": { "alias": "selectedCandidateIds"; "required": false; }; }, { "selectedChange": "selectedChange"; }, never, never, false, never>;
}
