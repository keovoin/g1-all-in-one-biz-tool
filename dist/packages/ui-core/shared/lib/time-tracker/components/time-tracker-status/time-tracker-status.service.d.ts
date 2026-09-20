import { Observable } from 'rxjs';
import { ITimerStatus } from '@gauzy/contracts';
import { Store, TimeTrackerService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class TimeTrackerStatusService {
    private readonly _timeTrackerService;
    private readonly _store;
    private _icon$;
    private _external$;
    private _userUpdate$;
    constructor(_timeTrackerService: TimeTrackerService, _store: Store);
    get icon$(): Observable<any>;
    get external$(): Observable<any>;
    status(): Promise<ITimerStatus>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackerStatusService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimeTrackerStatusService>;
}
