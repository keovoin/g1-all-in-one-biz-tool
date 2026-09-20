import { OnDestroy, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, AbstractControl } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { TranslateService } from '@ngx-translate/core';
import { HelpCenterActionEnum, HelpCenterFlagEnum, IHelpCenter, ILanguage } from '@gauzy/contracts';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { Store } from '@gauzy/ui-core/core';
import { HelpCenterService } from '@gauzy/ui-core/core';
import * as i0 from "@angular/core";
export declare class KnowledgeBaseComponent extends TranslationBaseComponent implements OnInit, OnDestroy {
    protected readonly dialogRef: NbDialogRef<KnowledgeBaseComponent>;
    readonly translateService: TranslateService;
    private readonly helpCenterService;
    private readonly formBuilder;
    private readonly store;
    base?: IHelpCenter;
    editType: string;
    flagEnum: typeof HelpCenterFlagEnum;
    actionEnum: typeof HelpCenterActionEnum;
    private _flag;
    get flag(): string;
    set flag(value: string);
    private _parentId;
    get parentId(): string;
    set parentId(value: string);
    static buildForm(formBuilder: UntypedFormBuilder): UntypedFormGroup;
    constructor(dialogRef: NbDialogRef<KnowledgeBaseComponent>, translateService: TranslateService, helpCenterService: HelpCenterService, formBuilder: UntypedFormBuilder, store: Store);
    form: UntypedFormGroup;
    icons: {
        label: string;
        value: string;
    }[];
    ngOnInit(): void;
    togglePrivacy(event: boolean): void;
    selectedLanguage(event: ILanguage): void;
    selectedColor(event: any): void;
    patchValue(data: any): void;
    submit(): Promise<void>;
    closeDialog(): void;
    /**
     * Getter for privacy form control value
     */
    get language(): any;
    /**
     * Getter for privacy form control value
     */
    get privacy(): any;
    /**
     * Getter for color form control value
     */
    get color(): any;
    /**
     * Getter for icon form control value
     */
    get icon(): any;
    get name(): AbstractControl;
    get description(): AbstractControl;
    isInvalidControl(control: string): boolean;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<KnowledgeBaseComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<KnowledgeBaseComponent, "ga-knowledge-base-mutation", never, { "base": { "alias": "base"; "required": false; }; "editType": { "alias": "editType"; "required": false; }; "flag": { "alias": "flag"; "required": false; }; "parentId": { "alias": "parentId"; "required": false; }; }, {}, never, never, false, never>;
}
