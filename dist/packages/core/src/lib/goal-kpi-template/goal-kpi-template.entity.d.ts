import { IGoalKPITemplate, IEmployee } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class GoalKPITemplate extends TenantOrganizationBaseEntity implements IGoalKPITemplate {
    name: string;
    description: string;
    type: string;
    unit?: string;
    operator: string;
    lead?: IEmployee;
    currentValue?: number;
    targetValue?: number;
}
