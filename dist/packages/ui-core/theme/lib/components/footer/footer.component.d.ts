import { OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NbPopoverDirective } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { IUser } from '@gauzy/contracts';
import { Environment } from '@gauzy/ui-config';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
/** Version + commit of one side (web or api) for the footer's "Version" popover. */
interface IVersionDisplay {
    version: string;
    commit: string;
}
export declare class FooterComponent extends TranslationBaseComponent implements OnInit {
    translationService: TranslateService;
    private readonly store;
    private readonly http;
    readonly environment: Environment;
    companyName: string;
    companySite: string;
    companyLink: string;
    companySiteLink: string;
    companyGithubLink: string;
    companyGitlabLink: string;
    companyFacebookLink: string;
    companyTwitterLink: string;
    companyLinkedinLink: string;
    user: IUser;
    /** GitHub repo base (no trailing `.git`), e.g. `https://github.com/ever-co/ever-gauzy`. */
    private readonly repoBaseUrl;
    /** This web build's version + commit (baked at build time). */
    readonly web: IVersionDisplay;
    /** The running API's version + commit (fetched from `/api/version`); null until/if it loads. */
    api: IVersionDisplay | null;
    /**
     * The two footer popovers, queried by the template reference each trigger exports
     * (`#versionPopover="nbPopover"` / `#legalPopover="nbPopover"`).
     *
     * Nebular's click trigger already opens each one, toggles it, and closes it on a click that
     * lands outside its own trigger and panel — which is also what closes one panel when the
     * other trigger is clicked, so the two never end up open together. These references exist
     * only so both can additionally be closed on Escape and after one of the "Legal" links is
     * followed (following a routerLink does not close the overlay on its own).
     *
     * They are queried BY NAME, not by directive type: a bare `@ViewChild(NbPopoverDirective)`
     * silently binds to whichever popover comes first in the template, so the other one would
     * never be closed and reordering the markup would quietly swap which one is.
     */
    versionPopover?: NbPopoverDirective;
    legalPopover?: NbPopoverDirective;
    /**
     * Open/closed state of each popover, mirrored from the directive's own
     * `nbPopoverShowStateChange` output so `aria-expanded` stays truthful.
     *
     * These are never set from a click handler: Nebular also closes a panel on an outside click
     * and on Escape, and a locally toggled flag would miss both and go stale.
     */
    isVersionMenuShown: boolean;
    isLegalMenuShown: boolean;
    constructor(translationService: TranslateService, store: Store, http: HttpClient, environment: Environment);
    ngOnInit(): void;
    /** Closes whichever footer popover is open. Safe to call when they are both already closed. */
    closeFooterMenus(): void;
    /** Escape closes the footer popovers, which Nebular's click trigger does not do by itself. */
    onEscapeKeydown(): void;
    /** Whether there is any build info at all to display. */
    get hasVersionInfo(): boolean;
    /**
     * True when the web and API report different builds (both known and not equal).
     * When true the "Version" popover lists Web and API on their own rows; otherwise it
     * collapses to a single Version row plus a Commit row.
     */
    get isVersionMismatch(): boolean;
    /** The single build to show when web and API agree (or only one is known). */
    get primary(): IVersionDisplay;
    /** GitHub release/tag page for a version (empty when no version). */
    releaseUrl(version: string): string | null;
    /** GitHub commit page for a full commit SHA (empty when no commit). */
    commitUrl(commit: string): string | null;
    /** Short 7-char commit for display. */
    shortCommit(commit: string): string;
    private hasInfo;
    static ɵfac: i0.ɵɵFactoryDeclaration<FooterComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<FooterComponent, "ngx-footer", never, {}, {}, never, never, false, never>;
}
export {};
