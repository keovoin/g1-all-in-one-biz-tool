import { BaseEntityEventSubscriber } from '../../core/entities/subscribers/base-entity-event.subscriber';
import { Activity } from './activity.entity';
export declare class ActivitySubscriber extends BaseEntityEventSubscriber<Activity> {
    /**
     * Indicates that this subscriber only listen to Activity events.
     */
    listenTo(): typeof Activity;
    /**
     * Called before an Activity entity is inserted or created in the database.
     * This method prepares the entity for insertion by (1) guaranteeing `recordedAt` holds a valid
     * timestamp and (2) serializing the metaData property to a JSON string for SQLite databases.
     *
     * @param entity The Activity entity that is about to be created.
     * @returns {Promise<void>} A promise that resolves when the pre-creation processing is complete.
     */
    beforeEntityCreate(entity: Activity): Promise<void>;
    /**
     * Called before an Activity entity is updated. Guarantees `recordedAt` here too, since a bulk
     * `save` of an entity that carries an existing id follows the update path (which does not fire
     * `beforeEntityCreate`).
     *
     * @param entity The Activity entity that is about to be updated.
     */
    beforeEntityUpdate(entity: Activity): Promise<void>;
    /**
     * Guarantees `entity.recordedAt` is a VALID timestamp regardless of the write path (bulk save,
     * single create, imports) or source. Reports/statistics filter on `recordedAt`, and a NULL or
     * `Invalid Date` value makes the row invisible to the time-range query (or fails on persist).
     * Prefer a valid explicit value, else derive it from the activity's date + time, else fall back
     * to the current time.
     *
     * @param entity The Activity entity being persisted.
     */
    private ensureRecordedAt;
}
