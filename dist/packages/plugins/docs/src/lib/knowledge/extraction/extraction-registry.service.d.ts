import { CsvExtractor } from './csv.extractor';
import { DocxExtractor } from './docx.extractor';
import { IDocumentExtractionContext, IDocumentExtractionResult, IDocumentExtractor } from './extractor.interface';
import { HtmlExtractor } from './html.extractor';
import { ImageExtractor } from './image.extractor';
import { OdfExtractor } from './odf.extractor';
import { PdfExtractor } from './pdf.extractor';
import { PptxExtractor } from './pptx.extractor';
import { TextExtractor } from './text.extractor';
import { XlsxExtractor } from './xlsx.extractor';
/**
 * Ordered, first-match extraction provider registry.
 *
 * The built-in providers are registered at construction (each is its own `@Injectable`
 * provider class in `DocsModule`); third parties extend extraction by injecting this
 * registry and calling `register()` — providers registered later are consulted **before**
 * the built-ins, so an override for an already-supported MIME wins.
 */
export declare class ExtractionRegistryService {
    private readonly logger;
    private readonly extractors;
    constructor(pdfExtractor: PdfExtractor, docxExtractor: DocxExtractor, xlsxExtractor: XlsxExtractor, csvExtractor: CsvExtractor, textExtractor: TextExtractor, htmlExtractor: HtmlExtractor, imageExtractor?: ImageExtractor, pptxExtractor?: PptxExtractor, odfExtractor?: OdfExtractor);
    /**
     * Registers an additional extraction provider ahead of the existing ones
     * (first-match resolution — later registrations win).
     *
     * @param extractor The provider to add.
     */
    register(extractor: IDocumentExtractor): void;
    /**
     * Resolves the first provider that supports the given MIME/filename, or null.
     *
     * @param mime The sniffed canonical MIME.
     * @param filename The original filename (extension hint for providers that need it).
     */
    resolve(mime: string, filename: string): IDocumentExtractor | null;
    /**
     * Runs extraction through the first matching provider.
     *
     * @param buffer The stored file bytes.
     * @param ctx The extraction context (sniffed MIME, filename, caps).
     * @returns The normalized-markdown extraction result.
     * @throws DocsPermanentError when no provider supports the input.
     */
    extract(buffer: Buffer, ctx: IDocumentExtractionContext): Promise<IDocumentExtractionResult>;
}
