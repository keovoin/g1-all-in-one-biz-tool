import * as i0 from "@angular/core";
/**
 * Metadata describing a navigable page for the AI agent.
 */
export interface IAgentPageInfo {
    /** Absolute route path (e.g. '/pages/tasks/dashboard'). */
    path: string;
    /** Human-readable page title. */
    title: string;
    /** Short description of what the page does / which forms it hosts. */
    description?: string;
    /** Permissions (PermissionsEnum values) required to see the page, if any. */
    permissions?: string[];
}
/** Result of an agent-triggered navigation. */
export interface IAgentNavigationResult {
    success: boolean;
    /** The URL after navigation settled. */
    url: string;
    error?: string;
}
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
export declare class AgentPageBridgeService {
    private readonly router;
    private readonly permissionsService;
    private readonly registry;
    /**
     * Register pages the agent may open. Later registrations
     * with the same path override earlier ones.
     */
    registerPages(pages: IAgentPageInfo[]): void;
    /**
     * List pages the current user is allowed to open
     * (registry entries filtered by required permissions).
     */
    listPages(): Promise<IAgentPageInfo[]>;
    /**
     * Navigate the main content area to an in-app route.
     * Only absolute in-app paths are allowed (no external URLs).
     */
    openPage(path: string, queryParams?: Record<string, string>): Promise<IAgentNavigationResult>;
    /** The current route URL and document title. */
    describeCurrentPage(): {
        url: string;
        title: string;
    };
    /**
     * Best-effort discovery of concrete (non-parameterised) routes
     * currently loaded in the router config. Lazy routes appear only
     * after they have been loaded, hence the curated registry remains
     * the primary source.
     */
    discoverLoadedRoutes(): string[];
    private normalize;
    static ɵfac: i0.ɵɵFactoryDeclaration<AgentPageBridgeService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<AgentPageBridgeService>;
}
