import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NbDialogService, NbTabComponent } from '@nebular/theme';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { IEmployeeProposalTemplate, IEmployeeProposalTemplateMakeDefaultInput, IOrganization, ISelectedEmployee } from '@gauzy/contracts';
import { ErrorHandlingService, ProposalTemplateService, ServerDataSource, Store, ToastrService } from '@gauzy/ui-core/core';
import { I18nService } from '@gauzy/ui-core/i18n';
import { IRecordViewSection, Nl2BrPipe, PaginationFilterBaseComponent, TruncatePipe } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
export declare enum ProposalTemplateTabsEnum {
    ACTIONS = "ACTIONS",
    SEARCH = "SEARCH"
}
export declare class ProposalTemplateListComponent extends PaginationFilterBaseComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly _store;
    private readonly _toastrService;
    private readonly _proposalTemplateService;
    private readonly _dialogService;
    private readonly _nl2BrPipe;
    private readonly _truncatePipe;
    private readonly _http;
    private readonly _route;
    private readonly _errorHandlingService;
    private readonly _ngxPermissionsService;
    private readonly _i18nService;
    smartTableSettings: any;
    disableButton: boolean;
    loading: boolean;
    smartTableSource: ServerDataSource;
    selectedEmployee: ISelectedEmployee;
    selectedItem: any;
    proposalTemplateTabsEnum: typeof ProposalTemplateTabsEnum;
    templates$: Subject<any>;
    organization: IOrganization;
    nbTab$: Subject<string>;
    viewedTemplate: IEmployeeProposalTemplate;
    viewSections: IRecordViewSection[];
    /** Typed as any to avoid TemplateRef type mismatch across plugin vs workspace @angular/core. */
    readonly actionButtons: any;
    /** Typed as any to avoid TemplateRef type mismatch across plugin vs workspace @angular/core. */
    readonly visibleButton: any;
    constructor(translateService: TranslateService, _store: Store, _toastrService: ToastrService, _proposalTemplateService: ProposalTemplateService, _dialogService: NbDialogService, _nl2BrPipe: Nl2BrPipe, _truncatePipe: TruncatePipe, _http: HttpClient, _route: ActivatedRoute, _errorHandlingService: ErrorHandlingService, _ngxPermissionsService: NgxPermissionsService, _i18nService: I18nService);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    private initializeUiPermissions;
    private initializeUiLanguagesAndLocale;
    setSmartTableSource(): void;
    getProposalTemplates(): Promise<void>;
    selectProposalTemplate({ isSelected, data }: {
        isSelected: any;
        data: any;
    }): void;
    /**
     * Opens the read-only View of a proposal template in the right-side drawer.
     *
     * @param selectedItem - Row the action was invoked from, when it came from the grid.
     */
    viewProposalTemplate(selectedItem?: IEmployeeProposalTemplate): void;
    closeView(): void;
    /**
     * Field descriptor for the drawer — the grid columns, read vertically, plus
     * the full template body the grid truncates.
     */
    private buildViewSections;
    private _loadSmartTableSettings;
    createProposalTemplate(): Promise<void>;
    editProposalTemplate(): Promise<void>;
    deleteProposalTemplate(selectedItem?: IEmployeeProposalTemplate): void;
    makeDefaultTemplate(input: IEmployeeProposalTemplateMakeDefaultInput): Promise<void>;
    clearItem(): void;
    private _applyTranslationOnSmartTable;
    onTabChange(tab: NbTabComponent): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalTemplateListComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProposalTemplateListComponent, "ga-proposal-template-list", never, {}, {}, never, never, false, never>;
}
