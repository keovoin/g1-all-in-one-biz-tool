"use strict";
var SoundshotSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoundshotSubscriber = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const soundshot_entity_1 = require("../entity/soundshot.entity");
const soundshot_service_1 = require("../services/soundshot.service");
let SoundshotSubscriber = SoundshotSubscriber_1 = class SoundshotSubscriber extends core_1.BaseEntityEventSubscriber {
    constructor(dataSource, soundshotService) {
        super();
        this.dataSource = dataSource;
        this.soundshotService = soundshotService;
        this.logger = new common_1.Logger(SoundshotSubscriber_1.name);
        dataSource.subscribers.push(this);
    }
    listenTo() {
        return soundshot_entity_1.Soundshot;
    }
    validateAndHandleMissingFields(entity, context) {
        if (!entity) {
            this.logger.warn(`Attempted to process a null/undefined Soundshot entity in ${context}.`);
            return false;
        }
        const missingFields = [];
        if (!entity.storageProvider)
            missingFields.push('storageProvider');
        if (!entity.fileKey)
            missingFields.push('fileKey');
        if (missingFields.length > 0) {
            this.logger.warn(`Missing ${missingFields.join(', ')} for Soundshot entity with ID ${entity.id ?? 'N/A'} in ${context}`);
            return false;
        }
        return true;
    }
    logError(entity, context, error) {
        this.logger.error(`Error in ${context} for Soundshot entity with ID ${entity.id ?? 'N/A'}.`, error);
    }
    async beforeInsert(event) {
        const entity = event.entity;
        if (!this.validateAndHandleMissingFields(entity, 'beforeInsert')) {
            return;
        }
        try {
            const provider = this.soundshotService.getFileStorageProviderInstance(entity.storageProvider);
            const fullUrl = await provider.url(entity.fileKey);
            entity.fullUrl = fullUrl;
            this.logger.log(`Generated URL for Soundshot entity with ID ${entity.id ?? 'N/A'}`);
        }
        catch (error) {
            this.logError(entity, 'beforeInsert', error);
            throw error;
        }
    }
    async afterRemove(event) {
        const entity = event.entity;
        if (!this.validateAndHandleMissingFields(entity, 'afterRemove')) {
            return;
        }
        try {
            const provider = this.soundshotService.getFileStorageProviderInstance(entity.storageProvider);
            await provider.deleteFile(entity.fileKey);
            this.logger.log(`Successfully deleted file for Soundshot entity with ID ${entity.id}`);
        }
        catch (error) {
            this.logError(entity, 'afterRemove', error);
        }
    }
};
exports.SoundshotSubscriber = SoundshotSubscriber;
exports.SoundshotSubscriber = SoundshotSubscriber = SoundshotSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource, soundshot_service_1.SoundshotService])
], SoundshotSubscriber);
//# sourceMappingURL=soundshot.subscriber.js.map