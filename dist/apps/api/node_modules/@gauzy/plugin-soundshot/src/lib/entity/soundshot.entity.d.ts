import { FileStorageProviderEnum, ID, IEmployee, ITimeSlot, IUser } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { ISoundshot } from '../models/soundshot.model';
export declare class Soundshot extends TenantOrganizationBaseEntity implements ISoundshot {
    /**
     * Name of the soundshot.
     * This is a required field with a maximum length of 255 characters.
     */
    name: string;
    /**
     * Soundshot file path or identifier.
     * Must be a valid audio file with a valid name format.
     */
    fileKey: string;
    /**
     * Storage provider used for storing the soundshot file.
     * Optional and must match one of the predefined storage providers.
     */
    storageProvider: FileStorageProviderEnum;
    /**
     * Date when the soundshot was recorded.
     * This is optional and must be a valid past ISO 8601 date string.
     */
    recordedAt?: Date;
    /**
     * Full URL to access the soundshot.
     * Optional and must be a valid HTTP or HTTPS URL.
     */
    fullUrl?: string;
    /**
     * Size of the soundshot file in bytes.
     * Optional with a maximum size limit of 100MB (104857600 bytes).
     */
    size?: number;
    /**
     * Number of audio channels in the soundshot file.
     */
    channels?: number;
    /**
     * Rate of the soundshot file.
     * Sample rate of the soundshot file in Hz (e.g., 44100, 48000).
     */
    rate?: number;
    /**
     * Duration of the soundshot file in seconds.
     */
    duration?: number;
    /**
     * Represents the associated TimeSlot for the soundshot.
     * This is an optional many-to-one relationship with cascading delete.
     */
    timeSlot?: ITimeSlot;
    /**
     * Represents the ID of the associated TimeSlot.
     * This is an optional UUID (version 4) used as a foreign key reference.
     */
    timeSlotId?: ID;
    /**
     * Represents the Employee who uploaded the soundshot.
     * This is an optional many-to-one relationship with cascading delete.
     */
    uploadedBy?: IEmployee;
    /**
     * Represents the ID of the Employee who uploaded the soundshot.
     * This is an optional UUID (version 4) used as a foreign key reference.
     */
    uploadedById?: ID;
    /**
     * Represents the User who uploaded the soundshot.
     * This is an optional many-to-one relationship with cascading delete.
     */
    user?: IUser;
    /**
     * Represents the ID of the User who uploaded the soundshot.
     * This is an optional UUID (version 4) used as a foreign key reference.
     */
    userId?: ID;
}
