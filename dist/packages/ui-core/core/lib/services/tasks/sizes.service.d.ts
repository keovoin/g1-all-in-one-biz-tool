import { HttpClient } from '@angular/common/http';
import { ITaskSize } from '@gauzy/contracts';
import { CrudService } from '../crud/crud.service';
import * as i0 from "@angular/core";
export declare class TaskSizesService extends CrudService<ITaskSize> {
    static readonly API_URL = "/api/task-sizes";
    constructor(http: HttpClient);
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskSizesService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<TaskSizesService>;
}
