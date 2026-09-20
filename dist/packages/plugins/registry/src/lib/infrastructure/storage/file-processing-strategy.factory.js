"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessingStrategyFactory = void 0;
const multiple_files_processing_1 = require("./strategies/multiple-files.processing");
const single_file_processing_1 = require("./strategies/single-file.processing");
class FileProcessingStrategyFactory {
    static createStrategy(isMultiple) {
        return isMultiple ? new multiple_files_processing_1.MultipleFilesProcessingStrategy() : new single_file_processing_1.SingleFileProcessingStrategy();
    }
}
exports.FileProcessingStrategyFactory = FileProcessingStrategyFactory;
//# sourceMappingURL=file-processing-strategy.factory.js.map