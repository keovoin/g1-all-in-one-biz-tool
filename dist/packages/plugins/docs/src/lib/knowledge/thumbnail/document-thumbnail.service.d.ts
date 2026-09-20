import { Document } from '../../entities/document.entity';
import { TypeOrmDocumentRepository } from '../../repositories/type-orm-document.repository';
import { PdfRasterizerService } from '../extraction/pdf-rasterizer.service';
import { IDocsThumbnailJob } from '../queue/docs-job.types';
/** Why one thumbnail run ended — logged by the pipeline, never surfaced to the user. */
export type ThumbnailOutcome = 'generated' | 'skipped-existing' | 'skipped-unsupported' | 'skipped-no-file' | 'failed';
/**
 * Thumbnail generation for the Documents grid (07 §4.4).
 *
 * Images are resized directly; a PDF has its first page rasterized first (through the shared
 * {@link PdfRasterizerService}, the same one scanned-PDF OCR uses). Output is one small WebP
 * written back through the **same FileStorage provider** the source lives on, adjacent to it,
 * with the key stored on `document.thumbKey`. The `DocumentSubscriber` already resolves
 * `thumbUrl` from `thumbKey` on load, so nothing else has to change for the UI to see it.
 *
 * 🛑 **This method never throws and never touches `status` or `knowledgeStatus`.** A
 * thumbnail is cosmetic: the failure mode of a missing one is a kind icon, and no upload may
 * ever be marked `FAILED` because an image could not be resized. Every failure path returns
 * an outcome the caller logs.
 *
 * Idempotent by default: a document that already has a `thumbKey` is skipped, so a
 * re-extract, a recovery sweep or a duplicate enqueue costs nothing. `force` (set by the
 * reprocess/replace paths) is the only way to regenerate.
 */
export declare class DocumentThumbnailService {
    private readonly typeOrmDocumentRepository;
    private readonly rasterizer;
    private readonly logger;
    constructor(typeOrmDocumentRepository: TypeOrmDocumentRepository, rasterizer: PdfRasterizerService);
    /**
     * Generates (or deliberately skips) the thumbnail of one document.
     *
     * @param document The snapshot-loaded document row.
     * @param job The thumbnail-job payload (tenant/organization snapshot + `force`).
     * @returns What happened — informational only; the caller never branches on failure.
     */
    generate(document: Document, job: IDocsThumbnailJob): Promise<ThumbnailOutcome>;
    /**
     * The bytes `sharp` will resize: the source itself for an image, or the rendered first
     * page for a PDF. `null` means "no thumbnail is possible here" — a PDF in a process with
     * no rasterizer installed, which is a skip and not a failure.
     */
    private sourcePixels;
}
