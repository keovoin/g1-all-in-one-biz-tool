import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap, take, map, switchMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { SprintService } from './organization-sprint.service';
import * as i0 from "@angular/core";
import * as i1 from "./organization-sprint.service";
let SprintStoreService = class SprintStoreService {
    get sprints() {
        return this._sprints$.getValue();
    }
    constructor(sprintService) {
        this.sprintService = sprintService;
        this._sprints$ = new BehaviorSubject([]);
        this.sprints$ = this._sprints$.asObservable();
    }
    fetchSprints(findInput = {}) {
        this.sprintService
            .getAllSprints(findInput)
            .pipe(tap(({ items }) => this.loadAllSprints(items)), untilDestroyed(this))
            .subscribe();
    }
    loadAllSprints(sprints) {
        this._sprints$.next(sprints);
    }
    createSprint(newSprint) {
        return this.sprintService.createSprint(newSprint).pipe(tap((createdSprint) => {
            const sprints = [...this.sprints, createdSprint];
            this._sprints$.next(sprints);
        }), take(1));
    }
    updateSprint(editedSprint) {
        return this.sprintService.editSprint(editedSprint.id, editedSprint).pipe(tap(() => {
            const sprints = [...this.sprints];
            const newState = sprints.map((t) => (t.id === editedSprint.id ? editedSprint : t));
            this._sprints$.next(newState);
        }), take(1));
    }
    deleteSprint(id) {
        return this.sprintService.deleteSprint(id).pipe(tap(() => {
            const newState = this.sprints.filter((sprint) => sprint.id !== id);
            this._sprints$.next(newState);
        }), take(1));
    }
    moveTaskToSprint(sprintId, task) {
        return this.sprints$.pipe(map((sprints) => sprints.find((sprint) => sprint.id === sprintId)), switchMap(({ tasks }) => this.sprintService.editSprint(sprintId, {
            tasks: [...tasks, task]
        })), tap((updatedSprint) => {
            // const sprints = [...this.sprints];
            // const newState = sprints.map((sprint: IOrganizationSprint): IOrganizationSprint =>
            //   sprint.id === updatedSprint.id ? updatedSprint : sprint
            // );
            // this._sprints$.next(newState);
        }), take(1));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SprintStoreService, deps: [{ token: i1.SprintService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SprintStoreService, providedIn: 'root' }); }
};
SprintStoreService = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [SprintService])
], SprintStoreService);
export { SprintStoreService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: SprintStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.SprintService }] });
//# sourceMappingURL=organization-sprint-store.service.js.map