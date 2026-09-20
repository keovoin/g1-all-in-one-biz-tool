import { __decorate, __metadata } from "tslib";
import { Injectable } from '@angular/core';
import { IntegrationTypeEnum, IntegrationTypeGroupEnum } from '@gauzy/contracts';
import { BehaviorSubject, EMPTY, of } from 'rxjs';
import { IntegrationsService } from './integrations.service';
import { tap, map, distinctUntilChanged, debounceTime, catchError, finalize, mergeMap } from 'rxjs/operators';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ErrorHandlingService } from '../notification';
import * as i0 from "@angular/core";
import * as i1 from "./integrations.service";
import * as i2 from "../notification";
export const InitialFilter = {
    integrationTypeId: '',
    searchQuery: '',
    filter: 'all'
};
let IntegrationsStoreService = class IntegrationsStoreService {
    constructor(_integrationsService, _errorHandlingService) {
        this._integrationsService = _integrationsService;
        this._errorHandlingService = _errorHandlingService;
        this._integrations$ = new BehaviorSubject([]);
        this.integrations$ = this._integrations$.asObservable();
        this._integrationGroups$ = new BehaviorSubject([]);
        this.integrationGroups$ = this._integrationGroups$.asObservable();
        this._isLoading$ = new BehaviorSubject(false);
        this.isLoading$ = this._isLoading$.asObservable();
        this._selectedIntegrationTypeId$ = new BehaviorSubject(InitialFilter.integrationTypeId);
        this.selectedIntegrationTypeId$ = this._selectedIntegrationTypeId$.asObservable();
        this._selectedIntegrationFilter$ = new BehaviorSubject(InitialFilter.filter);
        this.selectedIntegrationFilter$ = this._selectedIntegrationFilter$.asObservable();
        this._filters$ = new BehaviorSubject(InitialFilter);
        this._loadIntegrationGroups();
        this._loadIntegrations();
    }
    _loadIntegrations() {
        this._filters$
            .pipe(distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)), debounceTime(300), mergeMap(({ integrationTypeId, searchQuery, filter }) => {
            return integrationTypeId
                ? this._integrationsService.fetchIntegrations(integrationTypeId, searchQuery, filter)
                : of([]);
        }), tap((integrations) => this._integrations$.next(integrations)), catchError((error) => {
            this._errorHandlingService.handleError(error);
            return of([]);
        }), untilDestroyed(this))
            .subscribe();
    }
    _loadIntegrationGroups() {
        this._integrationsService
            .fetchIntegrationGroups()
            .pipe(distinctUntilChanged(), tap(() => this._isLoading$.next(true)), tap((integrationGroups) => this._integrationGroups$.next(integrationGroups)), map((integrationGroups) => this._mapToDefaultType(integrationGroups)), tap((integrationType) => this._selectedIntegrationTypeId$.next(integrationType.id)), tap((integrationType) => this._filters$.next({
            integrationTypeId: integrationType.id,
            searchQuery: '',
            filter: 'all'
        })), catchError((error) => {
            this._errorHandlingService.handleError(error);
            return EMPTY;
        }), finalize(() => this._isLoading$.next(false)), untilDestroyed(this))
            .subscribe();
    }
    _mapToDefaultType(integrationGroups) {
        const featuredGroup = integrationGroups.find(({ groupName }) => groupName === IntegrationTypeGroupEnum.FEATURED);
        const defaultType = featuredGroup?.integrationTypes.find((item) => item.name === IntegrationTypeEnum.ALL_INTEGRATIONS) ??
            integrationGroups[0]?.integrationTypes[0];
        if (!defaultType) {
            throw new Error('No integration groups available');
        }
        return defaultType;
    }
    setSelectedIntegrationTypeId(integrationTypeId) {
        this._selectedIntegrationTypeId$.next(integrationTypeId);
        const filterState = this._filters$.getValue();
        this._filters$.next({ ...filterState, integrationTypeId });
    }
    setSelectedIntegrationFilter(filter) {
        this._selectedIntegrationFilter$.next(filter);
        const filterState = this._filters$.getValue();
        this._filters$.next({ ...filterState, filter });
    }
    searchIntegration(searchQuery) {
        const filterState = this._filters$.getValue();
        this._filters$.next({ ...filterState, searchQuery });
    }
    /*
     * Clear integration store filters
     */
    clearFilters() {
        this.setSelectedIntegrationFilter(InitialFilter.filter);
        const integrationGroups = this._integrationGroups$.getValue();
        const integrationType = this._mapToDefaultType(integrationGroups);
        this.setSelectedIntegrationTypeId(integrationType.id);
        this.searchIntegration(InitialFilter.searchQuery);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationsStoreService, deps: [{ token: i1.IntegrationsService }, { token: i2.ErrorHandlingService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationsStoreService, providedIn: 'root' }); }
};
IntegrationsStoreService = __decorate([
    UntilDestroy(),
    __metadata("design:paramtypes", [IntegrationsService,
        ErrorHandlingService])
], IntegrationsStoreService);
export { IntegrationsStoreService };
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: IntegrationsStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.IntegrationsService }, { type: i2.ErrorHandlingService }] });
//# sourceMappingURL=integrations-store.service.js.map