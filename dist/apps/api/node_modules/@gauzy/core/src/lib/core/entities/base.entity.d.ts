import { BaseEntityModel as IBaseEntityModel, ID, IUser } from '@gauzy/contracts';
/**
 * Abstract base class for dynamically assigning properties.
 */
export declare abstract class Model {
    constructor(input?: any);
}
/**
 * Base entity class with soft-delete functionality.
 * All entities that extend this class will have soft-delete capability.
 */
export declare abstract class SoftDeletableBaseEntity extends Model {
    deletedAt?: Date;
}
/**
 * Represents an entity with automatic timestamp management for creation and updates.
 * Extends the `SoftDeletableBaseEntity` to include support for soft deletes.
 */
export declare abstract class AccessTimestamps extends SoftDeletableBaseEntity {
    /**
     * Date when the record was created.
     * Automatically set at the time of entity creation.
     */
    createdAt?: Date;
    /**
     * Date when the record was last updated.
     * Automatically updated whenever the entity is modified.
     */
    updatedAt?: Date;
    /**
     * Utility function to get the current date.
     * Used to set `createdAt` and `updatedAt` timestamps.
     *
     * @returns {Date} - The current date.
     */
    static getCurrentDate(): Date;
}
/**
 * BaseEntityActionByUser provides a generic template for tracking
 * user actions (create) performed on an entity.
 */
export declare abstract class BaseEntityActionByUser extends AccessTimestamps {
    /**
     * The user who created the record.
     */
    createdByUser?: IUser;
    /**
     * The ID of the user who created the record.
     */
    createdByUserId?: ID;
    /**
     * The user who last updated the record.
     */
    updatedByUser?: IUser;
    /**
     * The ID of the user who last updated the record.
     */
    updatedByUserId?: ID;
    /**
     * The user who performed the deletion.
     */
    deletedByUser?: IUser;
    /**
     * The ID of the user who performed the deletion.
     */
    deletedByUserId?: ID;
}
/**
 * Abstract base entity with common fields for UUID, creation, update timestamps, soft-delete, and more.
 */
export declare abstract class BaseEntity extends BaseEntityActionByUser implements IBaseEntityModel {
    id?: ID;
    isActive?: boolean;
    isArchived?: boolean;
    archivedAt?: Date;
}
