import { IFeature, IFeatureOrganization, IFeatureOrganizationUpdateInput, IFeatureOrganizationFindInput, IPagination } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import { FeatureService } from './feature.service';
import * as i0 from "@angular/core";
export declare class FeatureStoreService {
    private readonly _featureService;
    private _features$;
    features$: Observable<IFeature[]>;
    private _blocks$;
    blocks$: Observable<IFeature[][]>;
    private _featureOrganizations$;
    featureOrganizations$: Observable<IFeatureOrganization[]>;
    private _featureToggles$;
    featureToggles$: Observable<any>;
    constructor(_featureService: FeatureService);
    loadUnleashFeatures(): Observable<import("@gauzy/contracts").IFeatureToggle[]>;
    loadFeatures(relations?: string[]): Observable<IPagination<IFeature>>;
    loadFeatureOrganizations(relations?: string[], findInput?: IFeatureOrganizationFindInput): Observable<IPagination<IFeatureOrganization>>;
    changedFeature(payload: IFeatureOrganizationUpdateInput): Observable<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<FeatureStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FeatureStoreService>;
}
