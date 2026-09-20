import { OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ILegalDocument } from '../../models/legal-document.model';
import { LegalService } from '../../providers/legal.service';
import * as i0 from "@angular/core";
export declare class TermsAndConditionsComponent implements OnInit, OnDestroy {
    private readonly legalService;
    private readonly translateService;
    private readonly _document;
    /** Rendered HTML of the Terms of Service. Bundled with the application, never fetched. */
    term_and_policy: string;
    /** Metadata of the rendered document - title, version, effective date, publishing entity. */
    terms: ILegalDocument | null;
    constructor(legalService: LegalService, translateService: TranslateService, _document: Document);
    ngOnInit(): void;
    /**
     * Loads the Terms of Service from the corpus bundled into the application.
     *
     * The text is vendored from `@ever-co/legal` at build time, so this is a synchronous lookup
     * that cannot fail because of a network problem or a lapsed third-party subscription.
     */
    private loadTerms;
    /**
     * Remove class from body to hide terms and conditions
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<TermsAndConditionsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TermsAndConditionsComponent, "ga-terms-conditions", never, {}, {}, never, never, false, never>;
}
