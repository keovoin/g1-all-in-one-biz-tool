import { ITaskPriority, ITaskSize, ITaskStatus } from '@gauzy/contracts';
import * as i0 from "@angular/core";
export type ITaskBadge = ITaskStatus | ITaskSize | ITaskPriority;
export declare class TaskBadgeViewComponent {
    private _taskBadge;
    get taskBadge(): ITaskBadge;
    set taskBadge(value: ITaskBadge);
    get textColor(): string;
    get backgroundColor(): string;
    get icon(): string;
    get name(): string;
    get imageFilter(): string;
    static ɵfac: i0.ɵɵFactoryDeclaration<TaskBadgeViewComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<TaskBadgeViewComponent, "gauzy-task-badge-view", never, { "taskBadge": { "alias": "taskBadge"; "required": false; }; }, {}, never, never, false, never>;
}
