import { OnInit } from '@angular/core';
import { Store } from '@gauzy/ui-core/core';
import { DocumentsService } from '../../services/documents.service';
import * as i0 from "@angular/core";
interface IDocsStatTile {
    labelKey: string;
    value: string;
    /** CSS color value; `''` = the theme's default text color (strict-templates: never undefined). */
    color: string;
}
/**
 * Org-global stats tiles above the filter bar (`GET /documents/stats`).
 *
 * Deliberately NOT filter-relative — the preset chips already are: tiles answer
 * "what is in this organization", so they load once, reload on an org switch and
 * on the page's explicit `reload()` calls (upload settled, bulk finished).
 *
 * Cosmetic surface: any failure — including 404 on a deployment whose API
 * predates the endpoint — hides the whole strip rather than surfacing an error,
 * so a UI-first deploy degrades silently.
 */
export declare class DocsStatsLineComponent implements OnInit {
    private readonly documentsService;
    private readonly store;
    tiles: IDocsStatTile[];
    loading: boolean;
    visible: boolean;
    private readonly reload$;
    constructor(documentsService: DocumentsService, store: Store);
    ngOnInit(): void;
    /** Public on purpose — the browse page re-pulls after uploads and bulk actions settle. */
    reload(): void;
    trackByLabel(_index: number, tile: IDocsStatTile): string;
    private buildTiles;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocsStatsLineComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocsStatsLineComponent, "gz-docs-stats-line", never, {}, {}, never, never, false, never>;
}
export {};
