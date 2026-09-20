import { AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { Router, UrlSerializer } from '@angular/router';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NbDialogService } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { ClipboardService, IClipboardResponse } from 'ngx-clipboard';
import { InviteService, ServerDataSource, Store, ToastrService } from '@gauzy/ui-core/core';
import { InvitationTypeEnum, RolesEnum, ComponentLayoutStyleEnum, IOrganization, IInviteViewModel, IInvite, InviteStatusEnum, PermissionsEnum } from '@gauzy/contracts';
import { ComponentEnum } from '@gauzy/ui-core/common';
import { PaginationFilterBaseComponent } from '../../smart-data-layout/pagination/pagination-filter-base.component';
import * as i0 from "@angular/core";
export declare class InvitesComponent extends PaginationFilterBaseComponent implements AfterViewInit, OnInit, OnDestroy {
    private readonly dialogService;
    private readonly clipboardService;
    private readonly router;
    private readonly _location;
    private readonly _urlSerializer;
    private readonly store;
    private readonly toastrService;
    private readonly translate;
    private readonly inviteService;
    private readonly httpClient;
    InviteStatusEnum: typeof InviteStatusEnum;
    private _invitationType;
    get invitationType(): InvitationTypeEnum;
    set invitationType(value: InvitationTypeEnum);
    loading: boolean;
    disableButton: boolean;
    settingsSmartTable: object;
    smartTableSource: ServerDataSource;
    selectedInvite: IInviteViewModel;
    PermissionsEnum: typeof PermissionsEnum;
    viewComponentName: ComponentEnum;
    dataLayoutStyle: ComponentLayoutStyleEnum;
    componentLayoutStyleEnum: typeof ComponentLayoutStyleEnum;
    invites: IInviteViewModel[];
    invites$: Subject<any>;
    organization: IOrganization;
    private _refresh$;
    constructor(dialogService: NbDialogService, clipboardService: ClipboardService, router: Router, _location: Location, _urlSerializer: UrlSerializer, store: Store, toastrService: ToastrService, translate: TranslateService, inviteService: InviteService, httpClient: HttpClient);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    setView(): void;
    selectInvite({ isSelected, data }: {
        isSelected: any;
        data: any;
    }): void;
    invite(): void;
    /**
     * Copies the invite URL to the clipboard.
     * If a specific invite item is provided, it sets it as the selected invite
     * before generating the URL.
     *
     * @param selectedItem - An optional invite item to select before copying the URL.
     */
    copyToClipboard(selectedItem?: IInviteViewModel): Promise<void>;
    /**
     * Handles the success event after copying text to the clipboard.
     * Displays a success toast message and clears the selected item.
     *
     * @param clipboard - The clipboard response object containing details of the copy action.
     */
    onCopySuccess(clipboard: IClipboardResponse): void;
    /**
     * Handles the failure event when copying text to the clipboard.
     * Displays an error toast message and clears the selected item.
     *
     * @param clipboard - The clipboard response object containing details of the failed copy action.
     */
    onCopyFailure(clipboard: IClipboardResponse): void;
    setSmartTableSource(): void;
    /**
     * Transforms an Invite entity into an object with computed properties.
     *
     * @param invite - The Invite entity to transform.
     * @returns A transformed invite object with additional computed properties.
     */
    transformInvite(invite: IInvite): any;
    /***
     * GET invites
     *
     */
    private getInvites;
    /***
     * GET invites for GRID layout
     *
     */
    private _loadGridLayoutData;
    /**
     * Load smart table settings
     */
    private _loadSmartTableSettings;
    /**
     * Helper function to create a reusable filter function for columns.
     * @param field - The field to filter by.
     */
    private _getFilterFunction;
    deleteInvite(selectedItem?: IInviteViewModel): Promise<void>;
    resendInvite(selectedItem?: IInviteViewModel): Promise<void>;
    getSelectedPersonRole: () => RolesEnum.EMPLOYEE | RolesEnum.CANDIDATE;
    isEmployeeInvitation(): boolean;
    isCandidateInvitation(): boolean;
    private _applyTranslationOnSmartTable;
    clearItem(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<InvitesComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<InvitesComponent, "ga-invites", never, { "invitationType": { "alias": "invitationType"; "required": false; }; }, {}, never, never, false, never>;
}
