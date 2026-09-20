import { BaseEntityEventSubscriber } from '../../core/entities/subscribers/base-entity-event.subscriber';
import { Timesheet } from './timesheet.entity';
export declare class TimesheetSubscriber extends BaseEntityEventSubscriber<Timesheet> {
    /**
     * Indicates that this subscriber only listen to Timesheet events.
     */
    listenTo(): typeof Timesheet;
    /**
     * Called after an Timesheet entity is loaded from the database.
     *
     * @param entity - The loaded Timesheet entity.
     * @param event - The LoadEvent associated with the entity loading.
     */
    afterEntityLoad(entity: Timesheet): Promise<void>;
}
