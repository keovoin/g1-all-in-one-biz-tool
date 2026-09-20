import { OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { IProposal, ComponentLayoutStyleEnum, IOrganization, IProposalViewModel, ProposalStatusEnum, IDateRangePicker, ID } from '@gauzy/contracts';
import { DateRangePickerBuilderService, ErrorHandlingService, ProposalsService, ServerDataSource, Store, ToastrService } from '@gauzy/ui-core/core';
import { ComponentEnum } from '@gauzy/ui-core/common';
import { PaginationFilterBaseComponent } from '@gauzy/ui-core/shared';
import * as i0 from "@angular/core";
export declare class ProposalComponent extends PaginationFilterBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly _store;
    private readonly _dateRangePickerBuilderService;
    private readonly _router;
    private readonly _proposalsService;
    private readonly _toastrService;
    private readonly _dialogService;
    private readonly _errorHandlingService;
    private readonly _httpClient;
    smartTableSettings: any;
    selectedEmployeeId: ID | null;
    selectedDateRange: IDateRangePicker;
    proposals: IProposal[];
    smartTableSource: ServerDataSource;
    dataLayoutStyle: ComponentLayoutStyleEnum;
    componentLayoutStyleEnum: typeof ComponentLayoutStyleEnum;
    viewComponentName: ComponentEnum;
    selectedProposal: IProposalViewModel;
    proposalStatusEnum: typeof ProposalStatusEnum;
    successRate: string;
    totalProposals: number;
    countAccepted: number;
    /** Monotonic guard so an older statistics response cannot overwrite a newer one. */
    private statisticsRequestId;
    loading: boolean;
    disableButton: boolean;
    organization: IOrganization;
    proposals$: Subject<any>;
    private _refresh$;
    /** Typed as any to avoid TemplateRef type mismatch across plugin vs workspace @angular/core. */
    readonly actionButtons: any;
    /** Typed as any to avoid TemplateRef type mismatch across plugin vs workspace @angular/core. */
    readonly visibleButton: any;
    constructor(translateService: TranslateService, _store: Store, _dateRangePickerBuilderService: DateRangePickerBuilderService, _router: Router, _proposalsService: ProposalsService, _toastrService: ToastrService, _dialogService: NbDialogService, _errorHandlingService: ErrorHandlingService, _httpClient: HttpClient);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    /**
     * Sets the view based on the component layout.
     */
    setView(): void;
    /**
     * Navigates to the edit page of a proposal.
     * @param selectedItem - The proposal item for which edit page is to be displayed.
     */
    edit(selectedItem?: IProposal): void;
    /**
     * Navigates to the details page of a proposal.
     * @param selectedItem - The proposal item for which details are to be displayed.
     */
    details(selectedItem?: IProposal): void;
    /**
     * Deletes a proposal after user confirmation.
     * @param selectedItem - The proposal item to be deleted.
     */
    delete(selectedItem?: IProposal): void;
    /**
     * Switches the status of a proposal to "ACCEPTED" after user confirmation.
     * @param selectedItem - The proposal item to be switched.
     */
    switchToAccepted(selectedItem?: IProposal): void;
    /**
     * Switches the status of a proposal to "SENT" after user confirmation.
     * @param selectedItem - The proposal item to be switched.
     */
    switchToSent(selectedItem?: IProposal): void;
    /**
     * Maps a proposal status to a text label and a corresponding badge class.
     * @param cell - The proposal status.
     * @returns {object} - An object containing the text label and badge class.
     */
    private statusMapper;
    /**
     * Load Smart Table settings to configure the component.
     */
    private _loadSmartTableSettings;
    /**
     * Handles the selection of a proposal.
     * @param isSelected - A boolean indicating whether the proposal is selected.
     * @param data - The proposal data.
     */
    selectProposal({ isSelected, data }: {
        isSelected: any;
        data: any;
    }): void;
    setSmartTableSource(): void;
    /**
     * Calculates and updates statistics related to proposals.
     *
     * Over the whole filtered set, not the current page: the old version read
     * `smartTableSource.getData()`, so with server pagination the cards
     * described whichever page happened to be loaded. One relation-free query
     * scoped by the same org/employee/date-range window the table uses keeps
     * the numbers honest; it is bounded by the selected date range.
     */
    private calculateStatistics;
    /**
     * Maps properties of an IProposal object to a new object with a modified structure.
     *
     * @param item - The IProposal object to be mapped.
     * @returns {object} - The mapped object.
     */
    private proposalMapper;
    /**
     * Retrieves proposals, sets up smart table source, and updates component state.
     * @returns {Promise<void>} A Promise that resolves when the operation is complete.
     */
    private getProposals;
    /**
     * Applies translation updates on the smart table when the language changes.
     */
    private _applyTranslationOnSmartTable;
    private clearItem;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<ProposalComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<ProposalComponent, "ga-proposal-list", never, {}, {}, never, never, false, never>;
}
