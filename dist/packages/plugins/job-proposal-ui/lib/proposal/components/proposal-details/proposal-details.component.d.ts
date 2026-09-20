import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { IEmployee, IProposal, IUser } from '@gauzy/contracts';
import { Store } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class ProposalDetailsComponent implements AfterViewInit, OnInit, OnDestroy {
    private readonly route;
    private readonly store;
    private readonly sanitizer;
    private readonly router;
    user: IUser;
    employee: IEmployee;
    proposal: IProposal;
    jobPostLink: SafeHtml;
    jobPostContent: SafeHtml;
    proposalContent: SafeHtml;
    constructor(route: ActivatedRoute, store: Store, sanitizer: DomSanitizer, router: Router);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Sets the proposal data.
     */
    setProposal(): void;
    /**
     * Navigates to the edit page of the proposal.
     */
    edit(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalDetailsComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProposalDetailsComponent, "ngx-proposal-details", never, {}, {}, never, never, false, never>;
}
