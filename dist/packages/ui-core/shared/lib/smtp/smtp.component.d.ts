import { AfterViewInit, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, FormGroupDirective } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ICustomSmtp, IOrganization, IUser, PermissionsEnum, SMTPSecureEnum } from '@gauzy/contracts';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@gauzy/ui-core/core';
import { CustomSmtpService, ToastrService } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import { FormHelpers } from '../forms/helpers';
import * as i0 from "@angular/core";
export declare class SMTPComponent extends TranslationBaseComponent implements OnInit, OnChanges, AfterViewInit {
    private readonly _activatedRoute;
    private readonly fb;
    private readonly customSmtpService;
    readonly translate: TranslateService;
    private readonly toastrService;
    private readonly store;
    formDirective: FormGroupDirective;
    organization?: IOrganization;
    isOrganization?: boolean;
    loading: boolean;
    secureOptions: {
        label: SMTPSecureEnum;
        value: boolean;
    }[];
    customSmtp: ICustomSmtp;
    user: IUser;
    isValidated: boolean;
    isWrapped: boolean;
    PermissionsEnum: typeof PermissionsEnum;
    FormHelpers: typeof FormHelpers;
    form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    constructor(_activatedRoute: ActivatedRoute, fb: UntypedFormBuilder, customSmtpService: CustomSmtpService, translate: TranslateService, toastrService: ToastrService, store: Store);
    ngOnInit(): void;
    ngOnChanges(change: SimpleChanges): void;
    ngAfterViewInit(): void;
    getTenantSmtpSetting(): void;
    patchValue(): void;
    globalSmtpPatch(setting: any): void;
    onSubmit(): void;
    saveSetting(): void;
    updateSetting(): void;
    /**
     * Validate SMTP Credentials
     */
    validateSmtp(): Promise<void>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SMTPComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<SMTPComponent, "ng-component", never, { "organization": { "alias": "organization"; "required": false; }; "isOrganization": { "alias": "isOrganization"; "required": false; }; }, {}, never, never, false, never>;
}
