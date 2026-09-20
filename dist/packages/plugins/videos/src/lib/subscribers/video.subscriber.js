"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VideoSubscriber = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const core_1 = require("@gauzy/core");
const video_entity_1 = require("../entities/video.entity");
let VideoSubscriber = class VideoSubscriber extends core_1.BaseEntityEventSubscriber {
    constructor(dataSource) {
        super();
        this.logger = new common_1.Logger('VideoSubscriber');
        dataSource.subscribers.push(this);
    }
    /**
     * Specifies the entity this subscriber listens to.
     */
    listenTo() {
        return video_entity_1.Video;
    }
    /**
     * Called after a video entity is loaded from the database.
     * This method assigns the full URL of the video file to the entity.
     *
     * @param entity The video entity that was loaded.
     */
    async afterEntityLoad(entity) {
        if (!(entity instanceof video_entity_1.Video)) {
            return; // Exit if the entity is not a Video instance
        }
        try {
            const { storageProvider, file } = entity;
            if (!storageProvider || !file) {
                this.logger.warn('Missing storageProvider or file in the entity');
                return;
            }
            const provider = new core_1.FileStorage().setProvider(storageProvider).getProviderInstance();
            entity.fullUrl = await provider.url(file);
        }
        catch (error) {
            this.logger.error('Error during afterEntityLoad:', error.message);
        }
    }
    /**
     * Called after a video entity is deleted from the database.
     * This method deletes the associated file from the storage system.
     *
     * @param entity The video entity that was deleted.
     */
    async afterEntityDelete(entity) {
        if (!(entity instanceof video_entity_1.Video)) {
            return; // Exit if the entity is not a Video instance
        }
        try {
            const { id: entityId, storageProvider, file } = entity;
            if (!storageProvider || !file) {
                this.logger.warn(`Missing storageProvider or file for entity ID ${entityId}`);
                return;
            }
            const provider = new core_1.FileStorage().setProvider(storageProvider).getProviderInstance();
            await provider.deleteFile(file);
            this.logger.log(`Successfully deleted file for entity ID ${entityId}`);
        }
        catch (error) {
            this.logger.error(`Error deleting file for entity ID ${entity.id}:`, error.message);
        }
    }
};
exports.VideoSubscriber = VideoSubscriber;
exports.VideoSubscriber = VideoSubscriber = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    (0, typeorm_2.EventSubscriber)(),
    tslib_1.__param(0, (0, typeorm_1.InjectDataSource)()),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.DataSource])
], VideoSubscriber);
//# sourceMappingURL=video.subscriber.js.map