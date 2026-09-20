import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IGoalTemplate, IKeyResultTemplate, IGoalKPITemplate, IGoalTemplateFind } from '@gauzy/contracts';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
interface IGoalTemplateResponse {
    items: IGoalTemplate[];
    count: number;
}
export declare class GoalTemplatesService {
    private _http;
    private toastrService;
    private readonly GOAL_URL;
    private readonly KEYRESULT_URL;
    private readonly GOAL_KPI_URL;
    constructor(_http: HttpClient, toastrService: ToastrService);
    createGoalTemplate(goalTemplate: any): Promise<IGoalTemplate>;
    createKeyResultTemplate(keyResultTemplate: any): Promise<IKeyResultTemplate>;
    createGoalKpiTemplate(goalKpiTemplate: any): Promise<IGoalKPITemplate>;
    getAllGoalTemplates(findInput?: IGoalTemplateFind): Promise<IGoalTemplateResponse>;
    errorHandler(error: HttpErrorResponse): import("rxjs").Observable<never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoalTemplatesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GoalTemplatesService>;
}
export {};
