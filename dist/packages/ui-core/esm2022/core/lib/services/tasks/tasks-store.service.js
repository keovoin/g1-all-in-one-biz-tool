import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TasksService } from './tasks.service';
import * as i0 from "@angular/core";
import * as i1 from "./tasks.service";
export class TasksStoreService {
    get tasks() {
        return this._tasks$.getValue();
    }
    constructor(_taskService) {
        this._taskService = _taskService;
        this._tasks$ = new BehaviorSubject([]);
        this.tasks$ = this._tasks$.asObservable().pipe(map(this._mapToViewModel));
        this._selectedTask$ = new BehaviorSubject(null);
        this.selectedTask$ = this._selectedTask$.asObservable();
    }
    fetchTasks(tenantId, organizationId) {
        return this._taskService
            .getAllTasks({
            tenantId,
            organizationId
        })
            .pipe(tap(({ items }) => this.loadAllTasks(items)));
    }
    _mapToViewModel(tasks) {
        return tasks.map((task) => ({
            ...task,
            projectName: task.project ? task.project.name : null,
            employees: task.members ? task.members : null
        }));
    }
    loadAllTasks(tasks) {
        this._tasks$.next(tasks);
    }
    updateTasksViewMode(projectId, viewModeType) {
        this._tasks$.next([
            ...this.tasks.map((task) => {
                if (task.projectId === projectId && task.project.taskListType !== viewModeType) {
                    return {
                        ...task,
                        project: { ...task.project, taskListType: viewModeType }
                    };
                }
                return task;
            })
        ]);
    }
    createTask(task) {
        return this._taskService.createTask(task).pipe(tap((createdTask) => {
            const tasks = [...this.tasks, createdTask];
            this._tasks$.next(tasks);
        }));
    }
    editTask(task) {
        return this._taskService.editTask(task).pipe(tap(() => {
            const tasks = [...this.tasks];
            const newState = tasks.map((t) => (t.id === task.id ? { ...t, ...task } : t));
            this._tasks$.next(newState);
        }));
    }
    delete(id) {
        return this._taskService.deleteTask(id).pipe(tap(() => {
            const tasks = [...this.tasks];
            const newState = tasks.filter((t) => t.id !== id);
            this._tasks$.next(newState);
        }));
    }
    selectTask(task) {
        this._selectedTask$.next(task);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksStoreService, deps: [{ token: i1.TasksService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.TasksService }] });
//# sourceMappingURL=tasks-store.service.js.map