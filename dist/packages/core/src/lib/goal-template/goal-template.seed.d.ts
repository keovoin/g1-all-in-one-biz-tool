import { DataSource } from 'typeorm';
import { GoalTemplate } from './goal-template.entity';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const createDefaultGoalTemplates: (dataSource: DataSource, tenant: ITenant, organization: IOrganization) => Promise<GoalTemplate[]>;
