import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TasksService } from './tasks.service';
import * as i0 from "@angular/core";
import * as i1 from "./tasks.service";
export class MyTasksStoreService {
    get myTasks() {
        return this._myTasks$.getValue();
    }
    constructor(_taskService) {
        this._taskService = _taskService;
        this._myTasks$ = new BehaviorSubject([]);
        this.myTasks$ = this._myTasks$.asObservable().pipe(map(this._mapToViewModel));
        this._selectedTask$ = new BehaviorSubject(null);
        this.selectedTask$ = this._selectedTask$.asObservable();
    }
    fetchTasks(tenantId, organizationId) {
        return this._taskService
            .getMyTasks({ tenantId, organizationId })
            .pipe(tap(({ items }) => this.loadAllTasks(items)));
    }
    _mapToViewModel(tasks) {
        return tasks.map((task) => ({
            ...task,
            projectName: task.project ? task.project.name : undefined,
            employees: task.members ? task.members : undefined
        }));
    }
    loadAllTasks(tasks) {
        this._myTasks$.next(tasks);
    }
    createTask(task) {
        return this._taskService
            .createTask(task)
            .pipe(tap((createdTask) => {
            const tasks = [...this.myTasks, createdTask];
            this._myTasks$.next(tasks);
        }));
    }
    editTask(task) {
        return this._taskService
            .editTask(task)
            .pipe(tap(() => {
            const tasks = [...this.myTasks];
            const newState = tasks.map((t) => t.id === task.id ? task : t);
            this._myTasks$.next(newState);
        }));
    }
    delete(id) {
        return this._taskService
            .deleteTask(id)
            .pipe(tap(() => {
            const tasks = [...this.myTasks];
            const newState = tasks.filter((t) => t.id !== id);
            this._myTasks$.next(newState);
        }));
    }
    selectTask(task) {
        this._selectedTask$.next(task);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MyTasksStoreService, deps: [{ token: i1.TasksService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MyTasksStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MyTasksStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.TasksService }] });
//# sourceMappingURL=my-tasks-store.service.js.map