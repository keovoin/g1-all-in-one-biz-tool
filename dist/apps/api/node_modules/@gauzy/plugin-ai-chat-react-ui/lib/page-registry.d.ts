import { IAgentPageInfo } from '@gauzy/ui-core/core';
/**
 * Curated registry of Gauzy pages the AI agent can open ("canvas" navigation).
 *
 * Every `path` is grounded in the real route tree built by
 * `apps/gauzy/src/app/pages/pages.routes.ts` (plus the per-feature routing
 * modules it lazy-loads and the plugin routes registered at bootstrap, e.g.
 * the Jobs plugins). Titles and permission keys mirror the main navigation
 * menu (`BaseNavMenuComponent` in `@gauzy/ui-core/core`).
 *
 * Only parameterless list/overview pages are listed — routes that require an
 * `:id` segment (edit/view pages) are intentionally omitted.
 */
export declare const GAUZY_PAGE_REGISTRY: IAgentPageInfo[];
