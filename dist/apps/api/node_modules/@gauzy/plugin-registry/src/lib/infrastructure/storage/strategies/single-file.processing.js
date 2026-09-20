"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SingleFileProcessingStrategy = void 0;
/**
 * Strategy for processing single file
 */
class SingleFileProcessingStrategy {
    async process(file, provider) {
        return provider.mapUploadedFile(file);
    }
}
exports.SingleFileProcessingStrategy = SingleFileProcessingStrategy;
//# sourceMappingURL=single-file.processing.js.map