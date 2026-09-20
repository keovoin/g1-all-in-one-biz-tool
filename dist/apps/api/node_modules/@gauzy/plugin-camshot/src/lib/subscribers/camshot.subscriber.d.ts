import { BaseEntityEventSubscriber } from '@gauzy/core';
import { DataSource, InsertEvent, RemoveEvent } from 'typeorm';
import { Camshot } from '../entity/camshot.entity';
export declare class CamshotSubscriber extends BaseEntityEventSubscriber<Camshot> {
    readonly dataSource: DataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    listenTo(): typeof Camshot;
    private validateEntityFields;
    private logWarnMissingFields;
    private logError;
    beforeInsert(event: InsertEvent<Camshot>): Promise<void>;
    afterRemove(event: RemoveEvent<Camshot>): Promise<void>;
    private getFileStorageProvider;
}
