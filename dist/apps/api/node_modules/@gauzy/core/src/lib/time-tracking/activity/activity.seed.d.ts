import { DataSource } from 'typeorm';
import { ITenant, ITimeSlot } from '@gauzy/contracts';
import { Activity } from './activity.entity';
export declare const AppsNames: string[];
/**
 * Creates random activities for the given tenant and time slots.
 *
 * @param dataSource - The TypeORM data source.
 * @param tenant - The tenant for which activities are created.
 * @param timeSlots - The time slots to associate with activities.
 * @returns A promise that resolves to an array of created activities.
 */
export declare const createRandomActivities: (dataSource: DataSource, tenant: ITenant, timeSlots: ITimeSlot[]) => Promise<Activity[]>;
