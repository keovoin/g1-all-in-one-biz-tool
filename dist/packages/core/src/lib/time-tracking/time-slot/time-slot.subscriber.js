"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeSlotSubscriber = void 0;
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const moment = require("moment");
const utils_1 = require("@gauzy/utils");
const time_slot_entity_1 = require("./time-slot.entity");
const file_storage_1 = require("./../../core/file-storage");
const base_entity_event_subscriber_1 = require("../../core/entities/subscribers/base-entity-event.subscriber");
let TimeSlotSubscriber = class TimeSlotSubscriber extends base_entity_event_subscriber_1.BaseEntityEventSubscriber {
    /**
     * Indicates that this subscriber only listen to TimeSlot events.
     */
    listenTo() {
        return time_slot_entity_1.TimeSlot;
    }
    /**
     * Called after a TimeSlot entity is loaded from the database. This method updates
     * the entity with additional calculated properties.
     *
     * @param entity The TimeSlot entity that has been loaded.
     * @returns {Promise<void>} A promise that resolves when the post-load processing is complete.
     */
    async afterEntityLoad(entity) {
        try {
            // Update 'stoppedAt' time based on 'startedAt'
            if (Object.prototype.hasOwnProperty.call(entity, 'startedAt')) {
                entity.stoppedAt = moment(entity.startedAt).add(10, 'minutes').toDate();
            }
            // Calculate activity percentages
            if (Object.prototype.hasOwnProperty.call(entity, 'overall')) {
                entity.percentage = this.calculateOverallActivity(entity);
            }
            if (Object.prototype.hasOwnProperty.call(entity, 'keyboard')) {
                entity.keyboardPercentage = this.calculateKeyboardActivity(entity);
            }
            if (Object.prototype.hasOwnProperty.call(entity, 'mouse')) {
                entity.mousePercentage = this.calculateMouseActivity(entity);
            }
        }
        catch (error) {
            console.error('TimeSlotSubscriber: An error occurred during the afterEntityLoad process:', error);
        }
    }
    /**
     * Called after a TimeSlot entity is removed from the database. This method handles the
     * deletion of associated screenshot files from the storage.
     *
     * @param entity The TimeSlot entity that was just deleted.
     * @returns {Promise<void>} A promise that resolves when the file deletion operations are complete.
     */
    async afterEntityDelete(entity) {
        try {
            const { screenshots } = entity ?? {};
            const entityId = entity?.id;
            if (entityId && Array.isArray(screenshots) && (0, utils_1.isNotEmpty)(screenshots)) {
                console.log(`AFTER TIME_SLOT WITH ID ${entityId} REMOVED`);
                // Create FileStorage instance outside the loop if possible
                const storage = new file_storage_1.FileStorage();
                // Prepare all deletion promises
                const promises = screenshots.flatMap((screenshot) => {
                    if (!screenshot)
                        return [];
                    // Get the provider instance for the screenshot's storage provider
                    const instance = storage.getProvider(screenshot?.storageProvider).getProviderInstance();
                    // Get the paths for the screenshot's file and thumbnail
                    const paths = [screenshot?.file, screenshot?.thumb].filter(Boolean);
                    console.log('screenshot delete paths', paths);
                    // Create deletion promises for each file
                    return paths.map((filePath) => instance.deleteFile(filePath)); // Create deletion promise for each file
                });
                // Execute all deletion promises in parallel
                await Promise.all(promises);
            }
        }
        catch (error) {
            console.error('TimeSlotSubscriber: An error occurred during the afterEntityDelete process:', error);
        }
    }
    /**
     * Calculates the activity percentage based on activity time and total duration.
     * If the duration is zero, the function returns zero to avoid division by zero errors.
     *
     * @param activity The amount of time spent on a specific activity.
     * @param duration The total duration for which the activity is calculated.
     * @returns The activity as a percentage of the total duration, rounded to two decimal places.
     */
    calculateActivity(activity, duration) {
        if (duration === 0)
            return 0;
        return parseFloat(Math.round((activity * 100) / duration).toFixed(2));
    }
    /**
     * Calculate overall activity in percentage
     *
     * @param entity
     * @returns
     */
    calculateOverallActivity(entity) {
        return this.calculateActivity(entity.overall, entity.duration);
    }
    /**
     * Calculate mouse activity in percentage
     *
     * @param entity
     * @returns
     */
    calculateMouseActivity(entity) {
        return this.calculateActivity(entity.mouse, entity.duration);
    }
    /**
     * Calculate keyboard activity in percentage
     *
     * @param entity
     * @returns
     */
    calculateKeyboardActivity(entity) {
        return this.calculateActivity(entity.keyboard, entity.duration);
    }
};
exports.TimeSlotSubscriber = TimeSlotSubscriber;
exports.TimeSlotSubscriber = TimeSlotSubscriber = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)()
], TimeSlotSubscriber);
//# sourceMappingURL=time-slot.subscriber.js.map