import { HttpClient } from '@angular/common/http';
import { IGetTimeSlotStatistics, IGetActivitiesStatistics, IGetProjectsStatistics, IGetMembersStatistics, IGetTasksStatistics, IGetCountsStatistics, ICountsStatistics, IMembersStatistics, IActivitiesStatistics, ITimeSlotStatistics, IProjectsStatistics, ITasksStatistics, IManualTimesStatistics } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class TimesheetStatisticsService {
    private http;
    constructor(http: HttpClient);
    getCounts(request: IGetCountsStatistics): Promise<ICountsStatistics>;
    getTimeSlots(request?: IGetTimeSlotStatistics): Promise<ITimeSlotStatistics[]>;
    getActivities(request?: IGetActivitiesStatistics): Promise<IActivitiesStatistics[]>;
    /**
     * Get tasks statistics via POST request
     *
     * @param input - The input parameters for fetching tasks statistics
     * @returns
     */
    getTasksStatistics(input: IGetTasksStatistics): Promise<ITasksStatistics[]>;
    getManualTimes(request: any): Promise<IManualTimesStatistics[]>;
    getProjects(request?: IGetProjectsStatistics): Promise<IProjectsStatistics[]>;
    getMembers(request: IGetMembersStatistics): Promise<IMembersStatistics[]>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimesheetStatisticsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimesheetStatisticsService>;
}
