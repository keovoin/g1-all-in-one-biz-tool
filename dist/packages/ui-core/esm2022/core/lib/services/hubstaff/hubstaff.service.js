import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, forkJoin, debounceTime } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { switchMap, tap } from 'rxjs/operators';
import { clone } from 'underscore';
import moment from 'moment';
import { IntegrationEntity } from '@gauzy/contracts';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { environment } from '@gauzy/ui-config';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
const TODAY = new Date();
const DEFAULT_DATE_RANGE = {
    start: new Date(moment().subtract(6, 'days').format('YYYY-MM-DD')),
    end: new Date(moment().add(1, 'days').format('YYYY-MM-DD'))
};
export class HubstaffService {
    constructor(_http) {
        this._http = _http;
        this._entitiesToSync$ = new BehaviorSubject({
            previousValue: [],
            currentValue: []
        });
        this._dateRangeActivity$ = new BehaviorSubject(DEFAULT_DATE_RANGE);
        this.entitiesToSync$ = this._entitiesToSync$.asObservable();
        this.dateRangeActivity$ = this._dateRangeActivity$.asObservable();
    }
    getIntegration(integrationId) {
        const data = JSON.stringify({
            relations: ['integration']
        });
        return this._http
            .get(`${API_PREFIX}/integration-entity-setting/integration/${integrationId}`, {
            params: { data }
        })
            .pipe(tap(({ items }) => this._setSettingsValue(items)));
    }
    resetSettings() {
        const settings = this._entitiesToSync$.getValue();
        this._entitiesToSync$.next({
            ...settings,
            currentValue: clone(settings.previousValue)
        });
    }
    _setSettingsValue(items) {
        this._entitiesToSync$.next({
            previousValue: clone(items),
            currentValue: items
        });
    }
    updateSettings(integrationId) {
        const { currentValue } = this._entitiesToSync$.getValue();
        return this._http
            .put(`${API_PREFIX}/integration-entity-setting/integration/${integrationId}`, currentValue)
            .pipe(tap((entitySettings) => this._setSettingsValue(entitySettings)));
    }
    getToken(integrationId) {
        this.integrationId = integrationId;
        return this._http
            .get(`${API_PREFIX}/integration/hubstaff/token/${integrationId}`)
            .pipe(tap(({ settingsValue }) => (this.ACCESS_TOKEN = settingsValue)));
    }
    refreshToken() {
        return this._http
            .get(`${API_PREFIX}/integration/hubstaff/refresh-token/${this.integrationId}`)
            .pipe(tap(({ access_token }) => (this.ACCESS_TOKEN = access_token)));
    }
    /**
     * Authorize a client for Hubstaff integration.
     *
     * @param client_id The client ID for the Hubstaff integration.
     */
    authorizeClient(client_id) {
        const { HUBSTAFF_REDIRECT_URL, API_BASE_URL } = environment;
        const HUBSTAFF_AUTHORIZATION_URL = `https://account.hubstaff.com`;
        // Set default redirect URI if HUBSTAFF_REDIRECT_URL is not defined
        const redirect_uri = HUBSTAFF_REDIRECT_URL || `${API_BASE_URL}${API_PREFIX}/integration/hubstaff/callback`;
        // Define your query parameters
        const queryParams = toParams({
            response_type: 'code',
            redirect_uri: `${redirect_uri}`,
            realm: 'hubstaff',
            client_id: `${client_id}`,
            scope: 'hubstaff:read',
            state: `${client_id}`,
            nonce: `${uuid()}`
        });
        // Construct the external URL with the query parameters
        const externalUrl = `${HUBSTAFF_AUTHORIZATION_URL}/authorizations/new?${queryParams.toString()}`;
        // Navigate to the external URL with query parameters
        window.location.replace(externalUrl);
    }
    /**
     * Add a new integration for Hubstaff.
     *
     * @param param0 - The integration parameters including code, client_secret, client_id, and organizationId.
     * @returns An Observable of the created integration tenant.
     */
    addIntegration({ code, client_secret, client_id, organizationId }) {
        const { HUBSTAFF_REDIRECT_URL, API_BASE_URL } = environment;
        // Set default redirect URI if HUBSTAFF_REDIRECT_URL is not defined
        const redirect_uri = HUBSTAFF_REDIRECT_URL || `${API_BASE_URL}${API_PREFIX}/integration/hubstaff/callback`;
        return this._http.post(`${API_PREFIX}/integration/hubstaff/integration`, {
            client_id,
            code,
            redirect_uri,
            client_secret,
            organizationId
        });
    }
    /**
     *
     * @param integrationId
     * @returns
     */
    getOrganizations(integrationId) {
        return this._http.get(`${API_PREFIX}/integration/hubstaff/organizations`, {
            params: toParams({
                token: this.ACCESS_TOKEN,
                integrationId
            })
        });
    }
    /**
     *
     * @param organizationId
     * @param integrationId
     * @returns
     */
    getProjects(hubstaffOrganizationId, integrationId) {
        return this._http.get(`${API_PREFIX}/integration/hubstaff/projects/${hubstaffOrganizationId}`, {
            params: toParams({
                integrationId,
                token: this.ACCESS_TOKEN
            })
        });
    }
    /**
     *
     * @param projects
     * @param integrationId
     * @param organizationId
     * @returns
     */
    syncProjects(projects, integrationId, organizationId) {
        return this._http.post(`${API_PREFIX}/integration/hubstaff/sync-projects`, {
            projects: this._mapProjectPayload(projects),
            organizationId,
            integrationId,
            token: this.ACCESS_TOKEN
        });
    }
    setActivityDateRange({ start, end }) {
        this._dateRangeActivity$.next({
            start: start || DEFAULT_DATE_RANGE.start,
            end: this._setEndDate(start)
        });
    }
    _setEndDate(start) {
        const end = moment(start).add(7, 'days').toDate();
        return end > TODAY ? TODAY : end;
    }
    autoSync({ integrationId, hubstaffOrganizations, organizationId }) {
        const dateRange = this._dateRangeActivity$.getValue();
        // organizations are already fetched ---> skip fetch for this just integrate in DB
        const organizationEntityToSync = this._entitiesToSync$
            .getValue()
            .currentValue.filter((setting) => setting.sync)
            .find((setting) => setting.entity === IntegrationEntity.ORGANIZATION);
        // if organization is set to true, map all entities to this organizations, else use hubstaff organizations id and map all entities to current selected gauzy organization
        if (organizationEntityToSync && organizationEntityToSync.sync) {
            const organizationsMap$ = this._http.post(`${API_PREFIX}/integration/hubstaff/sync-organizations`, {
                organizations: this._mapOrganizationPayload(hubstaffOrganizations),
                organizationId,
                integrationId,
                token: this.ACCESS_TOKEN
            });
            return organizationsMap$.pipe(debounceTime(1000), switchMap((organizations) => this._forkEntities(organizations, integrationId, dateRange)));
        }
        return this._forkEntities(hubstaffOrganizations, integrationId, dateRange, organizationId);
    }
    _forkEntities(organizations, integrationId, dateRange, organizationId) {
        return forkJoin(organizations.map((organization) => this._http.post(`${API_PREFIX}/integration/hubstaff/auto-sync/${integrationId}`, {
            dateRange,
            gauzyId: organizationId ? organizationId : organization.gauzyId,
            sourceId: organization.sourceId ? organization.sourceId : organization.id,
            token: this.ACCESS_TOKEN
        }))).pipe(debounceTime(2000));
    }
    /**
     *
     * @param data
     * @returns
     */
    _mapProjectPayload(data) {
        return data.map(({ id }) => ({
            sourceId: id
        }));
    }
    /**
     *
     * @param data
     * @returns
     */
    _mapOrganizationPayload(data) {
        return data.map(({ id }) => ({
            sourceId: id
        }));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HubstaffService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HubstaffService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: HubstaffService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=hubstaff.service.js.map