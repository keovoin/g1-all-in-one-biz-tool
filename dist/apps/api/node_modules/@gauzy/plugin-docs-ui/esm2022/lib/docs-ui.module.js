import { CommonModule } from '@angular/common';
import { inject, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ROUTES } from '@angular/router';
import { TreeModule } from '@ali-hm/angular-tree-component';
import { NbBadgeModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbDatepickerModule, NbDialogModule, NbFormFieldModule, NbIconModule, NbInputModule, NbPopoverModule, NbProgressBarModule, NbRadioModule, NbSelectModule, NbSpinnerModule, NbToggleModule, NbTooltipModule } from '@nebular/theme';
import { NgSelectModule } from '@ng-select/ng-select';
import { provideEffects } from '@ngneat/effects-ng';
import { TranslateModule } from '@ngx-translate/core';
import { NgxPermissionsModule } from 'ngx-permissions';
import { applyDeclarativeRegistrations, PLUGIN_DEFINITION, PLUGIN_TRANSLATE_SERVICE } from '@gauzy/plugin-ui';
import { LoggerService, NavMenuBuilderService, PageRouteRegistryService } from '@gauzy/ui-core/core';
import { FavoriteToggleModule, SharedModule, SmartDataViewLayoutModule, TagsColorInputModule, TeamSelectModule } from '@gauzy/ui-core/shared';
import { DocumentsEffects } from './+state/documents.effects';
import { DocumentsQuery } from './+state/documents.query';
import { DocumentsStore } from './+state/documents.store';
import { DocsDetailActivityComponent } from './components/activity/docs-detail-activity.component';
import { BulkBarComponent } from './components/bulk/bulk-bar.component';
import { DocsRowActionsService } from './components/actions/docs-row-actions.service';
import { DocsCardsComponent } from './components/cards/docs-cards.component';
import { CommentComposerComponent } from './components/comments/comment-composer.component';
import { DocumentCommentsComponent } from './components/comments/document-comments.component';
import { DocsDetailPanelComponent } from './components/detail/docs-detail-panel.component';
import { EmptyStateComponent } from './components/empty/empty-state.component';
import { DocsFolderPickerComponent } from './components/folder-picker/docs-folder-picker.component';
import { FacetMultiselectComponent } from './components/filter-bar/facet-multiselect.component';
import { DocsFilterBarComponent } from './components/filter-bar/docs-filter-bar.component';
import { PresetChipsComponent } from './components/filter-bar/preset-chips.component';
import { SavedViewsComponent } from './components/filter-bar/saved-views.component';
import { DocsPreviewModalComponent } from './components/preview/docs-preview-modal.component';
import { PdfViewerComponent } from './components/preview/pdf-viewer.component';
import { DocsShellComponent } from './components/shell/docs-shell.component';
import { DocsStatsLineComponent } from './components/stats/docs-stats-line.component';
import { CategoryChipsComponent } from './components/table/cells/category-chips.component';
import { KnowledgeBadgeComponent } from './components/table/cells/knowledge-badge.component';
import { NameCellComponent } from './components/table/cells/name-cell.component';
import { SourceBadgeComponent } from './components/table/cells/source-badge.component';
import { StatusBadgeComponent } from './components/table/cells/status-badge.component';
import { RowActionsComponent } from './components/table/cells/row-actions.component';
import { TagChipsComponent } from './components/table/cells/tag-chips.component';
import { UpdatedCellComponent } from './components/table/cells/updated-cell.component';
import { DocsTableComponent } from './components/table/docs-table.component';
import { DocsTreeComponent } from './components/tree/docs-tree.component';
import { DocsDropStripComponent } from './components/upload/docs-drop-strip.component';
import { UploadDropzoneDirective } from './components/upload/upload-dropzone.directive';
import { UploadProgressComponent } from './components/upload/upload-progress.component';
import { BulkCategoriesDialogComponent } from './dialogs/bulk-categories-dialog.component';
import { ClassificationDialogComponent } from './dialogs/classification-dialog.component';
import { CreateDialogComponent } from './dialogs/create-dialog.component';
import { ExtractedTextDialogComponent } from './dialogs/extracted-text-dialog.component';
import { DocumentLinkDialogComponent } from './dialogs/link-dialog.component';
import { DocsDeleteDialogComponent } from './dialogs/delete-dialog.component';
import { MoveDialogComponent } from './dialogs/move-dialog.component';
import { RejectDialogComponent } from './dialogs/reject-dialog.component';
import { RequestReviewDialogComponent } from './dialogs/request-review-dialog.component';
import { DocumentShareDialogComponent } from './dialogs/share-dialog.component';
import { createDocsRoutes } from './docs.routes';
import { DocsBrowsePageComponent } from './pages/browse/docs-browse-page.component';
import { ReviewPageComponent } from './pages/review/review-page.component';
import { DocsExportService } from './services/docs-export.service';
import { DocsSavedViewsService } from './services/docs-saved-views.service';
import { DocumentPermissionService } from './services/document-permission.service';
import { DocumentTreeStore } from './services/document-tree.store';
import { DocumentsService } from './services/documents.service';
import { UploadQueueService } from './services/upload-queue.service';
import * as i0 from "@angular/core";
import * as i1 from "@angular/router";
import * as i2 from "@ngx-translate/core";
import * as i3 from "ngx-permissions";
import * as i4 from "@nebular/theme";
/**
 * Documents hub UI module. Routes are provided through the ROUTES factory so
 * plugins can contribute children at the 'documents-sections' location, and
 * declarative registrations (nav menu, page routes) are applied once on plugin
 * bootstrap — identical to the jobs-ui shell pattern.
 */
