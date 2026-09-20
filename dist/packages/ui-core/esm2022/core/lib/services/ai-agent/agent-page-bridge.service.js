import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgxPermissionsService } from 'ngx-permissions';
import * as i0 from "@angular/core";
/**
 * AgentPageBridgeService
 *
 * Lets the embedded AI agent discover and open the platform's pages
 * (rendered in the main content column — the "canvas" next to the chat).
 *
 * Pages are described by a registry seeded by the AI chat plugin
 * (see `registerPages`) and augmented with routes discovered from the
 * Angular router config. Navigation is restricted to in-app routes.
 */
export class AgentPageBridgeService {
    constructor() {
        this.router = inject(Router);
        this.permissionsService = inject(NgxPermissionsService);
        this.registry = new Map();
    }
    /**
     * Register pages the agent may open. Later registrations
     * with the same path override earlier ones.
     */
    registerPages(pages) {
        for (const page of pages) {
            this.registry.set(this.normalize(page.path), page);
        }
    }
    /**
     * List pages the current user is allowed to open
     * (registry entries filtered by required permissions).
     */
    async listPages() {
        const pages = [...this.registry.values()];
        const results = await Promise.all(pages.map(async (page) => {
            if (!page.permissions?.length)
                return page;
            const allowed = await this.permissionsService.hasPermission(page.permissions);
            return allowed ? page : null;
        }));
        return results.filter((page) => page !== null);
    }
    /**
     * Navigate the main content area to an in-app route.
     * Only absolute in-app paths are allowed (no external URLs).
     */
    async openPage(path, queryParams) {
        const normalized = this.normalize(path);
        if (!normalized.startsWith('/')) {
            return { success: false, url: this.router.url, error: `Only absolute in-app paths are allowed, got '${path}'.` };
        }
        try {
            // `normalized` may itself carry a query string (e.g. '/pages/tasks?x=1'),
            // so it must not be passed as a single router *command* (the '?…' part
            // would be treated as a literal segment). Split it, merge any inline
            // query with the explicit `queryParams`, and navigate by URL tree.
            const [pathOnly, search = ''] = normalized.split('?');
            const merged = {};
            new URLSearchParams(search).forEach((paramValue, paramKey) => {
                merged[paramKey] = paramValue;
            });
            Object.assign(merged, queryParams ?? {});
            const target = Object.keys(merged).length
                ? this.router.createUrlTree([pathOnly], { queryParams: merged })
                : pathOnly;
            const success = await this.router.navigateByUrl(target);
            return {
                success,
                url: this.router.url,
                ...(success ? {} : { error: 'Navigation was rejected (route guard or unknown route).' })
            };
        }
        catch (error) {
            return { success: false, url: this.router.url, error: error?.message ?? String(error) };
        }
    }
    /** The current route URL and document title. */
    describeCurrentPage() {
        return { url: this.router.url, title: typeof document !== 'undefined' ? document.title : '' };
    }
    /**
     * Best-effort discovery of concrete (non-parameterised) routes
     * currently loaded in the router config. Lazy routes appear only
     * after they have been loaded, hence the curated registry remains
     * the primary source.
     */
    discoverLoadedRoutes() {
        const found = [];
        const walk = (routes, prefix) => {
            for (const route of routes ?? []) {
                const segment = route.path ?? '';
                if (segment.includes('*') || segment.includes(':'))
                    continue;
                const full = [prefix, segment].filter(Boolean).join('/');
                if (route.component || route.loadComponent) {
                    found.push('/' + full);
                }
                if (route.children)
                    walk(route.children, full);
            }
        };
        walk(this.router.config, '');
        return found;
    }
    normalize(path) {
        try {
            // Strip origin if a full URL to this app was passed (the base is a
            // placeholder for relative parsing only — nothing is fetched).
            const url = new URL(path, 'https://local.invalid');
            return url.pathname + (url.search ?? '');
        }
        catch {
            return path;
        }
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AgentPageBridgeService, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AgentPageBridgeService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: AgentPageBridgeService, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=agent-page-bridge.service.js.map