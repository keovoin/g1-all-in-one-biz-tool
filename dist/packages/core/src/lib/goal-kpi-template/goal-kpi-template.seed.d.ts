import { IOrganization, ITenant } from '@gauzy/contracts';
import { DataSource } from 'typeorm';
import { GoalKPITemplate } from './goal-kpi-template.entity';
export declare const createDefaultGoalKpiTemplate: (dataSource: DataSource, tenant: ITenant, organization: IOrganization) => Promise<GoalKPITemplate[]>;
