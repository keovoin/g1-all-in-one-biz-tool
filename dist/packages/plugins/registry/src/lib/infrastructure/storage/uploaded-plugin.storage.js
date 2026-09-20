"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadedPluginStorage = void 0;
const common_1 = require("@nestjs/common");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const file_processing_strategy_factory_1 = require("./file-processing-strategy.factory");
const file_processor_context_1 = require("./file-processor.context");
/**
 * Custom decorator to map uploaded plugin based on the specified storage provider.
 *
 * @param storageProvider - The storage provider enum.
 * @returns Promise<UploadedFile | undefined>
 *
 * @throws BadRequestException if there's an error mapping the file
 */
exports.UploadedPluginStorage = (0, common_1.createParamDecorator)(async (options, ctx) => {
    const logger = new common_1.Logger('UploadedPluginStorage');
    try {
        const request = ctx.switchToHttp().getRequest();
        const { storageProvider = contracts_1.FileStorageProviderEnum.LOCAL, multiple = false } = options;
        // Get files from request
        const files = multiple ? request?.files : request?.file;
        if (!files || (multiple && files.length === 0)) {
            return null;
        }
        // Validate multiple files case
        if (multiple && !Array.isArray(files)) {
            return [];
        }
        // Create appropriate processing strategy
        const strategy = file_processing_strategy_factory_1.FileProcessingStrategyFactory.createStrategy(multiple);
        const processor = new file_processor_context_1.FileProcessorContext(strategy);
        // Get the appropriate file storage provider
        const fileStorage = new core_1.FileStorage();
        const provider = fileStorage.getProvider(storageProvider);
        // Process files using the selected strategy
        return processor.process(files, provider);
    }
    catch (error) {
        // Log the error with structured information
        logger.error(`Error mapping uploaded file: ${error.message}`, error.stack);
        // Throw a more helpful exception with additional context
        throw new common_1.BadRequestException({
            message: 'Failed to process uploaded file',
            error: error.message,
            provider: options.storageProvider
        });
    }
});
//# sourceMappingURL=uploaded-plugin.storage.js.map