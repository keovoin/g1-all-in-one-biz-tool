"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageExtractor = exports.IMAGE_OCR_UNAVAILABLE_MESSAGE = exports.IMAGE_OCR_MIME_TYPES = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const errors_1 = require("../errors");
const document_ocr_service_1 = require("./document-ocr.service");
const extractor_interface_1 = require("./extractor.interface");
/** The raster image types the upload sniffer accepts (`services/file-sniffer.ts`). */
exports.IMAGE_OCR_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp', 'image/gif'];
/**
 * The message an image upload fails with when OCR cannot run.
 *
 * 🛑 Unlike classification, which degrades silently, an image with no OCR has **no content at
 * all** — there is nothing to index and nothing to search, so the honest outcome is a
 * permanent failure the reviewer can see and act on (07 §4 row 8).
 */
exports.IMAGE_OCR_UNAVAILABLE_MESSAGE = 'This image contains no machine-readable text. Text recognition (OCR) is not enabled for this deployment.';
/**
 * Image extractor: `image/png|jpeg|webp|gif` → provider-vision OCR (07 §4 row 8).
 *
 * `pageCount` is always 1. The OCR service is injected `@Optional()` so the extractor stays
 * constructible on its own (as the sibling extractors are, and as the extraction specs build
 * them) — without it, and whenever OCR is switched off or no vision model resolves, the
 * result is the same permanent error, which `DocumentProcessingService.markExtractionFailed`
 * turns into `FAILED` + `PENDING / extraction-failed`.
 */
let ImageExtractor = class ImageExtractor {
    constructor(ocrService) {
        this.ocrService = ocrService;
    }
    /**
     * @inheritdoc
     */
    supports(mime) {
        return exports.IMAGE_OCR_MIME_TYPES.includes(mime);
    }
    /**
     * @inheritdoc
     */
    async extract(buffer, ctx) {
        const ocr = this.ocrService ? await this.ocrService.transcribeImage(buffer, ctx) : null;
        if (!ocr) {
            throw new errors_1.DocsPermanentError(exports.IMAGE_OCR_UNAVAILABLE_MESSAGE);
        }
        const normalized = (0, extractor_interface_1.normalizeMarkdown)(ocr.markdown);
        const { markdown, truncated } = (0, extractor_interface_1.capMarkdown)(normalized, ctx.maxChars);
        return {
            markdown,
            metadata: {
                pageCount: 1,
                truncated,
                warnings: ocr.warnings.length ? ocr.warnings : undefined,
                wordCount: (0, extractor_interface_1.countWords)(markdown),
                ocr: ocr.provenance
            }
        };
    }
};
exports.ImageExtractor = ImageExtractor;
exports.ImageExtractor = ImageExtractor = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(0, (0, common_1.Optional)()),
    tslib_1.__metadata("design:paramtypes", [document_ocr_service_1.DocumentOcrService])
], ImageExtractor);
//# sourceMappingURL=image.extractor.js.map