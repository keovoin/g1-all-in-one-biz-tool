import { PluginRouteInput, PluginUiDefinition } from '@gauzy/plugin-ui';
import { DOCS_INBOUND_SETTINGS_LINK, DOCS_INBOUND_SETTINGS_PATH, DOCS_PAGE_LINK, DOCS_SECTIONS_LOCATION, DOCS_SETTINGS_LINK, DOCS_SETTINGS_PATH } from './docs.constants';
export { DOCS_INBOUND_SETTINGS_LINK, DOCS_INBOUND_SETTINGS_PATH, DOCS_PAGE_LINK, DOCS_SECTIONS_LOCATION, DOCS_SETTINGS_LINK, DOCS_SETTINGS_PATH };
/** Route registration for the Documents hub at /pages/documents. */
export declare const DOCS_PAGE_ROUTE: PluginRouteInput;
/**
 * Documents settings page at /pages/settings/documents (`04-frontend-plugin.md` §2.1).
 *
 * Registered at `settings-sections` — i.e. as a CHILD of the core settings shell —
 * so it renders with the settings menu beside it. `loadComponent` keeps the
 * standalone page out of the eagerly instantiated `DocsUiModule` and out of the
 * browse chunk.
 */
export declare const DOCS_SETTINGS_ROUTE: PluginRouteInput;
/**
 * Inbound email capture settings at /pages/settings/documents-inbound (spec 07 §17.2).
 *
 * Same shape as {@link DOCS_SETTINGS_ROUTE} — a sibling `settings-sections` child, standalone
 * and `loadComponent`-ed so the capture surface (and the two dialogs it opens) stay out of both
 * the browse chunk and the defaults-settings chunk.
 *
 * `DOCS_MANAGE` rather than `DOCS_READ`: adding a capture address opens an ingestion channel
 * into the organization, which is exactly how the backend controller gates its mutations.
 */
export declare const DOCS_INBOUND_SETTINGS_ROUTE: PluginRouteInput;
/**
 * Documents hub UI plugin (`@gauzy/plugin-docs-ui`).
 *
 * Declarative `PluginUiDefinition`: a top-level "Documents" nav section
 * (directly below Dashboards, before the `focus` entry), the
 * `/pages/documents` route, the `DOCS` translation namespace, and
 * feature/permission activation gates.
 *
 * @example In `apps/gauzy/src/plugin-ui.config.ts`:
 * ```ts
 * plugins: [DocsUiPlugin]
 * ```
 */
export declare const DocsUiPlugin: PluginUiDefinition;
