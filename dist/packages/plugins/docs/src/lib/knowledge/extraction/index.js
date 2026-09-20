"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExtractionProviders = void 0;
const tslib_1 = require("tslib");
const csv_extractor_1 = require("./csv.extractor");
const document_ocr_service_1 = require("./document-ocr.service");
const docx_extractor_1 = require("./docx.extractor");
const extraction_registry_service_1 = require("./extraction-registry.service");
const html_extractor_1 = require("./html.extractor");
const image_extractor_1 = require("./image.extractor");
const odf_extractor_1 = require("./odf.extractor");
const pdf_extractor_1 = require("./pdf.extractor");
const pdf_rasterizer_service_1 = require("./pdf-rasterizer.service");
const pptx_extractor_1 = require("./pptx.extractor");
const text_extractor_1 = require("./text.extractor");
const xlsx_extractor_1 = require("./xlsx.extractor");
tslib_1.__exportStar(require("./extractor.interface"), exports);
tslib_1.__exportStar(require("./extraction-registry.service"), exports);
tslib_1.__exportStar(require("./pdf.extractor"), exports);
tslib_1.__exportStar(require("./pdf-rasterizer.service"), exports);
tslib_1.__exportStar(require("./docx.extractor"), exports);
tslib_1.__exportStar(require("./xlsx.extractor"), exports);
tslib_1.__exportStar(require("./pptx.extractor"), exports);
tslib_1.__exportStar(require("./odf.extractor"), exports);
tslib_1.__exportStar(require("./office-markdown.util"), exports);
tslib_1.__exportStar(require("./office-package.util"), exports);
tslib_1.__exportStar(require("./office-xml.util"), exports);
tslib_1.__exportStar(require("./csv.extractor"), exports);
tslib_1.__exportStar(require("./text.extractor"), exports);
tslib_1.__exportStar(require("./html.extractor"), exports);
tslib_1.__exportStar(require("./image.extractor"), exports);
tslib_1.__exportStar(require("./document-ocr.service"), exports);
tslib_1.__exportStar(require("./ocr.prompt"), exports);
/**
 * Every built-in extraction provider + the registry — spread into the `DocsModule`
 * providers array. Third parties add providers via `ExtractionRegistryService.register()`.
 *
 * `PdfRasterizerService` and `DocumentOcrService` are listed here rather than with the
 * knowledge providers because they exist for extraction: the OCR service is what turns a
 * scanned PDF or an image into markdown. (The rasterizer is also reused by the thumbnail
 * job, which injects it from this same container.)
 */
exports.ExtractionProviders = [
    pdf_rasterizer_service_1.PdfRasterizerService,
    document_ocr_service_1.DocumentOcrService,
    pdf_extractor_1.PdfExtractor,
    docx_extractor_1.DocxExtractor,
    xlsx_extractor_1.XlsxExtractor,
    pptx_extractor_1.PptxExtractor,
    odf_extractor_1.OdfExtractor,
    csv_extractor_1.CsvExtractor,
    text_extractor_1.TextExtractor,
    html_extractor_1.HtmlExtractor,
    image_extractor_1.ImageExtractor,
    extraction_registry_service_1.ExtractionRegistryService
];
//# sourceMappingURL=index.js.map