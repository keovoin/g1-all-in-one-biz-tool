import { Observable } from 'rxjs';
import { IPagination, ITask } from '@gauzy/contracts';
import { TasksService } from './tasks.service';
import * as i0 from "@angular/core";
export declare class MyTasksStoreService {
    private readonly _taskService;
    private _myTasks$;
    myTasks$: Observable<ITask[]>;
    private _selectedTask$;
    selectedTask$: Observable<ITask>;
    get myTasks(): ITask[];
    constructor(_taskService: TasksService);
    fetchTasks(tenantId: string, organizationId: string): Observable<IPagination<ITask>>;
    private _mapToViewModel;
    loadAllTasks(tasks: ITask[]): void;
    createTask(task: ITask): Observable<ITask>;
    editTask(task: ITask): Observable<ITask>;
    delete(id: string): Observable<void>;
    selectTask(task: ITask): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MyTasksStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MyTasksStoreService>;
}
