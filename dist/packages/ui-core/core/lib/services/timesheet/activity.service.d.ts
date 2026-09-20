import { HttpClient } from '@angular/common/http';
import { IActivity, IGetActivitiesInput, IDailyActivity } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class ActivityService {
    private http;
    constructor(http: HttpClient);
    getActivities(request: IGetActivitiesInput): Promise<IActivity[]>;
    getDailyActivities(request: IGetActivitiesInput): Promise<IDailyActivity[]>;
    getDailyActivitiesReport(request: IGetActivitiesInput): Promise<IDailyActivity[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<ActivityService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ActivityService>;
}
