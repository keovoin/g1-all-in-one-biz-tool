import { HttpClient } from '@angular/common/http';
import { ITaskPriority } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class TaskPrioritiesService extends CrudService<ITaskPriority> {
    static readonly API_URL = "/api/task-priorities";
    constructor(http: HttpClient);
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskPrioritiesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TaskPrioritiesService>;
}
