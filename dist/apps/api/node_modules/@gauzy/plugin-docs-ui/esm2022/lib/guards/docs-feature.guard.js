import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { FeatureEnum } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
/**
 * Defensive FEATURE_DOCUMENTS double-gate. Plugin activation gating protects
 * bootstrap, not deep links pasted after a feature flip — this guard covers
 * the deep-link case and redirects to the dashboard.
 */
export const docsFeatureGuard = () => {
    const store = inject(Store);
    const router = inject(Router);
    return store.hasFeatureEnabled(FeatureEnum.FEATURE_DOCUMENTS) ? true : router.parseUrl('/pages/dashboard');
};
//# sourceMappingURL=docs-feature.guard.js.map