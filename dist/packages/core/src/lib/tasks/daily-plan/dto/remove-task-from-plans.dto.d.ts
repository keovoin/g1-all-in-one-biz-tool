/**
 * Delete a task from many / all daily plans
 */
import { IDailyPlan, IDailyPlansTasksUpdateInput, IEmployee } from '@gauzy/contracts';
import { TenantOrganizationBaseDTO } from '../../../core/dto';
declare const RemoveTaskFromManyPlansDTO_base: import("@nestjs/common").Type<TenantOrganizationBaseDTO>;
export declare class RemoveTaskFromManyPlansDTO extends RemoveTaskFromManyPlansDTO_base implements IDailyPlansTasksUpdateInput {
    readonly employeeId?: IEmployee['id'];
    plansIds: IDailyPlan['id'][];
}
export {};
