import { BaseEntityEventSubscriber } from '@gauzy/core';
import { DataSource, InsertEvent, RemoveEvent } from 'typeorm';
import { Soundshot } from '../entity/soundshot.entity';
import { SoundshotService } from '../services/soundshot.service';
export declare class SoundshotSubscriber extends BaseEntityEventSubscriber<Soundshot> {
    readonly dataSource: DataSource;
    private readonly soundshotService;
    private readonly logger;
    constructor(dataSource: DataSource, soundshotService: SoundshotService);
    listenTo(): typeof Soundshot;
    private validateAndHandleMissingFields;
    private logError;
    beforeInsert(event: InsertEvent<Soundshot>): Promise<void>;
    afterRemove(event: RemoveEvent<Soundshot>): Promise<void>;
}
