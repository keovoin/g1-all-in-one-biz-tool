"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TextExtractor = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const extractor_interface_1 = require("./extractor.interface");
/**
 * Passthrough extractor for `text/plain` and `text/markdown`: UTF-8 normalize, strip
 * NULs, LF-only. Markdown headings in `.md` are kept and feed `headingPath` directly.
 */
let TextExtractor = class TextExtractor {
    /**
     * @inheritdoc
     */
    supports(mime) {
        return mime === 'text/plain' || mime === 'text/markdown';
    }
    /**
     * @inheritdoc
     */
    async extract(buffer, ctx) {
        const normalized = (0, extractor_interface_1.normalizeMarkdown)(buffer.toString('utf8'));
        const { markdown, truncated } = (0, extractor_interface_1.capMarkdown)(normalized, ctx.maxChars);
        return {
            markdown,
            metadata: { truncated, wordCount: (0, extractor_interface_1.countWords)(markdown) }
        };
    }
};
exports.TextExtractor = TextExtractor;
exports.TextExtractor = TextExtractor = tslib_1.__decorate([
    (0, common_1.Injectable)()
], TextExtractor);
//# sourceMappingURL=text.extractor.js.map