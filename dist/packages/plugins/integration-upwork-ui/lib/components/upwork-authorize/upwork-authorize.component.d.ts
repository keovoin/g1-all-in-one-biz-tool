import { OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { IOrganization, IUpworkClientSecretPair } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class UpworkAuthorizeComponent implements OnInit {
    private readonly _fb;
    private readonly _upworkService;
    private readonly _activatedRoute;
    private readonly _router;
    private readonly _store;
    private readonly _integrationsService;
    protected rememberState: boolean;
    protected organization: IOrganization;
    protected readonly form: UntypedFormGroup;
    static buildForm(fb: UntypedFormBuilder): UntypedFormGroup;
    ngOnInit(): void;
    private _getUpworkVerifier;
    /**
     * Upwork integration remember state API call
     */
    private _checkRememberState;
    /**
     * Starts the Upwork OAuth handshake, or opens the integration that already completed it.
     *
     * @param config The Upwork consumer key and secret typed into the form.
     */
    protected authorizeUpwork(config: IUpworkClientSecretPair): void;
    /**
     *
     * @param integrationId
     */
    private _redirectToUpworkIntegration;
    static ɵfac: i0.ɵɵFactoryDeclaration<UpworkAuthorizeComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<UpworkAuthorizeComponent, "ngx-upwork-authorize", never, {}, {}, never, never, false, never>;
}
