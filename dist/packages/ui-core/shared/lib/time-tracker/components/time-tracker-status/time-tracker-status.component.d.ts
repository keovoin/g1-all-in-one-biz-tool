import { Observable } from 'rxjs';
import { ITimerIcon } from '@gauzy/ui-core/core';
import { TimeTrackerStatusService } from './time-tracker-status.service';
import * as i0 from "@angular/core";
export declare class TimeTrackerStatusComponent {
    private readonly _timeTrackerStatusService;
    constructor(_timeTrackerStatusService: TimeTrackerStatusService);
    get icon$(): Observable<ITimerIcon>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimeTrackerStatusComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TimeTrackerStatusComponent, "ga-time-tracker-status", never, {}, {}, never, never, false, never>;
}
