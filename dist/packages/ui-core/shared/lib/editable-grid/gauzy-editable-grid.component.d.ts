import { OnInit, TemplateRef, EventEmitter, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { NbDialogService } from '@nebular/theme';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export type ItemActionType = 'create' | 'edit' | 'delete';
export declare class GauzyEditableGridComponent<T extends {
    id?: string;
}> extends TranslationBaseComponent implements OnInit, OnDestroy {
    readonly translateService: TranslateService;
    private readonly dialogService;
    items: T[];
    itemTmpl?: TemplateRef<{
        $implicit: any;
    }>;
    addDialogTmpl: TemplateRef<any>;
    editDialogTmpl: TemplateRef<any>;
    deleteDialogTmpl: TemplateRef<any>;
    dialogData: EventEmitter<any>;
    selectedItem: T;
    currentAction: ItemActionType;
    constructor(translateService: TranslateService, dialogService: NbDialogService);
    ngOnInit(): void;
    toggleItemSelection(item: T): void;
    openDialog(itemAction: ItemActionType, template: TemplateRef<any>): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<GauzyEditableGridComponent<any>, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<GauzyEditableGridComponent<any>, "ga-editable-grid", never, { "items": { "alias": "items"; "required": false; }; "itemTmpl": { "alias": "itemTmpl"; "required": false; }; "addDialogTmpl": { "alias": "addDialogTmpl"; "required": false; }; "editDialogTmpl": { "alias": "editDialogTmpl"; "required": false; }; "deleteDialogTmpl": { "alias": "deleteDialogTmpl"; "required": false; }; }, { "dialogData": "dialogData"; }, never, never, false, never>;
}
