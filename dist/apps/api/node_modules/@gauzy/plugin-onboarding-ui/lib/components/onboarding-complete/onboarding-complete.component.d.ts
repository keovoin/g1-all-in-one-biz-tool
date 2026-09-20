import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NgxPermissionsService } from 'ngx-permissions';
import { IFeature } from '@gauzy/contracts';
import { ErrorHandlingService, FeatureStoreService, PermissionsService, Store } from '@gauzy/ui-core/core';
import { TranslationBaseComponent } from '@gauzy/ui-core/i18n';
import * as i0 from "@angular/core";
export declare class OnboardingCompleteComponent extends TranslationBaseComponent implements OnInit {
    private readonly _ngxPermissionsService;
    private readonly _router;
    private readonly _store;
    private readonly _permissionsService;
    private readonly _featureStoreService;
    private readonly _errorHandlingService;
    blocks$: Observable<IFeature[][]>;
    features$: Observable<IFeature[]>;
    constructor(translationService: TranslateService, _ngxPermissionsService: NgxPermissionsService, _router: Router, _store: Store, _permissionsService: PermissionsService, _featureStoreService: FeatureStoreService, _errorHandlingService: ErrorHandlingService);
    ngOnInit(): Promise<void>;
    /**
     * Initialize UI permissions
     */
    private initializeUiPermissions;
    /**
     * Get Features
     */
    getFeatures(): void;
    /**
     * Navigate to the specified link
     *
     * @param link The relative link to navigate to.
     */
    navigateTo(link: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<OnboardingCompleteComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<OnboardingCompleteComponent, "ga-onboarding-complete", never, {}, {}, never, never, false, never>;
}
