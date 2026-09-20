import { OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { Actions } from '@ngneat/effects-ng';
import { Observable } from 'rxjs';
import { ID, IDocument } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { TranslateService } from '@ngx-translate/core';
import { DocumentsQuery } from '../../+state/documents.query';
import * as i0 from "@angular/core";
/**
 * Shell for /pages/documents: in-page left tree column (collapsible, state in
 * localStorage), content router-outlet, and the detail side panel host. The
 * detail panel is not a route — it is `?id=<documentId>` on the current URL.
 */
export declare class DocsShellComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly route;
    private readonly router;
    private readonly actions;
    private readonly documentsQuery;
    private readonly dialogService;
    treeCollapsed: boolean;
    detailId$: Observable<ID | null>;
    constructor(translateService: TranslateService, route: ActivatedRoute, router: Router, actions: Actions, documentsQuery: DocumentsQuery, dialogService: NbDialogService);
    ngOnInit(): void;
    toggleTree(): void;
    onDetailClosed(): void;
    /**
     * Every panel edit — taxonomy chips, archive/unarchive, knowledge toggle,
     * reprocess, extracted-text save, share/visibility — lands here.
     *
     * The panel used to emit into nothing: the row behind it kept the values it was
     * listed with, and the facets and preset counts (which are what the filter bar
     * and the "Needs review" / "Not in knowledge" chips are derived from) went
     * stale until the next full reload. `rowChanged` patches the row in place and
     * `refreshFacets` re-counts, exactly as the panel's own review-request path
     * already did for itself.
     */
    onDetailChanged(document: IDocument): void;
    /**
     * The document behind the open panel is gone. `rowRemoved` drops it from the
     * list and — because the effect closes a detail panel pointing at the removed
     * id — also closes this panel, so nothing is left pointing at a 404.
     */
    onDetailDeleted(id: ID): void;
    onOpenEditor(id: ID): void;
    onOpenPreview(document: IDocument): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsShellComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsShellComponent, "gz-docs-shell", never, {}, {}, never, never, false, never>;
}
