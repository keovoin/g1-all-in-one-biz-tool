import { IDashboardWidgetCreateInput } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
import { DashboardWidget } from '../dashboard-widget.entity';
declare const CreateDashboardWidgetDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO & DashboardWidget>;
/**
 * Create Dashboard Widget validation request DTO
 */
export declare class CreateDashboardWidgetDTO extends CreateDashboardWidgetDTO_base implements IDashboardWidgetCreateInput {
}
export {};
