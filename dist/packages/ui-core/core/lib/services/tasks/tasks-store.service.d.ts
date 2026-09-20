import { Observable } from 'rxjs';
import { IPagination, ITask, TaskListTypeEnum } from '@gauzy/contracts';
import { TasksService } from './tasks.service';
import * as i0 from "@angular/core";
export declare class TasksStoreService {
    private readonly _taskService;
    private _tasks$;
    tasks$: Observable<ITask[]>;
    private _selectedTask$;
    selectedTask$: Observable<ITask>;
    get tasks(): ITask[];
    constructor(_taskService: TasksService);
    fetchTasks(tenantId: string, organizationId: string): Observable<IPagination<ITask>>;
    private _mapToViewModel;
    loadAllTasks(tasks: ITask[]): void;
    updateTasksViewMode(projectId: string, viewModeType: TaskListTypeEnum): void;
    createTask(task: ITask): Observable<ITask>;
    editTask(task: ITask): Observable<ITask>;
    delete(id: string): Observable<void>;
    selectTask(task: ITask): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TasksStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TasksStoreService>;
}
