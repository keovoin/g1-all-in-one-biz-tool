import { FileStorageProvider, ID, IEmployee, ITimeSlot } from '@gauzy/contracts';
import { TenantOrganizationBaseEntity } from '@gauzy/core';
import { IVideo } from '../video.model';
export declare class Video extends TenantOrganizationBaseEntity implements IVideo {
    /**
     * Title of the video.
     * This is a required field with a maximum length of 255 characters.
     */
    title: string;
    /**
     * Video file path or identifier.
     * Must be a valid MP4 file with a valid name format.
     */
    file: string;
    /**
     * Date when the video was recorded.
     * This is optional and must be a valid past ISO 8601 date string.
     */
    recordedAt?: Date;
    /**
     * Duration of the video in seconds.
     * This is optional and must be a positive number.
     */
    duration?: number;
    /**
     * Size of the video file in bytes.
     * Optional with a maximum size limit of 10GB (10737418240 bytes).
     */
    size?: number;
    /**
     * Full URL to access the video.
     * Optional and must be a valid HTTP or HTTPS URL.
     */
    fullUrl?: string | null;
    /**
     * Description of the video.
     * Optional with a maximum length of 1000 characters.
     */
    description?: string;
    /**
     * Storage provider used for storing the video file.
     * Optional and must match one of the predefined storage providers.
     */
    storageProvider?: FileStorageProvider;
    /**
     * Video resolution in the format WIDTH:HEIGHT.
     * Optional and restricted to standard resolutions defined in VideoResolutionEnum.
     */
    resolution?: string;
    /**
     * Video codec used for encoding.
     * Optional and restricted to standard codecs defined in VideoCodecEnum.
     */
    codec?: string;
    /**
     * Video frame rate in frames per second.
     * Optional with a range from 1 to 240 fps.
     */
    frameRate?: number;
    /**
     * Represents the associated TimeSlot for the video.
     * This is an optional many-to-one relationship with cascading delete.
     */
    timeSlot?: ITimeSlot;
    /**
     * Represents the ID of the associated TimeSlot.
     * This is an optional UUID (version 4) used as a foreign key reference.
     */
    timeSlotId?: ID;
    /**
     * Represents the Employee who uploaded the video.
     * This is an optional many-to-one relationship with cascading delete.
     */
    uploadedBy?: IEmployee;
    /**
     * Represents the ID of the Employee who uploaded the video.
     * This is an optional UUID (version 4) used as a foreign key reference.
     */
    uploadedById?: ID;
}
