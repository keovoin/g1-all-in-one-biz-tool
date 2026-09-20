"use strict";
var JitsuEventsSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.JitsuEventsSubscriber = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const chalk = require("chalk");
const core_1 = require("@gauzy/core");
const config_1 = require("@gauzy/config");
const jitsu_helper_1 = require("./jitsu-helper");
// Extract configuration values from environment
const { jitsu } = config_1.environment;
/* Global Entity Subscriber - Listens to all entity inserts updates and removal then sends to Jitsu */
let JitsuEventsSubscriber = JitsuEventsSubscriber_1 = class JitsuEventsSubscriber extends core_1.BaseEntityEventSubscriber {
    constructor() {
        super();
        this.logger = new common_1.Logger(JitsuEventsSubscriber_1.name);
        // We disable by default additional logging for each event to avoid cluttering the logs
        this.logEnabled = false;
        try {
            // Destructure configuration properties
            const { serverHost, serverWriteKey, debug, echoEvents } = jitsu;
            // Ensure required configuration properties are present
            if (!serverHost || !serverWriteKey) {
                console.error(chalk.yellow('Jitsu Analytics initialization failed at JitsuEventsSubscriber: Missing host or writeKey.'));
                return;
            }
            const jitsuConfig = { host: serverHost, writeKey: serverWriteKey, debug, echoEvents };
            if (this.logEnabled) {
                this.logger.log('JITSU Configuration:', chalk.magenta(JSON.stringify(jitsuConfig)));
            }
            // Initialize Jitsu Analytics with the configuration
            this.jitsuAnalytics = (0, jitsu_helper_1.createJitsu)(jitsuConfig);
        }
        catch (error) {
            console.error(chalk.red(`Jitsu Analytics initialization error: ${error.message}`));
        }
    }
    /**
     * This method is called after an entity has been created and inserted into the database.
     * It can be used to perform additional operations or processing on the newly persisted entity.
     *
     * @param entity The entity that has just been created and inserted.
     * @param em An optional entity manager which can be either from TypeORM or MikroORM, used for additional database operations if necessary.
     * @returns {Promise<void>} A promise that resolves when the post-creation processing is complete.
     */
    async afterEntityCreate(entity) {
        try {
            if (this.logEnabled) {
                this.logger.log(`AFTER ENTITY INSERTED: `, JSON.stringify(entity));
            }
            // Track an event with Jitsu Analytics
            // NOTE: we do not await before we want to track events asynchronously
            this.analyticsTrack('afterEntityCreate', { data: { ...entity } });
        }
        catch (error) {
            // Error handling logic
            console.error('JitsuEventsSubscriber: Error during the afterEntityCreate process:', error);
        }
    }
    /**
     * This method is called after an entity has been updated in the database.
     * It can be used to perform additional operations or processing on the entity following its update.
     *
     * @param entity The entity that has just been updated.
     * @returns {Promise<void>} A promise that resolves when the post-update processing is complete.
     */
    async afterEntityUpdate(entity) {
        try {
            // Log the entity update if logging is enabled
            if (this.logEnabled) {
                this.logger.log(`AFTER ENTITY UPDATED: `, JSON.stringify(entity));
            }
            // Track the update event with Jitsu Analytics asynchronously
            this.analyticsTrack('afterEntityUpdate', { data: { entity } });
        }
        catch (error) {
            // Error handling logic
            console.error('JitsuEventsSubscriber: Error during the afterEntityUpdate process:', error);
        }
    }
    /**
     * Called after an entity is deleted from the database. This method logs the deletion and
     * tracks it with Jitsu Analytics.
     *
     * @param entity The entity that has just been deleted.
     * @param em An optional entity manager for any additional database operations, if needed.
     * @returns {Promise<void>} A promise that resolves when the post-deletion processing is complete.
     */
    async afterEntityDelete(entity) {
        try {
            // Log the entity removal if logging is enabled
            if (this.logEnabled) {
                this.logger.log('AFTER ENTITY REMOVED:', JSON.stringify(entity));
            }
            // Track the deletion event with Jitsu Analytics asynchronously
            this.analyticsTrack('afterEntityDelete', { data: { entity } });
        }
        catch (error) {
            console.error('JitsuEventsSubscriber: Error during the afterEntityDelete process:', error);
        }
    }
    /**
     * Track an analytics event using Jitsu Analytics.
     *
     * @param event The name of the event to track.
     * @param properties Optional properties to include with the event tracking.
     * @returns {Promise<void>} A promise that resolves when the tracking is complete.
     */
    async analyticsTrack(event, properties) {
        if (!this.jitsuAnalytics) {
            return;
        }
        try {
            if (this.logEnabled) {
                this.logger.log(`Before Jitsu Tracking Entity Events: ${event}`, chalk.magenta(JSON.stringify(properties)));
            }
            // Track the event
            const tracked = await this.trackEvent(event, properties);
            if (this.logEnabled) {
                this.logger.log(`After Jitsu Tracked Entity Events`, chalk.blue(JSON.stringify(tracked)));
            }
        }
        catch (error) {
            this.logger.error(`Error while Jitsu tracking event. Unable to track event: ${error.message}`);
        }
    }
    /**
     * Track an event with optional properties.
     * @param event The name of the event to track.
     * @param properties Additional data or properties associated with the event.
     * @returns A Promise that resolves when the event is tracked.
     */
    async trackEvent(event, properties) {
        return await this.jitsuAnalytics.track(event, properties);
    }
    /**
     * Identify a user with optional user traits.
     * @param id The user identifier, such as a user ID or an object representing user information.
     * @param traits User traits or properties to associate with the user.
     * @returns A Promise that resolves when the user is identified.
     */
    async identify(id, traits) {
        return await this.jitsuAnalytics.identify(id, traits);
    }
    /**
     * Group users into a specific segment or organization.
     * @param id The identifier for the group, such as a group ID or an object representing group information.
     * @param traits Additional data or traits associated with the group.
     * @returns A Promise that resolves when the users are grouped.
     */
    async group(id, traits) {
        return await this.jitsuAnalytics.group(id, traits);
    }
};
exports.JitsuEventsSubscriber = JitsuEventsSubscriber;
exports.JitsuEventsSubscriber = JitsuEventsSubscriber = JitsuEventsSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)(),
    tslib_1.__metadata("design:paramtypes", [])
], JitsuEventsSubscriber);
//# sourceMappingURL=jitsu-events.subscriber.js.map