import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IGoalTimeFrame, IKPI, ISettingFindInput, IGoalGeneralSetting, IGoalTimeFrameFindInput, IGoalTimeFrameResponse, IKpiResponse, IGeneralSettingResponse } from '@gauzy/contracts';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
export declare class GoalSettingsService {
    private _http;
    private toastrService;
    private readonly TIME_FRAME_URL;
    private readonly KPI_URL;
    private readonly GENERAL_SETTINGS_URL;
    constructor(_http: HttpClient, toastrService: ToastrService);
    createTimeFrame(timeFrame: any): Promise<IGoalTimeFrame>;
    getAllTimeFrames(findInput: IGoalTimeFrameFindInput): Promise<IGoalTimeFrameResponse>;
    deleteTimeFrame(id: string): Promise<any>;
    updateTimeFrame(id: string, goalTimeFrame: IGoalTimeFrame): Promise<IGoalTimeFrame>;
    createKPI(kpi: any): Promise<IKPI>;
    getAllKPI(findInput?: ISettingFindInput): Promise<IKpiResponse>;
    deleteKPI(id: string): Promise<any>;
    updateKPI(id: string, kpiData: IKPI): Promise<IKPI>;
    getAllGeneralSettings(findInput?: ISettingFindInput): Promise<IGeneralSettingResponse>;
    updateGeneralSettings(id: string, generalSettingData: IGoalGeneralSetting): Promise<IGoalGeneralSetting>;
    errorHandler(error: HttpErrorResponse): import("rxjs").Observable<never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoalSettingsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GoalSettingsService>;
}
