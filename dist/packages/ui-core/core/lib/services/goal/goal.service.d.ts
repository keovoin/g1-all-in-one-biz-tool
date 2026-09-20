import { IGoal, IGoalFindInput, IGoalResponse } from '@gauzy/contracts';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
export declare class GoalService {
    private readonly _http;
    private readonly toastrService;
    private readonly API_URL;
    constructor(_http: HttpClient, toastrService: ToastrService);
    createGoal(goal: any): Promise<IGoal>;
    update(id: string, goal: IGoal): Promise<IGoal>;
    getAllGoals(relations?: string[], findInput?: IGoalFindInput): Promise<IGoalResponse>;
    delete(id: string): Promise<any>;
    errorHandler(error: HttpErrorResponse): import("rxjs").Observable<never>;
    static ɵfac: i0.ɵɵFactoryDeclaration<GoalService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GoalService>;
}
