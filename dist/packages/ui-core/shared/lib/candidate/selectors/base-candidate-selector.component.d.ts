import { OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ICandidate } from '@gauzy/contracts';
import { CandidatesService, ErrorHandlingService, Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class BaseCandidateSelectorComponent implements OnInit {
    protected readonly _store: Store;
    protected readonly _candidatesService: CandidatesService;
    protected readonly _errorHandlingService: ErrorHandlingService;
    candidates$: Observable<ICandidate[]>;
    showRejected$: BehaviorSubject<boolean>;
    constructor(_store: Store, _candidatesService: CandidatesService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): void;
    toggleShowRejected(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BaseCandidateSelectorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<BaseCandidateSelectorComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
