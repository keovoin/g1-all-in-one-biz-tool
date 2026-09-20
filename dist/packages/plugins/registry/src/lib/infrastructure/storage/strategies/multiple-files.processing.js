"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MultipleFilesProcessingStrategy = void 0;
const common_1 = require("@nestjs/common");
/**
 * Strategy for processing multiple files
 */
class MultipleFilesProcessingStrategy {
    async process(files, provider) {
        try {
            return Promise.all(files.map((file) => provider.mapUploadedFile(file)));
        }
        catch (error) {
            throw new common_1.BadRequestException(error);
        }
    }
}
exports.MultipleFilesProcessingStrategy = MultipleFilesProcessingStrategy;
//# sourceMappingURL=multiple-files.processing.js.map