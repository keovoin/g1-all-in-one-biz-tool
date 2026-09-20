import { CanActivateFn } from '@angular/router';
/**
 * Defensive FEATURE_DOCUMENTS double-gate. Plugin activation gating protects
 * bootstrap, not deep links pasted after a feature flip — this guard covers
 * the deep-link case and redirects to the dashboard.
 */
export declare const docsFeatureGuard: CanActivateFn;