export class DocsUiModule {
    constructor() {
        this._log = inject(LoggerService).withContext('DocsUiModule');
        this._navMenuBuilderService = inject(NavMenuBuilderService);
        this._pageRouteRegistryService = inject(PageRouteRegistryService);
        this._pluginDefinition = inject(PLUGIN_DEFINITION, { optional: true });
        // The host binds this token to `TranslateAdapterService` in `PluginUiModule.init()`. Optional
        // so the module still boots in a test harness (or the standalone playground) that never calls
        // `init()` — the translation merge is then simply skipped.
        this._translateService = inject(PLUGIN_TRANSLATE_SERVICE, { optional: true });
    }
    static { this._hasAppliedRegistrations = false; }
    // ─── Plugin Lifecycle ─────────────────────────────────────────
    /** Called by PluginUiModule after the plugin module is instantiated. */
    ngOnPluginBootstrap() {
        this._log.log('Plugin bootstrapped');
        this._applyDeclarativeRegistrations();
    }
    /** Called by PluginUiModule when the application is shutting down. */
    ngOnPluginDestroy() {
        this._log.log('Plugin destroyed');
        DocsUiModule._hasAppliedRegistrations = false;
    }
    // ─── Registration ─────────────────────────────────────────────
    /**
     * Applies routes, nav and the `DOCS` translation bundle from the plugin definition.
     * Guarded to run once per app lifecycle.
     *
     * 🛑 `translateService` is not optional in practice. `DocsUiPlugin` declares
     * `translations: { en }` + `translationNamespace: 'DOCS'`, but it is a **module** plugin, and
     * `PluginUiModule.bootstrapDeclarativePlugins()` runs the translation-merging `bootstrap`
     * callback only for plugins with no `module`/`loadModule`. Without passing the service here,
     * nothing ever merges `en.json` and every `DOCS.*` key in the hub renders as its raw key.
     */
    _applyDeclarativeRegistrations() {
        if (DocsUiModule._hasAppliedRegistrations || !this._pluginDefinition)
            return;
        applyDeclarativeRegistrations(this._pluginDefinition, {
            navBuilder: this._navMenuBuilderService,
            pageRouteRegistry: this._pageRouteRegistryService,
            translateService: this._translateService
        });
        DocsUiModule._hasAppliedRegistrations = true;
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsUiModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule }); }
    static { this.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "21.0.7", ngImport: i0, type: DocsUiModule, declarations: [DocsShellComponent,
            DocsTreeComponent,
            DocsBrowsePageComponent,
            ReviewPageComponent,
            DocsTableComponent,
            DocsCardsComponent,
            DocsPreviewModalComponent,
            PdfViewerComponent,
            NameCellComponent,
            StatusBadgeComponent,
            KnowledgeBadgeComponent,
            SourceBadgeComponent,
            CategoryChipsComponent,
            TagChipsComponent,
            UpdatedCellComponent,
            RowActionsComponent,
            DocsFilterBarComponent,
            PresetChipsComponent,
            SavedViewsComponent,
            FacetMultiselectComponent,
            DocsStatsLineComponent,
            DocsDropStripComponent,
            UploadDropzoneDirective,
            UploadProgressComponent,
            DocsDetailPanelComponent,
            DocsDetailActivityComponent,
            DocumentCommentsComponent,
            CommentComposerComponent,
            BulkBarComponent,
            EmptyStateComponent,
            DocsFolderPickerComponent,
            BulkCategoriesDialogComponent,
            ClassificationDialogComponent,
            CreateDialogComponent,
            ExtractedTextDialogComponent,
            MoveDialogComponent,
            DocsDeleteDialogComponent,
            RejectDialogComponent,
            RequestReviewDialogComponent,
            DocumentShareDialogComponent,
            DocumentLinkDialogComponent], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule, i1.RouterModule, i2.TranslateModule, i3.NgxPermissionsModule, TreeModule,
            NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbContextMenuModule,
            NbDatepickerModule, i4.NbDialogModule, NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbPopoverModule,
            NbProgressBarModule,
            NbRadioModule,
            NbSelectModule,
            NbSpinnerModule,
            NbToggleModule,
            NbTooltipModule,
            // The rebuilt facet dropdowns are ng-select — the app-wide overrides give
            // them their geometry, and the compact filter-bar pin relies on it.
            NgSelectModule,
            FavoriteToggleModule,
            SharedModule,
            SmartDataViewLayoutModule,
            TagsColorInputModule,
            // Only the team selector is pulled in from ui-core: the full `SelectorsModule`
            // calls `NgxDaterangepickerMd.forRoot()`, which a lazily-loaded plugin module
            // must not re-run, and its employee selectors cannot render on Documents
            // routes (see `share-dialog.component.ts`).
            TeamSelectModule], exports: [RouterModule] }); }
    static { this.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsUiModule, providers: [
            {
                provide: ROUTES,
                useFactory: (pageRouteRegistryService) => createDocsRoutes(pageRouteRegistryService),
                deps: [PageRouteRegistryService],
                multi: true
            },
            // 🛑 Do NOT call provideEffectsManager() here. `@ngneat/effects-ng` documents it as
            // "Must be called at the root level" — it runs `initEffects()`, which creates the effects
            // manager and subscribes it to the GLOBAL `actions` stream. The app root already provides
            // it (apps/gauzy/src/app/bootstrap.module.ts). Providing it again in this LAZY-loaded
            // module stood up a SECOND manager on the same global stream, and on first navigation to
            // /pages/documents that re-entered synchronously and pegged the main thread — the route
            // wedged before any HTTP (before the guards' /api/auth/permissions call even fired), so
            // every unit test passed while the hub was unreachable in a browser. A feature module must
            // contribute ONLY its effects via provideEffects(); the manager is the root's job.
            provideEffects(DocumentsEffects),
            DocumentsStore,
            DocumentsQuery,
            DocumentsService,
            DocumentTreeStore,
            // Row-level ownership scoping of the mutating affordances (spec 08 §1.7). Provided
            // here, next to the surfaces that consume it: the tree/table/cards kebabs, the detail
            // panel and the (standalone, route-loaded) page editor all resolve it through this
            // module's injector.
            DocumentPermissionService,
            UploadQueueService,
            DocsExportService,
            DocsRowActionsService,
            DocsSavedViewsService
        ], imports: [CommonModule,
            FormsModule,
            ReactiveFormsModule,
            RouterModule.forChild([]),
            TranslateModule.forChild(),
            NgxPermissionsModule.forChild(),
            TreeModule,
            NbBadgeModule,
            NbButtonModule,
            NbCardModule,
            NbCheckboxModule,
            NbContextMenuModule,
            NbDatepickerModule,
            NbDialogModule.forChild(),
            NbFormFieldModule,
            NbIconModule,
            NbInputModule,
            NbPopoverModule,
            NbProgressBarModule,
            NbRadioModule,
            NbSelectModule,
            NbSpinnerModule,
            NbToggleModule,
            NbTooltipModule,
            // The rebuilt facet dropdowns are ng-select — the app-wide overrides give
            // them their geometry, and the compact filter-bar pin relies on it.
            NgSelectModule,
            FavoriteToggleModule,
            SharedModule,
            SmartDataViewLayoutModule,
            TagsColorInputModule,
            // Only the team selector is pulled in from ui-core: the full `SelectorsModule`
            // calls `NgxDaterangepickerMd.forRoot()`, which a lazily-loaded plugin module
            // must not re-run, and its employee selectors cannot render on Documents
            // routes (see `share-dialog.component.ts`).
            TeamSelectModule, RouterModule] }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "21.0.7", ngImport: i0, type: DocsUiModule, decorators: [{
            type: NgModule,
            args: [{
                    declarations: [
                        DocsShellComponent,
                        DocsTreeComponent,
                        DocsBrowsePageComponent,
                        ReviewPageComponent,
                        DocsTableComponent,
                        DocsCardsComponent,
                        DocsPreviewModalComponent,
                        PdfViewerComponent,
                        NameCellComponent,
                        StatusBadgeComponent,
                        KnowledgeBadgeComponent,
                        SourceBadgeComponent,
                        CategoryChipsComponent,
                        TagChipsComponent,
                        UpdatedCellComponent,
                        RowActionsComponent,
                        DocsFilterBarComponent,
                        PresetChipsComponent,
                        SavedViewsComponent,
                        FacetMultiselectComponent,
                        DocsStatsLineComponent,
                        DocsDropStripComponent,
                        UploadDropzoneDirective,
                        UploadProgressComponent,
                        DocsDetailPanelComponent,
                        DocsDetailActivityComponent,
                        DocumentCommentsComponent,
                        CommentComposerComponent,
                        BulkBarComponent,
                        EmptyStateComponent,
                        DocsFolderPickerComponent,
                        BulkCategoriesDialogComponent,
                        ClassificationDialogComponent,
                        CreateDialogComponent,
                        ExtractedTextDialogComponent,
                        MoveDialogComponent,
                        DocsDeleteDialogComponent,
                        RejectDialogComponent,
                        RequestReviewDialogComponent,
                        DocumentShareDialogComponent,
                        DocumentLinkDialogComponent
                    ],
                    imports: [
                        CommonModule,
                        FormsModule,
                        ReactiveFormsModule,
                        RouterModule.forChild([]),
                        TranslateModule.forChild(),
                        NgxPermissionsModule.forChild(),
                        TreeModule,
                        NbBadgeModule,
                        NbButtonModule,
                        NbCardModule,
                        NbCheckboxModule,
                        NbContextMenuModule,
                        NbDatepickerModule,
                        NbDialogModule.forChild(),
                        NbFormFieldModule,
                        NbIconModule,
                        NbInputModule,
                        NbPopoverModule,
                        NbProgressBarModule,
                        NbRadioModule,
                        NbSelectModule,
                        NbSpinnerModule,
                        NbToggleModule,
                        NbTooltipModule,
                        // The rebuilt facet dropdowns are ng-select — the app-wide overrides give
                        // them their geometry, and the compact filter-bar pin relies on it.
                        NgSelectModule,
                        FavoriteToggleModule,
                        SharedModule,
                        SmartDataViewLayoutModule,
                        TagsColorInputModule,
                        // Only the team selector is pulled in from ui-core: the full `SelectorsModule`
                        // calls `NgxDaterangepickerMd.forRoot()`, which a lazily-loaded plugin module
                        // must not re-run, and its employee selectors cannot render on Documents
                        // routes (see `share-dialog.component.ts`).
                        TeamSelectModule
                    ],
                    exports: [RouterModule],
                    providers: [
                        {
                            provide: ROUTES,
                            useFactory: (pageRouteRegistryService) => createDocsRoutes(pageRouteRegistryService),
                            deps: [PageRouteRegistryService],
                            multi: true
                        },
                        // 🛑 Do NOT call provideEffectsManager() here. `@ngneat/effects-ng` documents it as
                        // "Must be called at the root level" — it runs `initEffects()`, which creates the effects
                        // manager and subscribes it to the GLOBAL `actions` stream. The app root already provides
                        // it (apps/gauzy/src/app/bootstrap.module.ts). Providing it again in this LAZY-loaded
                        // module stood up a SECOND manager on the same global stream, and on first navigation to
                        // /pages/documents that re-entered synchronously and pegged the main thread — the route
                        // wedged before any HTTP (before the guards' /api/auth/permissions call even fired), so
                        // every unit test passed while the hub was unreachable in a browser. A feature module must
                        // contribute ONLY its effects via provideEffects(); the manager is the root's job.
                        provideEffects(DocumentsEffects),
                        DocumentsStore,
                        DocumentsQuery,
                        DocumentsService,
                        DocumentTreeStore,
                        // Row-level ownership scoping of the mutating affordances (spec 08 §1.7). Provided
                        // here, next to the surfaces that consume it: the tree/table/cards kebabs, the detail
                        // panel and the (standalone, route-loaded) page editor all resolve it through this
                        // module's injector.
                        DocumentPermissionService,
                        UploadQueueService,
                        DocsExportService,
                        DocsRowActionsService,
                        DocsSavedViewsService
                    ]
                }]
        }] });
//# sourceMappingURL=docs-ui.module.js.map