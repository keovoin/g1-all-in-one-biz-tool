import { IKeyResultTemplate, IGoalTemplate, IGoalKPITemplate } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '../core/entities/internal';
export declare class KeyResultTemplate extends TenantOrganizationBaseEntity implements IKeyResultTemplate {
    name: string;
    type: string;
    unit?: string;
    targetValue?: number;
    initialValue: number;
    deadline: string;
    kpi?: IGoalKPITemplate;
    kpiId?: string;
    goal: IGoalTemplate;
    readonly goalId?: string;
}
