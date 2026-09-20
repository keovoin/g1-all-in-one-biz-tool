import { Observable } from 'rxjs';
import { IOrganizationSprint, IGetSprintsOptions, ITask } from '@gauzy/contracts';
import { SprintService } from './organization-sprint.service';
import * as i0 from "@angular/core";
export declare class SprintStoreService {
    private readonly sprintService;
    private _sprints$;
    sprints$: Observable<IOrganizationSprint[]>;
    private get sprints();
    constructor(sprintService: SprintService);
    fetchSprints(findInput?: IGetSprintsOptions): void;
    loadAllSprints(sprints: IOrganizationSprint[]): void;
    createSprint(newSprint: IOrganizationSprint): Observable<IOrganizationSprint>;
    updateSprint(editedSprint: IOrganizationSprint): Observable<IOrganizationSprint>;
    deleteSprint(id: string): Observable<void>;
    moveTaskToSprint(sprintId: string, task: ITask): Observable<IOrganizationSprint>;
    static ɵfac: i0.ɵɵFactoryDeclaration<SprintStoreService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SprintStoreService>;
}
