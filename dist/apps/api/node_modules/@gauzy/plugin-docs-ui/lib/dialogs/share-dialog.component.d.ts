import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { DocumentShareAccessEnum, DocumentVisibilityEnum, ID, IDocument, IDocumentShare, IEmployee, IOrganizationTeam, PermissionsEnum } from '@gauzy/contracts';
import { EmployeesService, OrganizationTeamsService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { DocsShareTargetKind } from '../models/docs-share.model';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
/** Row projection: the share plus a resolved display label for its subject. */
interface IShareRow {
    share: IDocumentShare;
    label: string;
    kind: DocsShareTargetKind;
    /** Per-row in-flight guard so one revoke does not freeze the whole list. */
    busy: boolean;
}
/**
 * Share overlay editor for a document (`08-permissions-security.md` §3,
 * `01-ux-spec.md` §8). Opened from the detail panel and the page-editor overflow
 * menu; everything mutating is `DOCS_UPDATE`-gated.
 *
 * Two blocks:
 *
 *  1. **Visibility** — `ORGANIZATION` ⇄ `PRIVATE` with an explanatory hint.
 *     Shares only mean anything on PRIVATE documents (an ORGANIZATION document
 *     is already readable org-wide and `POST /shares` answers 409
 *     `DOCS_SHARE_NOT_PRIVATE`), so the share block is disabled — not hidden —
 *     while visibility is ORGANIZATION, with the reason spelled out. Hiding it
 *     would leave the user hunting for a control that exists.
 *  2. **Shares** — existing rows (employee or team + VIEW/COMMENT/EDIT), an add
 *     form, inline access changes and revoke.
 *
 * 🛑 The dialog states the §3.3 composition invariant in the access hint:
 * `EDIT` still requires the subject to hold `DOCS_UPDATE`. A share never
 * substitutes for a permission, and promising otherwise in the UI is the kind
 * of thing people plan access around.
 *
 * **Feature detection:** the share endpoints are P1 in `03-backend-plugin.md`.
 * A 404 on the initial `GET /shares` is treated as "this deployment has no
 * share endpoints yet" and renders an unavailable notice — never an error toast
 * (an error a user cannot act on is noise).
 *
 * The employee picker deliberately does **not** reuse `ga-employee-multi-select`:
 * that component gates rendering on `DateRangePickerBuilderService.selectedDateRange$`,
 * which never emits on Documents routes because `docs.routes.ts` disables the
 * header date selector (`selectors: { date: false }`) — it would render an empty
 * box here. The team picker does reuse `ga-team-selector` (no such coupling),
 * with `skipGlobalChange` so picking a team never rewrites global nav state.
 */
export declare class DocumentShareDialogComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    private readonly employeesService;
    private readonly teamsService;
    private readonly toastrService;
    private readonly store;
    /**
     * Stable permission arrays for the template's `*ngxPermissionsOnly` gates.
     * 🛑 Never inline `[permissions.X]` in a binding — a fresh array each change-detection cycle
     * makes ngx-permissions re-validate forever and wedges the main thread.
     */
    readonly docsPermissions: Readonly<{
        read: PermissionsEnum[];
        create: PermissionsEnum[];
        update: PermissionsEnum[];
        delete: PermissionsEnum[];
        manage: PermissionsEnum[];
        review: PermissionsEnum[];
        aiImport: PermissionsEnum[];
    }>;
    /** The document to share. Required. */
    document: IDocument;
    rows: IShareRow[];
    employees: IEmployee[];
    teams: IOrganizationTeam[];
    loading: boolean;
    saving: boolean;
    /** True once `GET /shares` answered 404 — the P1 endpoints are not deployed. */
    unsupported: boolean;
    /** True after a 403/404 on a mutation the user turned out not to be allowed. */
    forbidden: boolean;
    targetKind: DocsShareTargetKind;
    selectedEmployeeId: ID | null;
    selectedTeamId: ID | null;
    newAccess: DocumentShareAccessEnum;
    visibility: DocumentVisibilityEnum;
    readonly accessLevels: DocumentShareAccessEnum[];
    readonly visibilities: DocumentVisibilityEnum[];
    readonly visibilityEnum: typeof DocumentVisibilityEnum;
    readonly permissions: typeof PermissionsEnum;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<DocumentShareDialogComponent>, documentsService: DocumentsService, employeesService: EmployeesService, teamsService: OrganizationTeamsService, toastrService: ToastrService, store: Store);
    ngOnInit(): void;
    reload(): Promise<void>;
    private loadEmployees;
    private loadTeams;
    get isPrivate(): boolean;
    /**
     * Flipping to ORGANIZATION does **not** delete existing shares: they simply
     * stop granting anything (§3.3 — shares have no effect on ORGANIZATION
     * documents) and come back if the document goes PRIVATE again. Silently
     * dropping rows on a visibility toggle would be a surprising data loss.
     */
    onVisibilityChange(visibility: DocumentVisibilityEnum): Promise<void>;
    get canAdd(): boolean;
    onTargetKindChange(kind: DocsShareTargetKind): void;
    onTeamPicked(team: IOrganizationTeam | null): void;
    addShare(): Promise<void>;
    changeAccess(row: IShareRow, access: DocumentShareAccessEnum): Promise<void>;
    revoke(row: IShareRow): Promise<void>;
    employeeLabel(employee: IEmployee): string;
    /** Employees already holding a share are not offered again (duplicate ⇒ 409). */
    get availableEmployees(): IEmployee[];
    get availableTeams(): IOrganizationTeam[];
    trackRow(_: number, row: IShareRow): string;
    close(): void;
    private toRow;
    /** Team name off the share, then the loaded catalog, then the bare id. */
    private teamShareLabel;
    /** Employee off the share, else the loaded catalog, else an id-only stub. */
    private employeeShareLabel;
    /** Maps the documented share error codes onto readable copy; falls back to the raw error. */
    private handleShareError;
    private orgContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentShareDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocumentShareDialogComponent, "gz-document-share-dialog", never, { "document": { "alias": "document"; "required": false; }; }, {}, never, never, false, never>;
}
export {};
