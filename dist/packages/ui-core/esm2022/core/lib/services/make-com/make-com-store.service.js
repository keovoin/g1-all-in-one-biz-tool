import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MakeComService } from './make-com.service';
import * as i0 from "@angular/core";
import * as i1 from "./make-com.service";
export class MakeComStoreService {
    constructor(_makeComService) {
        this._makeComService = _makeComService;
        // ─── Setup status state ──────────────────────────────────────────────────
        this._setupStatus$ = new BehaviorSubject(null);
        this.setupStatus$ = this._setupStatus$.asObservable();
        // ─── Settings state ─────────────────────────────────────────────────────
        this._settings$ = new BehaviorSubject(null);
        this.settings$ = this._settings$.asObservable();
        // ─── Zone state ─────────────────────────────────────────────────────────
        this._zone$ = new BehaviorSubject(null);
        this.zone$ = this._zone$.asObservable();
        // ─── Make.com context state ─────────────────────────────────────────────
        this._makeOrganizations$ = new BehaviorSubject([]);
        this.makeOrganizations$ = this._makeOrganizations$.asObservable();
        this._selectedMakeOrganization$ = new BehaviorSubject(null);
        this.selectedMakeOrganization$ = this._selectedMakeOrganization$.asObservable();
        this._makeTeams$ = new BehaviorSubject([]);
        this.makeTeams$ = this._makeTeams$.asObservable();
        this._selectedMakeTeam$ = new BehaviorSubject(null);
        this.selectedMakeTeam$ = this._selectedMakeTeam$.asObservable();
        // ─── Resource state ─────────────────────────────────────────────────────
        this._scenarios$ = new BehaviorSubject([]);
        this.scenarios$ = this._scenarios$.asObservable();
        this._hooks$ = new BehaviorSubject([]);
        this.hooks$ = this._hooks$.asObservable();
        this._connections$ = new BehaviorSubject([]);
        this.connections$ = this._connections$.asObservable();
        this._templates$ = new BehaviorSubject([]);
        this.templates$ = this._templates$.asObservable();
    }
    // ─── Setup Status ───────────────────────────────────────────────────────
    loadSetupStatus(organizationId) {
        return this._makeComService.getSetupStatus(organizationId).pipe(tap((status) => this._setupStatus$.next(status)), catchError((error) => {
            console.error('Error loading Make.com setup status:', error);
            return throwError(() => error);
        }));
    }
    getSetupStatus() {
        return this._setupStatus$.getValue();
    }
    // ─── Settings ───────────────────────────────────────────────────────────
    loadIntegrationSettings() {
        return this._makeComService.getIntegrationSettings().pipe(tap((settings) => this._settings$.next(settings)), catchError((error) => {
            console.error('Error loading Make.com integration settings:', error);
            return throwError(() => error);
        }));
    }
    updateIntegrationSettings(settings) {
        return this._makeComService.updateIntegrationSettings(settings).pipe(tap((updatedSettings) => this._settings$.next(updatedSettings)), catchError((error) => {
            console.error('Error updating Make.com integration settings:', error);
            return throwError(() => error);
        }));
    }
    initializeIntegration(body) {
        return this._makeComService.initializeIntegration(body).pipe(catchError((error) => {
            console.error('Error initializing Make.com integration:', error);
            return throwError(() => error);
        }));
    }
    getCurrentSettings() {
        return this._settings$.getValue();
    }
    // ─── Zone ───────────────────────────────────────────────────────────────
    loadZone(organizationId) {
        return this._makeComService.getZone(organizationId).pipe(tap((zone) => this._zone$.next(zone)), catchError((error) => {
            console.error('Error loading Make.com zone:', error);
            return throwError(() => error);
        }));
    }
    setZone(zone, organizationId) {
        return this._makeComService.setZone(zone, organizationId).pipe(tap(() => {
            this._zone$.next(zone);
            this._setupStatus$.next(null);
            this._selectedMakeOrganization$.next(null);
            this._makeOrganizations$.next([]);
            this._selectedMakeTeam$.next(null);
            this._makeTeams$.next([]);
            this._scenarios$.next([]);
            this._hooks$.next([]);
            this._connections$.next([]);
            this._templates$.next([]);
        }), catchError((error) => {
            console.error('Error setting Make.com zone:', error);
            return throwError(() => error);
        }));
    }
    getZone() {
        return this._zone$.getValue();
    }
    // ─── Organizations ──────────────────────────────────────────────────────
    loadMakeOrganizations(organizationId) {
        return this._makeComService.listOrganizations(organizationId).pipe(tap((orgs) => this._makeOrganizations$.next(orgs)), catchError((error) => {
            console.error('Error loading Make.com organizations:', error);
            return throwError(() => error);
        }));
    }
    selectMakeOrganization(org, organizationId) {
        return this._makeComService.setMakeOrganization(org.id, organizationId).pipe(tap(() => {
            this._selectedMakeOrganization$.next(org);
            this._selectedMakeTeam$.next(null);
            this._makeTeams$.next([]);
            this._scenarios$.next([]);
            this._hooks$.next([]);
            this._connections$.next([]);
            this._templates$.next([]);
        }), catchError((error) => {
            console.error('Error selecting Make.com organization:', error);
            return throwError(() => error);
        }));
    }
    // ─── Teams ──────────────────────────────────────────────────────────────
    loadMakeTeams(makeOrgId, organizationId) {
        return this._makeComService.listTeams(makeOrgId, organizationId).pipe(tap((teams) => this._makeTeams$.next(teams)), catchError((error) => {
            console.error('Error loading Make.com teams:', error);
            return throwError(() => error);
        }));
    }
    selectMakeTeam(team, organizationId) {
        return this._makeComService.setMakeTeam(team.id, organizationId).pipe(tap(() => {
            this._selectedMakeTeam$.next(team);
            this._scenarios$.next([]);
            this._hooks$.next([]);
            this._connections$.next([]);
            this._templates$.next([]);
        }), catchError((error) => {
            console.error('Error selecting Make.com team:', error);
            return throwError(() => error);
        }));
    }
    // ─── Scenarios ──────────────────────────────────────────────────────────
    loadScenarios(teamId, organizationId) {
        return this._makeComService.listScenarios(teamId, organizationId).pipe(tap((scenarios) => this._scenarios$.next(scenarios)), catchError((error) => {
            console.error('Error loading Make.com scenarios:', error);
            return throwError(() => error);
        }));
    }
    startScenario(id, organizationId) {
        return this._makeComService.startScenario(id, organizationId);
    }
    stopScenario(id, organizationId) {
        return this._makeComService.stopScenario(id, organizationId);
    }
    runScenario(id, organizationId) {
        return this._makeComService.runScenario(id, organizationId);
    }
    deleteScenario(id, organizationId) {
        return this._makeComService.deleteScenario(id, organizationId);
    }
    // ─── Hooks ──────────────────────────────────────────────────────────────
    loadHooks(teamId, organizationId) {
        return this._makeComService.listHooks(teamId, organizationId).pipe(tap((hooks) => this._hooks$.next(hooks)), catchError((error) => {
            console.error('Error loading Make.com hooks:', error);
            return throwError(() => error);
        }));
    }
    enableHook(id, organizationId) {
        return this._makeComService.enableHook(id, organizationId);
    }
    disableHook(id, organizationId) {
        return this._makeComService.disableHook(id, organizationId);
    }
    pingHook(id, organizationId) {
        return this._makeComService.pingHook(id, organizationId);
    }
    deleteHook(id, organizationId) {
        return this._makeComService.deleteHook(id, organizationId);
    }
    // ─── Connections ────────────────────────────────────────────────────────
    loadConnections(teamId, organizationId) {
        return this._makeComService.listConnections(teamId, organizationId).pipe(tap((connections) => this._connections$.next(connections)), catchError((error) => {
            console.error('Error loading Make.com connections:', error);
            return throwError(() => error);
        }));
    }
    testConnection(id, organizationId) {
        return this._makeComService.testConnection(id, organizationId);
    }
    deleteConnection(id, organizationId) {
        return this._makeComService.deleteConnection(id, organizationId);
    }
    // ─── Templates ──────────────────────────────────────────────────────────
    loadTemplates(teamId, organizationId) {
        return this._makeComService.listTemplates(teamId, organizationId).pipe(tap((templates) => this._templates$.next(templates)), catchError((error) => {
            console.error('Error loading Make.com templates:', error);
            return throwError(() => error);
        }));
    }
    // ─── Store Management ───────────────────────────────────────────────────
    clearStore() {
        this._setupStatus$.next(null);
        this._settings$.next(null);
        this._zone$.next(null);
        this._makeOrganizations$.next([]);
        this._selectedMakeOrganization$.next(null);
        this._makeTeams$.next([]);
        this._selectedMakeTeam$.next(null);
        this._scenarios$.next([]);
        this._hooks$.next([]);
        this._connections$.next([]);
        this._templates$.next([]);
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MakeComStoreService, deps: [{ token: i1.MakeComService }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MakeComStoreService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MakeComStoreService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.MakeComService }] });
//# sourceMappingURL=make-com-store.service.js.map