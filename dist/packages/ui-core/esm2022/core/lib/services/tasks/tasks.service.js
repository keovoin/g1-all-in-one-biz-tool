import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ToastrService } from '../notification';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
import * as i2 from "../notification";
import * as i3 from "@ngx-translate/core";
export class TasksService extends TranslationBaseComponent {
    constructor(_http, toastrService, translateService) {
        super(translateService);
        this._http = _http;
        this.toastrService = toastrService;
        this.API_URL = `${API_PREFIX}/tasks`;
    }
    getAllTasks(where, relations = []) {
        return this._http
            .get(this.API_URL, {
            params: toParams({ relations, where })
        })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    getAllTasksByEmployee(id, options) {
        return firstValueFrom(this._http
            .get(`${this.API_URL}/employee/${id}`, {
            params: toParams(options)
        })
            .pipe(catchError((error) => this.errorHandler(error))));
    }
    getMyTasks(findInput = {}) {
        const data = JSON.stringify({
            findInput
        });
        return this._http
            .get(`${this.API_URL}/me`, {
            params: { data }
        })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    getTeamTasks(findInput = {}, employeeId = '') {
        const data = JSON.stringify({
            relations: ['project', 'tags', 'members', 'members.user', 'teams'],
            findInput,
            employeeId
        });
        return this._http
            .get(`${this.API_URL}/team`, {
            params: { data }
        })
            .pipe(catchError((error) => this.errorHandler(error)));
    }
    getById(id) {
        return firstValueFrom(this._http.get(`${this.API_URL}/${id}`));
    }
    createTask(task) {
        return this._http.post(this.API_URL, task).pipe(tap(() => this.toastrService.success('TASKS_PAGE.TASK_ADDED')), catchError((error) => this.errorHandler(error)));
    }
    editTask(task) {
        return this._http.put(`${this.API_URL}/${task.id}`, task).pipe(tap(() => this.toastrService.success('TASKS_PAGE.TASK_UPDATED')), catchError((error) => this.errorHandler(error)));
    }
    deleteTask(id) {
        return this._http.delete(`${this.API_URL}/${id}`).pipe(tap(() => this.toastrService.success('TASKS_PAGE.TASK_DELETED')), catchError((error) => this.errorHandler(error)));
    }
    errorHandler(error) {
        this.toastrService.danger(error.message, this.getTranslation('TOASTR.TITLE.ERROR'));
        return throwError(error.message);
    }
    getMaxTaskNumber(options) {
        return this._http.get(`${API_PREFIX}/tasks/max-number`, {
            params: toParams(options)
        });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksService, deps: [{ token: i1.HttpClient }, { token: i2.ToastrService }, { token: i3.TranslateService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: TasksService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }, { type: i2.ToastrService }, { type: i3.TranslateService }] });
//# sourceMappingURL=tasks.service.js.map