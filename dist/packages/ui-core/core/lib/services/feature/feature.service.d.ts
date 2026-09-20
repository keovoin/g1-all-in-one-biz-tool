import { HttpClient } from '@angular/common/http';
import { IFeature, IFeatureOrganization, IFeatureOrganizationUpdateInput, IFeatureOrganizationFindInput, IFeatureToggle, IPagination } from '@gauzy/contracts';
import { Observable } from 'rxjs';
import * as i0 from "@angular/core";
export declare class FeatureService {
    private http;
    API_URL: string;
    constructor(http: HttpClient);
    getFeatureToggleDefinition(): Promise<IFeatureToggle[]>;
    getParentFeatures(relations?: string[]): Observable<IPagination<IFeature>>;
    getAllFeatures(): Observable<IPagination<IFeature>>;
    getFeatureOrganizations(where?: IFeatureOrganizationFindInput, relations?: string[]): Observable<IPagination<IFeatureOrganization>>;
    featureToggle(payload: IFeatureOrganizationUpdateInput): Observable<Object>;
    static ɵfac: i0.ɵɵFactoryDeclaration<FeatureService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<FeatureService>;
}
