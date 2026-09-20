import { DataSource } from 'typeorm';
import { ApplicationPluginConfig } from '@gauzy/common';
import { ITimeSlot, ITenant, ITimesheet } from '@gauzy/contracts';
/**
 * Generates and saves random time logs for the provided timesheets.
 *
 * This function creates random time logs for each timesheet provided in the `timeSheets` array.
 * It uses the provided data source to interact with the database and save the generated time logs.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source used to execute queries.
 * @param {Partial<ApplicationPluginConfig>} config - Configuration for generating random data (e.g., settings, paths).
 * @param {ITenant} tenant - The tenant to associate with the generated time logs.
 * @param {ITimesheet[]} timeSheets - An array of timesheets for which random time logs will be created.
 * @returns {Promise<void>} - A promise that resolves when the time logs have been generated and saved.
 */
export declare const createRandomTimeLogs: (dataSource: DataSource, config: Partial<ApplicationPluginConfig>, tenant: ITenant, timeSheets: ITimesheet[]) => Promise<ITimeSlot[]>;
/**
 * Recalculates the activity for the given timesheets by interacting with the data source.
 *
 * This function performs recalculation of activities for a list of timesheets. It may involve
 * querying the database using the provided data source to update activity metrics based on the
 * timesheet records.
 *
 * @param {DataSource} dataSource - The database connection or ORM data source used to execute queries.
 * @param {ITimesheet[]} timesheets - An array of timesheet objects to process and recalculate activities for.
 * @returns {Promise<void>} - A promise that resolves when the recalculation process is complete.
 */
export declare const recalculateTimesheetActivity: (dataSource: DataSource, timesheets: ITimesheet[]) => Promise<void>;
