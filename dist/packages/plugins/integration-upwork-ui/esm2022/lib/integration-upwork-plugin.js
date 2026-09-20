import { PermissionsEnum } from '@gauzy/contracts';
import { IntegrationUpworkUiModule } from './integration-upwork-ui.module';
import { INTEGRATION_UPWORK_PAGE_ROUTE } from './integration-upwork.routes';
/**
 * Integration Upwork plugin definition.
 *
 * Registers the /pages/integrations/upwork route.
 */
export const IntegrationUpworkPlugin = {
    id: 'integration-upwork',
    // ── Versioning & Compatibility ────────────────────────────────
    version: '0.1.0',
    // ── Location & Module ────────────────────────────────────────
    location: 'integrations-sections',
    module: IntegrationUpworkUiModule,
    // ── Access Control ───────────────────────────────────────────
    permissionKeys: [PermissionsEnum.INTEGRATION_VIEW],
    // ── Routes ───────────────────────────────────────────────────
    routes: [INTEGRATION_UPWORK_PAGE_ROUTE]
};
//# sourceMappingURL=integration-upwork-plugin.js.map