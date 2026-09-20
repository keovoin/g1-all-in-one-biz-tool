import { IOnPluginUiBootstrap, IOnPluginUiDestroy } from '@gauzy/plugin-ui';
import * as i0 from "@angular/core";
import * as i1 from "./components/shell/docs-shell.component";
import * as i2 from "./components/tree/docs-tree.component";
import * as i3 from "./pages/browse/docs-browse-page.component";
import * as i4 from "./pages/review/review-page.component";
import * as i5 from "./components/table/docs-table.component";
import * as i6 from "./components/cards/docs-cards.component";
import * as i7 from "./components/preview/docs-preview-modal.component";
import * as i8 from "./components/preview/pdf-viewer.component";
import * as i9 from "./components/table/cells/name-cell.component";
import * as i10 from "./components/table/cells/status-badge.component";
import * as i11 from "./components/table/cells/knowledge-badge.component";
import * as i12 from "./components/table/cells/source-badge.component";
import * as i13 from "./components/table/cells/category-chips.component";
import * as i14 from "./components/table/cells/tag-chips.component";
import * as i15 from "./components/table/cells/updated-cell.component";
import * as i16 from "./components/table/cells/row-actions.component";
import * as i17 from "./components/filter-bar/docs-filter-bar.component";
import * as i18 from "./components/filter-bar/preset-chips.component";
import * as i19 from "./components/filter-bar/saved-views.component";
import * as i20 from "./components/filter-bar/facet-multiselect.component";
import * as i21 from "./components/stats/docs-stats-line.component";
import * as i22 from "./components/upload/docs-drop-strip.component";
import * as i23 from "./components/upload/upload-dropzone.directive";
import * as i24 from "./components/upload/upload-progress.component";
import * as i25 from "./components/detail/docs-detail-panel.component";
import * as i26 from "./components/activity/docs-detail-activity.component";
import * as i27 from "./components/comments/document-comments.component";
import * as i28 from "./components/comments/comment-composer.component";
import * as i29 from "./components/bulk/bulk-bar.component";
import * as i30 from "./components/empty/empty-state.component";
import * as i31 from "./components/folder-picker/docs-folder-picker.component";
import * as i32 from "./dialogs/bulk-categories-dialog.component";
import * as i33 from "./dialogs/classification-dialog.component";
import * as i34 from "./dialogs/create-dialog.component";
import * as i35 from "./dialogs/extracted-text-dialog.component";
import * as i36 from "./dialogs/move-dialog.component";
import * as i37 from "./dialogs/delete-dialog.component";
import * as i38 from "./dialogs/reject-dialog.component";
import * as i39 from "./dialogs/request-review-dialog.component";
import * as i40 from "./dialogs/share-dialog.component";
import * as i41 from "./dialogs/link-dialog.component";
import * as i42 from "@angular/common";
import * as i43 from "@angular/forms";
import * as i44 from "@angular/router";
import * as i45 from "@ngx-translate/core";
import * as i46 from "ngx-permissions";
import * as i47 from "@ali-hm/angular-tree-component";
import * as i48 from "@nebular/theme";
import * as i49 from "@ng-select/ng-select";
import * as i50 from "@gauzy/ui-core/shared";
/**
 * Documents hub UI module. Routes are provided through the ROUTES factory so
 * plugins can contribute children at the 'documents-sections' location, and
 * declarative registrations (nav menu, page routes) are applied once on plugin
 * bootstrap — identical to the jobs-ui shell pattern.
 */
export declare class DocsUiModule implements IOnPluginUiBootstrap, IOnPluginUiDestroy {
    private static _hasAppliedRegistrations;
    private readonly _log;
    private readonly _navMenuBuilderService;
    private readonly _pageRouteRegistryService;
    private readonly _pluginDefinition;
    private readonly _translateService;
    /** Called by PluginUiModule after the plugin module is instantiated. */
    ngOnPluginBootstrap(): void;
    /** Called by PluginUiModule when the application is shutting down. */
    ngOnPluginDestroy(): void;
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
    private _applyDeclarativeRegistrations;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsUiModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<DocsUiModule, [typeof i1.DocsShellComponent, typeof i2.DocsTreeComponent, typeof i3.DocsBrowsePageComponent, typeof i4.ReviewPageComponent, typeof i5.DocsTableComponent, typeof i6.DocsCardsComponent, typeof i7.DocsPreviewModalComponent, typeof i8.PdfViewerComponent, typeof i9.NameCellComponent, typeof i10.StatusBadgeComponent, typeof i11.KnowledgeBadgeComponent, typeof i12.SourceBadgeComponent, typeof i13.CategoryChipsComponent, typeof i14.TagChipsComponent, typeof i15.UpdatedCellComponent, typeof i16.RowActionsComponent, typeof i17.DocsFilterBarComponent, typeof i18.PresetChipsComponent, typeof i19.SavedViewsComponent, typeof i20.FacetMultiselectComponent, typeof i21.DocsStatsLineComponent, typeof i22.DocsDropStripComponent, typeof i23.UploadDropzoneDirective, typeof i24.UploadProgressComponent, typeof i25.DocsDetailPanelComponent, typeof i26.DocsDetailActivityComponent, typeof i27.DocumentCommentsComponent, typeof i28.CommentComposerComponent, typeof i29.BulkBarComponent, typeof i30.EmptyStateComponent, typeof i31.DocsFolderPickerComponent, typeof i32.BulkCategoriesDialogComponent, typeof i33.ClassificationDialogComponent, typeof i34.CreateDialogComponent, typeof i35.ExtractedTextDialogComponent, typeof i36.MoveDialogComponent, typeof i37.DocsDeleteDialogComponent, typeof i38.RejectDialogComponent, typeof i39.RequestReviewDialogComponent, typeof i40.DocumentShareDialogComponent, typeof i41.DocumentLinkDialogComponent], [typeof i42.CommonModule, typeof i43.FormsModule, typeof i43.ReactiveFormsModule, typeof i44.RouterModule, typeof i45.TranslateModule, typeof i46.NgxPermissionsModule, typeof i47.TreeModule, typeof i48.NbBadgeModule, typeof i48.NbButtonModule, typeof i48.NbCardModule, typeof i48.NbCheckboxModule, typeof i48.NbContextMenuModule, typeof i48.NbDatepickerModule, typeof i48.NbDialogModule, typeof i48.NbFormFieldModule, typeof i48.NbIconModule, typeof i48.NbInputModule, typeof i48.NbPopoverModule, typeof i48.NbProgressBarModule, typeof i48.NbRadioModule, typeof i48.NbSelectModule, typeof i48.NbSpinnerModule, typeof i48.NbToggleModule, typeof i48.NbTooltipModule, typeof i49.NgSelectModule, typeof i50.FavoriteToggleModule, typeof i50.SharedModule, typeof i50.SmartDataViewLayoutModule, typeof i50.TagsColorInputModule, typeof i50.TeamSelectModule], [typeof i44.RouterModule]>;
    static ɵinj: i0.ɵɵInjectorDeclaration<DocsUiModule>;
}
