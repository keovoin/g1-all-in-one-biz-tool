"use strict";
var DocumentThumbnailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentThumbnailService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const sharp = require("sharp");
const contracts_1 = require("@gauzy/contracts");
const core_1 = require("@gauzy/core");
const type_orm_document_repository_1 = require("../../repositories/type-orm-document.repository");
const pdf_rasterizer_service_1 = require("../extraction/pdf-rasterizer.service");
const thumbnail_constants_1 = require("./thumbnail.constants");
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
let DocumentThumbnailService = DocumentThumbnailService_1 = class DocumentThumbnailService {
    constructor(typeOrmDocumentRepository, rasterizer) {
        this.typeOrmDocumentRepository = typeOrmDocumentRepository;
        this.rasterizer = rasterizer;
        this.logger = new common_1.Logger(DocumentThumbnailService_1.name);
    }
    /**
     * Generates (or deliberately skips) the thumbnail of one document.
     *
     * @param document The snapshot-loaded document row.
     * @param job The thumbnail-job payload (tenant/organization snapshot + `force`).
     * @returns What happened — informational only; the caller never branches on failure.
     */
    async generate(document, job) {
        try {
            if (document.kind !== contracts_1.DocumentKindEnum.FILE || !document.storageKey) {
                return 'skipped-no-file';
            }
            if (!(0, thumbnail_constants_1.isThumbnailableMime)(document.mimeType)) {
                return 'skipped-unsupported';
            }
            if (document.thumbKey && !job.force) {
                return 'skipped-existing';
            }
            const provider = new core_1.FileStorage().setProvider(document.storageProvider).getProviderInstance();
            const source = (await provider.getFile(document.storageKey));
            const pixels = await this.sourcePixels(document, source);
            if (!pixels) {
                return 'skipped-unsupported';
            }
            const thumbnail = await sharp(pixels, { failOn: 'none' })
                .resize({
                width: thumbnail_constants_1.DOCS_THUMBNAIL_MAX_PX,
                height: thumbnail_constants_1.DOCS_THUMBNAIL_MAX_PX,
                fit: 'inside',
                withoutEnlargement: true
            })
                .webp({ quality: thumbnail_constants_1.DOCS_THUMBNAIL_QUALITY })
                .toBuffer();
            const destination = (0, thumbnail_constants_1.thumbnailKeyFor)(document.storageKey);
            const uploaded = await provider.putFile(thumbnail, destination);
            // Providers that rewrite the key (S3 prefixes, the local provider's absolute path)
            // report the effective one; fall back to what we asked for.
            const thumbKey = uploaded?.key || destination;
            await this.typeOrmDocumentRepository.update({ id: document.id, tenantId: document.tenantId, organizationId: document.organizationId }, { thumbKey });
            document.thumbKey = thumbKey;
            this.logger.log(`Thumbnail generated for document ${document.id} (${thumbnail.length} bytes).`);
            return 'generated';
        }
        catch (error) {
            // Cosmetic by contract — log it and leave every status column alone.
            this.logger.warn(`Thumbnail generation failed for document ${document.id}: ${error.message}`);
            return 'failed';
        }
    }
    /**
     * The bytes `sharp` will resize: the source itself for an image, or the rendered first
     * page for a PDF. `null` means "no thumbnail is possible here" — a PDF in a process with
     * no rasterizer installed, which is a skip and not a failure.
     */
    async sourcePixels(document, source) {
        if (document.mimeType !== thumbnail_constants_1.THUMBNAILABLE_PDF_MIME_TYPE) {
            return source;
        }
        const rendered = await this.rasterizer.renderPages(source, 1);
        return rendered?.pages?.[0] ?? null;
    }
};
exports.DocumentThumbnailService = DocumentThumbnailService;
exports.DocumentThumbnailService = DocumentThumbnailService = DocumentThumbnailService_1 = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [type_orm_document_repository_1.TypeOrmDocumentRepository,
        pdf_rasterizer_service_1.PdfRasterizerService])
], DocumentThumbnailService);
//# sourceMappingURL=document-thumbnail.service.js.map