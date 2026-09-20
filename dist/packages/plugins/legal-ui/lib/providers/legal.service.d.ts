import { HttpClient } from '@angular/common/http';
import { ILegalDocument, LegalDocumentSlug } from '../models/legal-document.model';
import * as i0 from "@angular/core";
export declare class LegalService {
    private readonly http;
    constructor(http: HttpClient);
    /**
     * Returns a legal document from the corpus bundled into the application.
     *
     * The text is vendored from `@ever-co/legal` at build time (see
     * `scripts/sync-legal-content.mjs`), so this is a synchronous lookup over in-memory
     * constants. It performs no HTTP request, which is exactly the point: the Terms and Privacy
     * pages must never render blank because a remote service is unreachable or unsubscribed.
     *
     * @param document Document to look up, e.g. `tos`
     * @param locale Preferred locale; falls back to {@link LEGAL_DEFAULT_LOCALE}
     * @returns The document, or `null` when the corpus does not contain it
     */
    getDocument(document: LegalDocumentSlug, locale?: string): ILegalDocument | null;
    /**
     * Loads JSON content from an arbitrary URL.
     *
     * Retained for callers that render a remotely hosted document. The in-app Terms, Privacy and
     * Cookie pages no longer use it - they read the bundled corpus through {@link getDocument} so
     * that they keep working with no network access and no third-party subscription.
     *
     * @param url Absolute URL returning `{ content: string }`
     */
    getContentFromFromUrl(url: string): Promise<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<LegalService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LegalService>;
}
