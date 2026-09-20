"use strict";
var CamshotSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CamshotSubscriber = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@gauzy/core");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const camshot_entity_1 = require("../entity/camshot.entity");
let CamshotSubscriber = CamshotSubscriber_1 = class CamshotSubscriber extends core_1.BaseEntityEventSubscriber {
    constructor(dataSource) {
        super();
        this.dataSource = dataSource;
        this.logger = new common_1.Logger(CamshotSubscriber_1.name);
        dataSource.subscribers.push(this);
    }
    listenTo() {
        return camshot_entity_1.Camshot;
    }
    validateEntityFields(entity) {
        const missingFields = [];
        if (!entity.storageProvider)
            missingFields.push('storageProvider');
        if (!entity.fileKey)
            missingFields.push('fileKey');
        if (!entity.thumbKey)
            missingFields.push('thumbKey');
        return { valid: missingFields.length === 0, missingFields };
    }
    logWarnMissingFields(entity, context, missingFields) {
        this.logger.warn(`Missing ${missingFields.join(', ')} for Camshot entity with ID ${entity.id ?? 'N/A'} in ${context}`);
    }
    logError(entity, context, error) {
        this.logger.error(`Error in ${context} for Camshot entity with ID ${entity.id ?? 'N/A'}: ${error.message}`);
    }
    async beforeInsert(event) {
        const entity = event.entity;
        if (!entity) {
            this.logger.warn(`Attempted to insert a null/undefined Camshot entity in beforeInsert.`);
            return;
        }
        const { valid, missingFields } = this.validateEntityFields(entity);
        if (!valid) {
            this.logWarnMissingFields(entity, 'beforeInsert', missingFields);
            return;
        }
        try {
            const provider = this.getFileStorageProvider(entity.storageProvider);
            const [fullUrl, thumbUrl] = await Promise.all([
                provider.url(entity.fileKey),
                provider.url(entity.thumbKey)
            ]);
            entity.fullUrl = fullUrl;
            entity.thumbUrl = thumbUrl;
            this.logger.log(`Generated URL for Camshot entity with ID ${entity.id ?? 'N/A'}`);
        }
        catch (error) {
            this.logError(entity, 'beforeInsert', error);
        }
    }
    async afterRemove(event) {
        const entity = event.entity;
        if (!entity || !(entity instanceof camshot_entity_1.Camshot)) {
            this.logger.warn(`Attempted to remove a null/undefined or invalid Camshot entity in afterRemove.`);
            return;
        }
        const { valid, missingFields } = this.validateEntityFields(entity);
        if (!valid) {
            this.logWarnMissingFields(entity, 'afterRemove', missingFields);
            return;
        }
        try {
            const provider = this.getFileStorageProvider(entity.storageProvider);
            await Promise.all([
                provider.deleteFile(entity.fileKey),
                provider.deleteFile(entity.thumbKey)
            ]);
            this.logger.log(`Successfully deleted file for Camshot entity with ID ${entity.id}`);
        }
        catch (error) {
            this.logError(entity, 'afterRemove', error);
        }
    }
    getFileStorageProvider(storageProvider) {
        return new core_1.FileStorage().setProvider(storageProvider).getProviderInstance();
    }
};
exports.CamshotSubscriber = CamshotSubscriber;
exports.CamshotSubscriber = CamshotSubscriber = CamshotSubscriber_1 = tslib_1.__decorate([
    (0, typeorm_1.EventSubscriber)(),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.DataSource])
], CamshotSubscriber);
//# sourceMappingURL=camshot.subscriber.js.map