import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ITimeLog, IGetTimeLogInput, IManualTimeInput, ITimesheet, IGetTimesheetInput, IGetTimeLogConflictInput, IGetTimeSlotInput, ITimeSlot, IGetTimeLogReportInput, IAmountOwedReport, IGetTimeLimitReportInput, ITimeLimitReport, IClientBudgetLimitReport, IProjectBudgetLimitReport, IReportDayData, ReportDayData, IUpdateTimesheetStatusInput, ISubmitTimesheetInput, ID, IDeleteTimeSlot, IDeleteScreenshot } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class TimesheetService {
    private http;
    interval: any;
    private _updateLog$;
    updateLog$: Observable<boolean>;
    constructor(http: HttpClient);
    updateLogs(value: boolean): void;
    addTime(request: IManualTimeInput): Promise<ITimeLog>;
    updateTime(id: ID, request: ITimeLog | Partial<ITimeLog>): Promise<ITimeLog>;
    checkOverlaps(request: IGetTimeLogConflictInput): Promise<ITimeLog[]>;
    /**
     * Fetches a timesheet by its ID.
     *
     * @param id - The ID of the timesheet to retrieve.
     * @returns An observable of the timesheet data.
     */
    getTimeSheetById(id: string): Observable<ITimesheet>;
    getTimeSheets(request?: IGetTimesheetInput): Promise<ITimesheet[]>;
    getTimeSheetCount(request?: IGetTimesheetInput): Promise<number>;
    updateStatus(request: IUpdateTimesheetStatusInput): Promise<ITimesheet[]>;
    submitTimesheet(request: ISubmitTimesheetInput): Promise<ITimesheet[]>;
    getTimeLogs(request?: IGetTimeLogInput, relations?: any[]): Promise<ITimeLog[]>;
    /**
     * Fetches daily report data based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLogInput).
     * @returns A Promise that resolves to the daily report data.
     */
    getDailyReport(request: IGetTimeLogInput): Promise<IReportDayData[]>;
    /**
     * Fetches daily report chart data based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLogReportInput).
     * @returns A Promise that resolves to the daily report chart data.
     */
    getDailyReportChart(request: IGetTimeLogReportInput): Promise<Object>;
    /**
     * Retrieves the amount owed report based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetTimeLogInput).
     * @returns A Promise that resolves to the amount owed report data.
     */
    getOwedAmountReport(request?: IGetTimeLogInput): Promise<IAmountOwedReport[]>;
    /**
     * Retrieves chart data for the owed amount report based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetTimeLogInput).
     * @returns A Promise that resolves to the chart data for the owed amount report.
     */
    getOwedAmountReportChartData(request?: IGetTimeLogInput): Promise<any>;
    /**
     * Fetches weekly report chart data based on the provided request parameters.
     *
     * @param request - Optional parameters for customizing the request (IGetTimeLogInput).
     * @returns A Promise that resolves to the weekly report chart data.
     */
    getWeeklyReportChart(request?: IGetTimeLogInput): Promise<ReportDayData[]>;
    /**
     * Fetches time limit report based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLimitReportInput).
     * @returns A Promise that resolves to the time limit report data.
     */
    getTimeLimit(request: IGetTimeLimitReportInput): Promise<ITimeLimitReport[]>;
    /**
     * Fetches project budget limit report based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLogReportInput).
     * @returns A Promise that resolves to the project budget limit report data.
     */
    getProjectBudgetLimit(request: IGetTimeLogReportInput): Promise<IProjectBudgetLimitReport[]>;
    /**
     * Fetches client budget limit report based on the provided request parameters.
     *
     * @param request - Parameters for customizing the request (IGetTimeLogReportInput).
     * @returns A Promise that resolves to the client budget limit report data.
     */
    getClientBudgetLimit(request: IGetTimeLogReportInput): Promise<IClientBudgetLimitReport[]>;
    getTimeLog(id: string, findOptions: any): Promise<ITimeLog>;
    getTimeSlot(id: any, request?: IGetTimeSlotInput): Promise<ITimeSlot>;
    getTimeSlots(request?: IGetTimeSlotInput): Promise<ITimeSlot[]>;
    /**
     * Deletes multiple time slots based on the provided request.
     *
     * @param request - The request object containing parameters for deletion.
     * @returns A Promise that resolves when the time slots are deleted.
     */
    deleteTimeSlots(request: IDeleteTimeSlot): Promise<Object>;
    deleteLogs(request: any): Promise<Object>;
    /**
     * Deletes a screenshot by its ID.
     *
     * @param id - The ID of the screenshot to delete.
     * @param params - The parameters that include tenant and organization context.
     * @returns A Promise that resolves to an object containing the result of the deletion.
     */
    deleteScreenshot(id: ID, params: IDeleteScreenshot): Promise<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TimesheetService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TimesheetService>;
}
