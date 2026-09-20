import { HttpClient } from '@angular/common/http';
import { ITaskStatus } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class TaskStatusesService extends CrudService<ITaskStatus> {
    static readonly API_URL = "/api/task-statuses";
    constructor(http: HttpClient);
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskStatusesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TaskStatusesService>;
}
