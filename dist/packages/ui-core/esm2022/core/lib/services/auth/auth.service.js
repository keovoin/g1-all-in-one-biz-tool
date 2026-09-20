import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_PREFIX, toParams } from '@gauzy/ui-core/common';
import { firstValueFrom } from 'rxjs';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class AuthService {
    constructor(http) {
        this.http = http;
    }
    isAuthenticated() {
        return firstValueFrom(this.http.get(`${API_PREFIX}/auth/authenticated`));
    }
    confirmEmail(body) {
        return this.http.post(`${API_PREFIX}/auth/email/verify`, body);
    }
    login(loginInput) {
        return this.http.post(`${API_PREFIX}/auth/login`, loginInput);
    }
    /**
     * Sign in to workspaces with the provided input.
     *
     * @param input - The input containing user login information.
     * @returns An observable of the response for signing in to workspaces.
     */
    findWorkspaces(input) {
        try {
            // Send a POST request to the server endpoint with the provided input
            return this.http.post(`${API_PREFIX}/auth/signin.email.password`, input);
        }
        catch (error) {
            console.log('Error while signing in workspaces: %s', error?.message);
            // Handle errors appropriately (e.g., log, throw, etc.)
            throw error;
        }
    }
    /**
     *
     */
    sendSigninCode(input) {
        try {
            // Send a POST request to the server endpoint with the provided input
            return this.http.post(`${API_PREFIX}/auth/signin.email`, input);
        }
        catch (error) {
            console.log('Error while sending magic code: %s', error?.message);
            // Handle errors appropriately (e.g., log, throw, etc.)
            throw error;
        }
    }
    /**
     *
     */
    confirmSignInByCode(input) {
        try {
            // Send a POST request to the server endpoint with the provided input
            return this.http.post(`${API_PREFIX}/auth/signin.email/confirm`, input);
        }
        catch (error) {
            console.log('Error while confirm signin by email & magic code: %s', error?.message);
            // Handle errors appropriately (e.g., log, throw, etc.)
            throw error;
        }
    }
    /**
     * Sign in to a specific tenant workspace using the provided input.
     *
     * @param input - The input containing user email and token.
     * @returns An observable of the response for signing in to the specific tenant workspace.
     */
    signinWorkspaceByToken(input) {
        try {
            // Send a POST request to the server endpoint with the provided input
            return this.http.post(`${API_PREFIX}/auth/signin.workspace`, input);
        }
        catch (error) {
            console.log('Error while signing in specific tenant workspace: %s', error?.message);
            // Handle errors appropriately (e.g., log, throw, etc.)
            throw error;
        }
    }
    /**
     * Logout API Route
     *
     * @returns
     */
    doLogout(refreshToken) {
        return this.http.post(`${API_PREFIX}/auth/logout`, { refresh_token: refreshToken });
    }
    register(input) {
        return this.http.post(`${API_PREFIX}/auth/register`, input);
    }
    /**
     * The legal documents a new account must accept, as currently published.
     *
     * Fetched rather than hard-coded so the version and the sha256 the user is
     * shown are the ones the server will accept — and so the object that gates
     * the submit button is the same object that gets posted back. Hard-coding a
     * version in the client is how a checkbox ends up meaning nothing.
     */
    getRequiredTermsDocuments(locale) {
        return this.http.get(`${API_PREFIX}/terms/required`, {
            params: toParams(locale ? { locale } : {})
        });
    }
    requestPassword(requestPasswordInput) {
        return this.http.post(`${API_PREFIX}/auth/request-password`, requestPasswordInput);
    }
    resetPassword(resetPasswordInput) {
        return this.http.post(`${API_PREFIX}/auth/reset-password`, resetPasswordInput);
    }
    /**
     * Checks if the current user has the specified roles.
     *
     * @param {RolesEnum[]} roles - An array of roles to check.
     * @return {Observable<boolean>} An observable that emits a boolean indicating whether the user has the specified roles.
     */
    hasRole(roles) {
        return this.http.get(`${API_PREFIX}/auth/role`, {
            params: toParams({ roles })
        });
    }
    /**
     * Checks if the user has the specified permissions.
     *
     * @param {...PermissionsEnum[]} permissions - The permissions to check.
     * @return {Observable<boolean>} An observable that emits a boolean indicating whether the user has the specified permissions.
     */
    hasPermissions(...permissions) {
        return this.http.get(`${API_PREFIX}/auth/permissions`, {
            params: toParams({ permissions })
        });
    }
    /**
     * GET access token from refresh token
     *
     * @param refresh_token
     * @returns
     */
    refreshToken(refresh_token) {
        return firstValueFrom(this.http.post(`${API_PREFIX}/auth/refresh-token`, { refresh_token }));
    }
    /**
     * Get all workspaces (tenants) that the current authenticated user has access to.
     *
     * @param includeTeams - Whether to include teams in the response (default: false).
     * @returns An observable of the user signin workspace response.
     */
    getUserWorkspaces(includeTeams = false) {
        return this.http.get(`${API_PREFIX}/auth/workspaces`, {
            params: toParams({ includeTeams })
        });
    }
    /**
     * Switch the current user to a different workspace (tenant).
     *
     * @param tenantId - The ID of the tenant to switch to.
     * @returns An observable of the authentication response with new tokens or null if switching fails.
     */
    switchWorkspace(tenantId) {
        return this.http.post(`${API_PREFIX}/auth/switch-workspace`, { tenantId });
    }
    /**
     * Switch the current user to a different organization within the same workspace.
     *
     * @param organizationId - The ID of the organization to switch to.
     * @returns An observable of the authentication response with new tokens or null if switching fails.
     */
    switchOrganization(organizationId) {
        return this.http.post(`${API_PREFIX}/auth/switch-organization`, { organizationId });
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthService }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AuthService, decorators: [{
            type: Injectable
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=auth.service.js.map