import { ICandidatePersonalQualities, ICandidateTechnologies } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export declare class CommunicationService {
    private technologyAddedSource;
    private technologyRemovedSource;
    private qualityAddedSource;
    private qualityRemovedSource;
    technologyAdded$: import("rxjs").Observable<ICandidateTechnologies>;
    technologyRemoved$: import("rxjs").Observable<string>;
    qualityAdded$: import("rxjs").Observable<ICandidatePersonalQualities>;
    qualityRemoved$: import("rxjs").Observable<string>;
    addTechnology(technology: ICandidateTechnologies): void;
    removeTechnology(technologyId: string): void;
    addQuality(quality: ICandidatePersonalQualities): void;
    removeQuality(qualityId: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CommunicationService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CommunicationService>;
}
