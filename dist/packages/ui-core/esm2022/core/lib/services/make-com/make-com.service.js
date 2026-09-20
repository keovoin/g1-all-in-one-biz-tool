import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { API_PREFIX } from '@gauzy/ui-core/common';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class MakeComService {
    constructor(http) {
        this.http = http;
        this.API_URL = `${API_PREFIX}/integration/make-com`;
        this.API_BASE = `${this.API_URL}/api`;
    }
    // ─── Settings & Auth ────────────────────────────────────────────────────
    getIntegrationSettings() {
        return this.http.get(this.API_URL);
    }
    updateIntegrationSettings(settings) {
        return this.http.post(this.API_URL, settings);
    }
    initializeIntegration(body) {
        return this.http.post(`${this.API_URL}/oauth-settings`, body);
    }
    handleOAuthCallback(code, state) {
        return this.http.get(`${this.API_URL}/oauth/callback`, {
            params: { code, state }
        });
    }
    handleTokenRequest(body) {
        return this.http.post(`${this.API_URL}/token`, body);
    }
    // ─── Setup Status ───────────────────────────────────────────────────────
    getSetupStatus(organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.get(`${this.API_BASE}/setup-status`, { params });
    }
    // ─── Zone Configuration ─────────────────────────────────────────────────
    getZone(organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.get(`${this.API_BASE}/zone`, { params }).pipe(map((res) => res.zone));
    }
    setZone(zone, organizationId) {
        return this.http.post(`${this.API_BASE}/zone`, {
            zone,
            organizationId
        });
    }
    // ─── Context (Make.com org/team selection) ──────────────────────────────
    setMakeOrganization(makeOrganizationId, organizationId) {
        return this.http.post(`${this.API_BASE}/context/organization`, { makeOrganizationId, organizationId });
    }
    setMakeTeam(makeTeamId, organizationId) {
        return this.http.post(`${this.API_BASE}/context/team`, {
            makeTeamId,
            organizationId
        });
    }
    // ─── Organizations ──────────────────────────────────────────────────────
    listOrganizations(organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http
            .get(`${this.API_BASE}/organizations`, { params })
            .pipe(map((res) => res.organizations));
    }
    // ─── Teams ──────────────────────────────────────────────────────────────
    listTeams(makeOrgId, organizationId) {
        const params = {};
        if (makeOrgId)
            params.makeOrgId = makeOrgId;
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.get(`${this.API_BASE}/teams`, { params }).pipe(map((res) => res.teams));
    }
    // ─── Connections ────────────────────────────────────────────────────────
    listConnections(teamId, organizationId) {
        const params = {};
        if (teamId)
            params.teamId = teamId;
        if (organizationId)
            params.organizationId = organizationId;
        return this.http
            .get(`${this.API_BASE}/connections`, { params })
            .pipe(map((res) => res.connections));
    }
    deleteConnection(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.delete(`${this.API_BASE}/connections/${id}`, { params });
    }
    testConnection(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.post(`${this.API_BASE}/connections/${id}/test`, null, { params });
    }
    // ─── Scenarios ──────────────────────────────────────────────────────────
    listScenarios(teamId, organizationId) {
        const params = {};
        if (teamId)
            params.teamId = teamId;
        if (organizationId)
            params.organizationId = organizationId;
        return this.http
            .get(`${this.API_BASE}/scenarios`, { params })
            .pipe(map((res) => res.scenarios));
    }
    getScenario(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http
            .get(`${this.API_BASE}/scenarios/${id}`, { params })
            .pipe(map((res) => res.scenario));
    }
    startScenario(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http
            .post(`${this.API_BASE}/scenarios/${id}/start`, null, { params })
            .pipe(map((res) => res.scenario));
    }
    stopScenario(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http
            .post(`${this.API_BASE}/scenarios/${id}/stop`, null, { params })
            .pipe(map((res) => res.scenario));
    }
    runScenario(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.post(`${this.API_BASE}/scenarios/${id}/run`, null, { params });
    }
    deleteScenario(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.delete(`${this.API_BASE}/scenarios/${id}`, { params });
    }
    // ─── Hooks (Webhooks) ───────────────────────────────────────────────────
    listHooks(teamId, organizationId) {
        const params = {};
        if (teamId)
            params.teamId = teamId;
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.get(`${this.API_BASE}/hooks`, { params }).pipe(map((res) => res.hooks));
    }
    enableHook(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.post(`${this.API_BASE}/hooks/${id}/enable`, null, { params });
    }
    disableHook(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.post(`${this.API_BASE}/hooks/${id}/disable`, null, { params });
    }
    pingHook(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.get(`${this.API_BASE}/hooks/${id}/ping`, { params });
    }
    deleteHook(id, organizationId) {
        const params = {};
        if (organizationId)
            params.organizationId = organizationId;
        return this.http.delete(`${this.API_BASE}/hooks/${id}`, { params });
    }
    // ─── Templates ──────────────────────────────────────────────────────────
    listTemplates(teamId, organizationId) {
        const params = {};
        if (teamId)
            params.teamId = teamId;
        if (organizationId)
            params.organizationId = organizationId;
        return this.http
            .get(`${this.API_BASE}/templates`, { params })
            .pipe(map((res) => res.templates));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MakeComService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MakeComService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: MakeComService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=make-com.service.js.map