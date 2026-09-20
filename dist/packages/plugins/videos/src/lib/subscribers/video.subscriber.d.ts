import { DataSource } from 'typeorm';
import { BaseEntityEventSubscriber } from '@gauzy/core';
import { Video } from '../entities/video.entity';
export declare class VideoSubscriber extends BaseEntityEventSubscriber<Video> {
    private readonly logger;
    constructor(dataSource: DataSource);
    /**
     * Specifies the entity this subscriber listens to.
     */
    listenTo(): typeof Video;
    /**
     * Called after a video entity is loaded from the database.
     * This method assigns the full URL of the video file to the entity.
     *
     * @param entity The video entity that was loaded.
     */
    afterEntityLoad(entity: Video): Promise<void>;
    /**
     * Called after a video entity is deleted from the database.
     * This method deletes the associated file from the storage system.
     *
     * @param entity The video entity that was deleted.
     */
    afterEntityDelete(entity: Video): Promise<void>;
}
