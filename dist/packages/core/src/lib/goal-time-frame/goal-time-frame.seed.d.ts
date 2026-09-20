import { GoalTimeFrame } from './goal-time-frame.entity';
import { DataSource } from 'typeorm';
import { IOrganization, ITenant } from '@gauzy/contracts';
export declare const createDefaultTimeFrames: (dataSource: DataSource, tenant: ITenant, organizations: IOrganization[]) => Promise<GoalTimeFrame[]>;
