import { Route } from '@angular/router';
import { PageRouteRegistryService } from '@gauzy/ui-core/core';
/**
 * Builds the internal route table for /pages/documents: shell (tree column +
 * router-outlet + detail panel host) with the browse list, the lazily loaded
 * page editor (the full TipTap editor stack is one chunk behind this route —
 * spec 05 §12), the review queue, and any routes other plugins contributed at
 * the 'documents-sections' location.
 */
export declare function createDocsRoutes(registry: PageRouteRegistryService): Route[];
