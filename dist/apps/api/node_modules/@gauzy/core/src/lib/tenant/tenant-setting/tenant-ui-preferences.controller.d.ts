import { CommandBus } from '@nestjs/cqrs';
import { ITenantUiPreferences } from '@gauzy/contracts';
import { TenantSettingService } from './tenant-setting.service';
import { UiPreferencesConfigDTO } from './dto';
/**
 * Tenant-wide UI preferences (currently: Angular vs React for the pages that ship in both).
 *
 * Deliberately a separate controller from `TenantSettingController`: that one is gated by
 * `TENANT_SETTING` as a whole, but the preference must be READABLE by every signed-in user of the
 * tenant (the dashboard picks the flavour to render from it), while only administrators may
 * CHANGE it. The values are resolved straight from the service — never from the request-scoped
 * settings cache — so a save is visible on the very next request.
 */
export declare class TenantUiPreferencesController {
    private readonly tenantSettingService;
    private readonly commandBus;
    constructor(tenantSettingService: TenantSettingService, commandBus: CommandBus);
    getUiPreferences(): Promise<ITenantUiPreferences>;
    updateUiPreferences(input: UiPreferencesConfigDTO): Promise<ITenantUiPreferences>;
}
