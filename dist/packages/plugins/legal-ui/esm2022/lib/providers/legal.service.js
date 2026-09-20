import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { LEGAL_CORPUS, LEGAL_DEFAULT_LOCALE } from '../content';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common/http";
export class LegalService {
    constructor(http) {
        this.http = http;
    }
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
    getDocument(document, locale = LEGAL_DEFAULT_LOCALE) {
        const candidates = LEGAL_CORPUS.filter((entry) => entry.document === document);
        if (!candidates.length) {
            return null;
        }
        // Exact locale, then the base language (`en-GB` -> `en`), then the default locale.
        const normalized = (locale || LEGAL_DEFAULT_LOCALE).toLowerCase();
        const language = normalized.split(/[-_]/)[0];
        return (candidates.find((entry) => entry.locale.toLowerCase() === normalized) ??
            candidates.find((entry) => entry.locale.toLowerCase() === language) ??
            candidates.find((entry) => entry.locale.toLowerCase() === LEGAL_DEFAULT_LOCALE) ??
            candidates[0]);
    }
    /**
     * Loads JSON content from an arbitrary URL.
     *
     * Retained for callers that render a remotely hosted document. The in-app Terms, Privacy and
     * Cookie pages no longer use it - they read the bundled corpus through {@link getDocument} so
     * that they keep working with no network access and no third-party subscription.
     *
     * @param url Absolute URL returning `{ content: string }`
     */
    getContentFromFromUrl(url) {
        return firstValueFrom(this.http.get(url));
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LegalService, deps: [{ token: i1.HttpClient }], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LegalService, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: LegalService, decorators: [{
            type: Injectable,
            args: [{
                    providedIn: 'root'
                }]
        }], ctorParameters: () => [{ type: i1.HttpClient }] });
//# sourceMappingURL=legal.service.js.map