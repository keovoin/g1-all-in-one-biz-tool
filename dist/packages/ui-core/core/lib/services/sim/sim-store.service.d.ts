import { Observable } from 'rxjs';
import { ISimExecutionRecord } from './sim.service';
import * as i0 from "@angular/core";
export declare class SimStoreService {
    private readonly _selectedIntegrationId$;
    selectedIntegrationId$: Observable<string | null>;
    private readonly _executions$;
    executions$: Observable<ISimExecutionRecord[]>;
    setSelectedIntegrationId(id: string | null): void;
    setExecutions(executions: ISimExecutionRecord[]): void;
    reset(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SimStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SimStoreService>;
}
