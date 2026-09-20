import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { ICamshot } from '../models/camshot.model';
import { ITimeSlot, FileStorageProviderEnum, IUser, ID, IEmployee } from '@gauzy/contracts';
export declare class Camshot extends TenantOrganizationBaseEntity implements ICamshot {
    /**
     * Title of the camshot.
     * This is a required field with a maximum length of 255 characters.
     */
    title: string;
    /**
     * Camshot file path or identifier.
     * Must be a valid image file with a valid name format.
     */
    fileKey: string;
    /**
     * Camshot file path or identifier.
     * Must be a valid image file with a valid name format.
     */
    thumbKey?: string;
    /**
     * Storage provider used for storing the camshot file.
     * Optional and must match one of the predefined storage providers.
     */
    storageProvider: FileStorageProviderEnum;
    /**
     * Date when the camshot was recorded.
     * This is optional and must be a valid past ISO 8601 date string.
     */
    recordedAt?: Date;
    /**
     * Full URL to access the camshot.
     * Optional and must be a valid HTTP or HTTPS URL.
     */
    fullUrl?: string;
    /**
     * Thumb URL to access the camshot.
     * Optional and must be a valid HTTP or HTTPS URL.
     */
    thumbUrl?: string;
    /**
     * Size of the camshot file in bytes.
     * Optional with a maximum size limit of 5MB (5242880 bytes).
     */
    size?: number;
    /**
     * Represents the associated TimeSlot for the camshot.
     * This is an optional many-to-one relationship with cascading delete.
     */
    timeSlot?: ITimeSlot;
    /**
     * Represents the ID of the associated TimeSlot.
     * This is an optional UUID (version 4) used as a foreign key reference.
     */
    timeSlotId?: ID;
    /**
     * Represents the Employee who uploaded the camshot.
     * This is an optional many-to-one relationship with cascading delete.
     */
    uploadedBy?: IEmployee;
    /**
     * Represents the ID of the Employee who uploaded the camshot.
     * This is an optional UUID (version 4) used as a foreign key reference.
     */
    uploadedById?: ID;
    /**
     * Represents the User who uploaded the camshot.
     * This is an optional many-to-one relationship with cascading delete.
     */
    user?: IUser;
    /**
     * Represents the ID of the User who uploaded the camshot.
     * This is an optional UUID (version 4) used as a foreign key reference.
     */
    userId?: ID;
}
