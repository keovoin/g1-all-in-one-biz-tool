import { ApplicationPluginConfig } from '@gauzy/common';
import { ID } from '@gauzy/contracts';
import { Screenshot } from '../../core/entities/internal';
/**
 * Generates random screenshots for a given tenant and organization within a specified time range.
 *
 * @param {Partial<ApplicationPluginConfig>} config - Configuration for asset paths and public paths.
 * @param {ID} tenantId - The unique identifier for the tenant.
 * @param {ID} organizationId - The unique identifier for the organization.
 * @param {Date} startedAt - The start timestamp for the time range.
 * @param {Date} stoppedAt - The end timestamp for the time range.
 * @returns {Promise<Screenshot[]>} - A promise that resolves with an array of generated screenshots.
 */
export declare const createRandomScreenshot: (config: Partial<ApplicationPluginConfig>, tenantId: ID, organizationId: ID, employeeId: ID, startedAt: Date, stoppedAt: Date) => Promise<Screenshot[]>;
