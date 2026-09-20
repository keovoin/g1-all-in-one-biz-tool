import { HelpCenterActionEnum, IHelpCenter, IOrganization } from '@gauzy/contracts';
import { OnInit, OnDestroy, EventEmitter, AfterViewInit } from '@angular/core';
import { ITreeOptions } from '@ali-hm/angular-tree-component';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { ErrorHandlingService, HelpCenterService, Store, ToastrService } from '@gauzy/ui-core/core';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService, NbMenuItem, NbMenuService } from '@nebular/theme';
import * as i0 from "@angular/core";
export declare class SidebarComponent extends TranslationBaseComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly dialogService;
    private readonly toastrService;
    private helpService;
    readonly translateService: TranslateService;
    private errorHandler;
    private nbMenuService;
    private store;
    organization: IOrganization;
    actionEnum: typeof HelpCenterActionEnum;
    tempNodes: IHelpCenter[];
    nodeId: string;
    isChosenNode: boolean;
    nodes: IHelpCenter[];
    settingsContextMenu: NbMenuItem[];
    /**
     *
     */
    options: ITreeOptions;
    /**
     *
     */
    clickedNode: EventEmitter<IHelpCenter>;
    deletedNode: EventEmitter<any>;
    /**
     *
     */
    private tree;
    constructor(dialogService: NbDialogService, toastrService: ToastrService, helpService: HelpCenterService, translateService: TranslateService, errorHandler: ErrorHandlingService, nbMenuService: NbMenuService, store: Store);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    setClasses(node: any): {
        child: boolean;
        childout: boolean;
        parent: boolean;
        parentin: boolean;
    };
    addEditBase(editType: string): Promise<void>;
    addEditCategory(editType: string, node?: IHelpCenter): Promise<void>;
    deleteCategory(node: any): Promise<void>;
    deleteBase(): Promise<void>;
    updateIndexes(oldChildren: IHelpCenter[], newChildren: IHelpCenter[]): Promise<void>;
    onMoveNode($event: any): Promise<void>;
    onNodeClicked(node: any): void;
    addIcon(): Promise<void>;
    changePrivacy(node: any): Promise<void>;
    loadMenu(): Promise<void>;
    sortMenu(nodes: any): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SidebarComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SidebarComponent, "ga-sidebar", never, {}, { "clickedNode": "clickedNode"; "deletedNode": "deletedNode"; }, never, never, false, never>;
}
