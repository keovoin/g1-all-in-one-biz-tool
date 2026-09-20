import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ITask, IGetTaskOptions, IGetTaskByEmployeeOptions, IPagination, IEmployee } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
export declare class TasksService extends TranslationBaseComponent {
    private readonly _http;
    private readonly toastrService;
    private readonly API_URL;
    constructor(_http: HttpClient, toastrService: ToastrService, translateService: TranslateService);
    getAllTasks(where: IGetTaskOptions, relations?: string[]): Observable<IPagination<ITask>>;
    getAllTasksByEmployee(id: IEmployee['id'], options: IGetTaskByEmployeeOptions): Promise<ITask[]>;
    getMyTasks(findInput?: IGetTaskOptions): Observable<IPagination<ITask>>;
    getTeamTasks(findInput?: IGetTaskOptions, employeeId?: string): Observable<IPagination<ITask>>;
    getById(id: string): Promise<ITask>;
    createTask(task: any): Observable<ITask>;
    editTask(task: ITask): Observable<ITask>;
    deleteTask(id: string): Observable<void>;
    errorHandler(error: HttpErrorResponse): Observable<never>;
    getMaxTaskNumber(options: IGetTaskOptions): Observable<number>;
    static ɵfac: i0.ɵɵFactoryDeclaration<TasksService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TasksService>;
}
