"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileProcessorContext = void 0;
class FileProcessorContext {
    constructor(strategy) {
        this.strategy = strategy;
    }
    setStrategy(strategy) {
        this.strategy = strategy;
    }
    async process(files, provider) {
        return this.strategy.process(files, provider);
    }
}
exports.FileProcessorContext = FileProcessorContext;
//# sourceMappingURL=file-processor.context.js.map