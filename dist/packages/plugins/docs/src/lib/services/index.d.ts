import { DocsFeatureService } from './docs-feature.service';
import { DocumentService } from './document.service';
import { DocumentAccessService } from './document-access.service';
import { DocumentCategoryService } from './document-category.service';
import { DocumentKnowledgeService } from './document-knowledge.service';
import { DocumentLinkService } from './document-link.service';
import { DocumentPathService } from './document-path.service';
import { DocumentProcessingService } from './document-processing.service';
import { DocumentQuotaService } from './document-quota.service';
import { DocumentReviewService } from './document-review.service';
import { DocumentSettingsService } from './document-settings.service';
import { DocumentShareService } from './document-share.service';
import { DocumentStatsService } from './document-stats.service';
import { DocumentTreeService } from './document-tree.service';
import { DocumentUploadService } from './document-upload.service';
import { DocumentVersionService } from './document-version.service';
export * from './docs-feature.service';
export * from './document.service';
export * from './document-access.predicate';
export * from './document-access.service';
export * from './document-access.sql';
export * from './document-category.service';
export * from './document-knowledge.service';
export * from './document-link.service';
export * from './document-path.service';
export * from './document-processing.service';
export * from './document-quota.service';
export * from './document-review.service';
export * from './document-settings.service';
export * from './document-share.service';
export * from './document-stats.service';
export * from './document-tree.service';
export * from './document-upload.service';
export * from './document-version.service';
export * from './file-sniffer';
export * from './quota.calculator';
/**
 * Every domain service provider of the Documents plugin.
 *
 * `DocumentAccessService` is declared first: it owns the visibility + share composition
 * that `DocumentService` (and through it, everything else) depends on.
 */
export declare const Services: (typeof DocumentAccessService | typeof DocumentQuotaService | typeof DocumentSettingsService | typeof DocumentVersionService | typeof DocumentService | typeof DocumentProcessingService | typeof DocumentTreeService | typeof DocumentKnowledgeService | typeof DocumentReviewService | typeof DocumentCategoryService | typeof DocumentLinkService | typeof DocumentUploadService | typeof DocumentPathService | typeof DocumentShareService | typeof DocumentStatsService | typeof DocsFeatureService)[];
