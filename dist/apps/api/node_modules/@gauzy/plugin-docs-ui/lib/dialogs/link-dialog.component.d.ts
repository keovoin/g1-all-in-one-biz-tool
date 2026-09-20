import { OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { BaseEntityEnum, ID, IDocument, IDocumentLink } from '@gauzy/contracts';
import { EmployeesService, InvoicesService, OrganizationContactService, OrganizationProjectsService, OrganizationTeamsService, Store, TasksService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { IDocsLinkCandidate, IDocsLinkEntityDescriptor } from '../models/docs-link.model';
import { DocumentsService } from '../services/documents.service';
import * as i0 from "@angular/core";
/**
 * Add-link flow for the detail panel's **Linked records** section
 * (`01-ux-spec.md` §8.9, `02-domain-model.md` `DocumentLink`): pick an entity
 * type, pick a record, create the link. `DOCS_UPDATE` — the caller gates the
 * entry point, this dialog is never reachable without it.
 *
 * Records are loaded per entity type through the existing `@gauzy/ui-core/core`
 * services rather than embedding six different shared selector components: the
 * selectors disagree on value shape (`ISelectedEmployee` vs id vs entity), two
 * of them write global navigation state, and `ga-employee-multi-select` cannot
 * render at all on Documents routes (see `share-dialog.component.ts`). One
 * uniform `nb-select` over `IDocsLinkCandidate` is both smaller and predictable.
 *
 * The label the user picked is persisted into `DocumentLink.metadata.label`, so
 * the panel can render the link without N follow-up fetches — and a record that
 * is later renamed or deleted still shows *something* instead of a bare UUID.
 */
export declare class DocumentLinkDialogComponent extends TranslationBaseComponent implements OnInit {
    readonly translateService: TranslateService;
    private readonly dialogRef;
    private readonly documentsService;
    private readonly tasksService;
    private readonly projectsService;
    private readonly teamsService;
    private readonly employeesService;
    private readonly contactsService;
    private readonly invoicesService;
    private readonly toastrService;
    private readonly store;
    /** The document the new link hangs off. Required. */
    document: IDocument;
    /** Links that already exist — their targets are filtered out of the picker. */
    existing: IDocumentLink[];
    readonly entities: IDocsLinkEntityDescriptor[];
    entity: BaseEntityEnum;
    candidates: IDocsLinkCandidate[];
    selectedId: ID | null;
    search: string;
    loading: boolean;
    saving: boolean;
    constructor(translateService: TranslateService, dialogRef: NbDialogRef<DocumentLinkDialogComponent>, documentsService: DocumentsService, tasksService: TasksService, projectsService: OrganizationProjectsService, teamsService: OrganizationTeamsService, employeesService: EmployeesService, contactsService: OrganizationContactService, invoicesService: InvoicesService, toastrService: ToastrService, store: Store);
    ngOnInit(): void;
    onEntityChange(entity: BaseEntityEnum): Promise<void>;
    /**
     * Loads the pickable records for the current entity type. Every loader is
     * fault-isolated: a service the tenant cannot read (e.g. invoices without the
     * accounting permission) yields an empty picker, never a broken dialog.
     */
    loadCandidates(): Promise<void>;
    private fetchCandidates;
    /**
     * Picker label for a task: the human task key plus the title (e.g.
     * `"EG-42 · Fix the thing"`). `prefix`/`number` are both optional — a task
     * without a number is shown by title alone, one without a project prefix
     * falls back to `#`.
     */
    private taskLabel;
    /** Already-linked targets are hidden — `DocumentLink` is idempotent per (document, entity, entityId). */
    get filtered(): IDocsLinkCandidate[];
    get canConfirm(): boolean;
    confirm(): Promise<void>;
    cancel(): void;
    trackCandidate(_: number, candidate: IDocsLinkCandidate): string;
    private orgContext;
    static ɵfac: i0.ɵɵFactoryDeclaration<DocumentLinkDialogComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<DocumentLinkDialogComponent, "gz-docs-link-dialog", never, { "document": { "alias": "document"; "required": false; }; "existing": { "alias": "existing"; "required": false; }; }, {}, never, never, false, never>;
}
