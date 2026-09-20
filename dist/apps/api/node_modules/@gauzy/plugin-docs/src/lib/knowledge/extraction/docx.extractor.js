"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocxExtractor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const mammoth = require("mammoth");
const errors_1 = require("../errors");
const extractor_interface_1 = require("./extractor.interface");
const html_extractor_1 = require("./html.extractor");
/** The ZIP local-file-header signature — a legacy binary `.doc` never starts with it. */
const ZIP_SIGNATURE = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
/**
 * DOCX extractor: docx → semantic HTML (mammoth) → markdown (turndown + GFM, pipe tables
 * preserved). Legacy binary `.doc` is a permanent error with an actionable message.
 */
let DocxExtractor = class DocxExtractor {
    /**
     * @inheritdoc
     */
    supports(mime) {
        return mime === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
    /**
     * @inheritdoc
     */
    async extract(buffer, ctx) {
        if (buffer.length < 4 || !buffer.subarray(0, 4).equals(ZIP_SIGNATURE)) {
            throw new errors_1.DocsPermanentError('Legacy .doc is not supported — save as .docx and re-upload.');
        }
        let html;
        let warnings;
        try {
            const result = await mammoth.convertToHtml({ buffer });
            html = result.value ?? '';
            const messages = (result.messages ?? [])
                .filter((message) => message?.type === 'warning')
                .map((message) => String(message.message).slice(0, 200))
                .slice(0, 10);
            warnings = messages.length > 0 ? messages : undefined;
        }
        catch (error) {
            throw new errors_1.DocsPermanentError('The document could not be read — it may be corrupt or password-protected.', error);
        }
        const converted = (0, html_extractor_1.createTurndown)().turndown(html);
        const normalized = (0, extractor_interface_1.normalizeMarkdown)(converted);
        const { markdown, truncated } = (0, extractor_interface_1.capMarkdown)(normalized, ctx.maxChars);
        return {
            markdown,
            metadata: { truncated, warnings, wordCount: (0, extractor_interface_1.countWords)(markdown) }
        };
    }
};
exports.DocxExtractor = DocxExtractor;
exports.DocxExtractor = DocxExtractor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], DocxExtractor);
//# sourceMappingURL=docx.extractor.js.map