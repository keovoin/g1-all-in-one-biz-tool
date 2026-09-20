import { PlaygroundPageComponent } from './playground-page.component';
/** Path segment for the AI Playground under /pages. */
export const PLAYGROUND_PATH = 'playground';
/**
 * Route config for the AI Playground page.
 * Registered at `page-sections` so it appears as /pages/playground.
 */
export const PLAYGROUND_ROUTE = {
    location: 'page-sections',
    path: PLAYGROUND_PATH,
    component: PlaygroundPageComponent
};
//# sourceMappingURL=playground.routes.js.map