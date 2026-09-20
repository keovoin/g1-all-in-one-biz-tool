import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ILegalDocument } from '../../models/legal-document.model';
import { LegalService } from '../../providers/legal.service';
import * as i0 from "@angular/core";
/**
 * Renders the Privacy Policy and/or the Cookie Policy from the bundled corpus.
 *
 * Which of the two it shows comes from the route's `data.documents`, so the `privacy` and
 * `cookies` routes reuse this one component instead of duplicating the document markup.
 * With no `data.documents` the component shows both, which is how it behaved when it was
 * only mounted on the `privacy` route.
 */
export declare class PrivacyPolicyComponent implements OnInit, OnDestroy {
    private readonly legalService;
    private readonly translateService;
    private readonly route;
    private readonly _document;
    /** Rendered HTML of the Privacy Policy. Bundled with the application, never fetched. */
    privacy_policy: string;
    /** Rendered HTML of the Cookie Policy. Bundled with the application, never fetched. */
    cookie_policy: string;
    /** Metadata of the Privacy Policy - title, version, effective date, publishing entity. */
    privacy: ILegalDocument | null;
    /** Metadata of the Cookie Policy - title, version, effective date, publishing entity. */
    cookies: ILegalDocument | null;
    /** Whether the Privacy Policy section is rendered. Driven by the route's `data.documents`. */
    showPrivacy: boolean;
    /** Whether the Cookie Policy section is rendered. Driven by the route's `data.documents`. */
    showCookies: boolean;
    constructor(legalService: LegalService, translateService: TranslateService, route: ActivatedRoute, _document: Document);
    ngOnInit(): void;
    /**
     * Reads `data.documents` off the activated route and turns it into the section flags.
     *
     * A route that does not declare `documents` keeps both sections, so mounting this component
     * without route data renders exactly what it rendered before the `cookies` route existed.
     */
    private resolveSections;
    /**
     * Loads the Privacy Policy and the Cookie Policy from the corpus bundled into the application.
     *
     * The text is vendored from `@ever-co/legal` at build time, so this is a synchronous lookup
     * that cannot fail because of a network problem or a lapsed third-party subscription.
     */
    private loadPolicies;
    /**
     * Remove class from body to hide privacy policy
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<PrivacyPolicyComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<PrivacyPolicyComponent, "ng-component", never, {}, {}, never, never, false, never>;
}
