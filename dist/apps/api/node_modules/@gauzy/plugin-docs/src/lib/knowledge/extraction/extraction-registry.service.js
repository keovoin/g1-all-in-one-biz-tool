"use strict";
var ExtractionRegistryService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractionRegistryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const errors_1 = require("../errors");
const csv_extractor_1 = require("./csv.extractor");
const docx_extractor_1 = require("./docx.extractor");
const html_extractor_1 = require("./html.extractor");
const image_extractor_1 = require("./image.extractor");
const odf_extractor_1 = require("./odf.extractor");
const pdf_extractor_1 = require("./pdf.extractor");
const pptx_extractor_1 = require("./pptx.extractor");
const text_extractor_1 = require("./text.extractor");
const xlsx_extractor_1 = require("./xlsx.extractor");
/**
 * Ordered, first-match extraction provider registry.
 *
 * The built-in providers are registered at construction (each is its own `@Injectable`
 * provider class in `DocsModule`); third parties extend extraction by injecting this
 * registry and calling `register()` — providers registered later are consulted **before**
 * the built-ins, so an override for an already-supported MIME wins.
 */
let ExtractionRegistryService = ExtractionRegistryService_1 = class ExtractionRegistryService {
    constructor(pdfExtractor, docxExtractor, xlsxExtractor, csvExtractor, textExtractor, htmlExtractor, imageExtractor, pptxExtractor, odfExtractor) {
        this.logger = new common_1.Logger(ExtractionRegistryService_1.name);
        this.extractors = [];
        // Built-in provider order (consulted after any third-party registrations).
        const builtIns = [
            pdfExtractor,
            docxExtractor,
            xlsxExtractor,
            csvExtractor,
            textExtractor,
            htmlExtractor,
            imageExtractor,
            pptxExtractor,
            odfExtractor
        ];
        this.extractors.push(...builtIns.filter((extractor) => Boolean(extractor)));
    }
    /**
     * Registers an additional extraction provider ahead of the existing ones
     * (first-match resolution — later registrations win).
     *
     * @param extractor The provider to add.
     */
    register(extractor) {
        this.extractors.unshift(extractor);
    }
    /**
     * Resolves the first provider that supports the given MIME/filename, or null.
     *
     * @param mime The sniffed canonical MIME.
     * @param filename The original filename (extension hint for providers that need it).
     */
    resolve(mime, filename) {
        return this.extractors.find((extractor) => extractor.supports(mime, filename)) ?? null;
    }
    /**
     * Runs extraction through the first matching provider.
     *
     * @param buffer The stored file bytes.
     * @param ctx The extraction context (sniffed MIME, filename, caps).
     * @returns The normalized-markdown extraction result.
     * @throws DocsPermanentError when no provider supports the input.
     */
    async extract(buffer, ctx) {
        const extractor = this.resolve(ctx.mimeType, ctx.filename);
        if (!extractor) {
            throw new errors_1.DocsPermanentError(`No extractor supports this file type (${ctx.mimeType}).`);
        }
        const startedAt = Date.now();
        const result = await extractor.extract(buffer, ctx);
        this.logger.log(`Extracted ${ctx.mimeType} via ${extractor.constructor?.name ?? 'extractor'} in ${Date.now() - startedAt}ms`);
        return result;
    }
};
exports.ExtractionRegistryService = ExtractionRegistryService;
exports.ExtractionRegistryService = ExtractionRegistryService = ExtractionRegistryService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__param(6, (0, common_1.Optional)()),
    tslib_1.__param(7, (0, common_1.Optional)()),
    tslib_1.__param(8, (0, common_1.Optional)()),
    tslib_1.__metadata("design:paramtypes", [pdf_extractor_1.PdfExtractor,
        docx_extractor_1.DocxExtractor,
        xlsx_extractor_1.XlsxExtractor,
        csv_extractor_1.CsvExtractor,
        text_extractor_1.TextExtractor,
        html_extractor_1.HtmlExtractor,
        image_extractor_1.ImageExtractor,
        pptx_extractor_1.PptxExtractor,
        odf_extractor_1.OdfExtractor])
], ExtractionRegistryService);
//# sourceMappingURL=extraction-registry.service.js.map