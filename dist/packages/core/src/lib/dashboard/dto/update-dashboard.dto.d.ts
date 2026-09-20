import { IDashboardUpdateInput } from '@gauzy/contracts';
import { Dashboard } from '../dashboard.entity';
import { CreateDashboardDTO } from './create-dashboard.dto';
declare const UpdateDashboardDTO_base: import("@nestjs/common").Type<Partial<CreateDashboardDTO> & Pick<Dashboard, "isDefault">>;
/**
 * Update Dashboard validation request DTO
 *
 * Extends the create DTO (all fields optional) and re-allows `isDefault`,
 * which is excluded on creation but may be toggled on update
 * (e.g. "Set as Default" from the dashboard switcher).
 */
export declare class UpdateDashboardDTO extends UpdateDashboardDTO_base implements IDashboardUpdateInput {
}
export {};
